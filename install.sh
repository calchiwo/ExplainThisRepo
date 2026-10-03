#!/usr/bin/env sh

set -eu

REPO="calchiwo/ExplainThisRepo"
BINARY_NAME="explainthisrepo"
API_URL="https://api.github.com/repos/${REPO}/releases/latest"
RELEASE_BASE_URL="https://github.com/${REPO}/releases/download"

INSTALL_DIR="${EXPLAINTHISREPO_INSTALL_DIR:-/usr/local/bin}"

TMP_DIR=""

cleanup() {
    if [ -n "${TMP_DIR}" ] && [ -d "${TMP_DIR}" ]; then
        rm -rf "${TMP_DIR}"
    fi
}

trap cleanup EXIT INT TERM

fail() {
    echo "Error: $*" >&2
    exit 1
}

info() {
    echo "==> $*"
}

require_command() {
    command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

# Prerequisites

require_command uname
require_command curl
require_command tar
require_command mktemp
require_command chmod
require_command mv
require_command mkdir
require_command rm

# sha256sum exists on Linux.
# shasum is normally available on macOS.
if command -v sha256sum >/dev/null 2>&1; then
    SHA256_TOOL="sha256sum"
elif command -v shasum >/dev/null 2>&1; then
    SHA256_TOOL="shasum"
else
    fail "Neither sha256sum nor shasum is available"
fi

# Detect operating system

OS="$(uname -s)"

case "${OS}" in
    Linux)
        OS_TARGET="linux"
        ;;

    Darwin)
        OS_TARGET="darwin"
        ;;

    *)
        fail "Unsupported operating system: ${OS}. Supported systems are Linux and macOS."
        ;;
esac

# Detect architecture

MACHINE="$(uname -m)"

case "${MACHINE}" in
    x86_64|amd64)
        ARCH="x64"
        ;;

    arm64|aarch64)
        ARCH="arm64"
        ;;

    *)
        fail "Unsupported architecture: ${MACHINE}. Supported architectures are x64 and arm64."
        ;;
esac

TARGET="${OS_TARGET}-${ARCH}"

# Resolve latest release

info "Detecting latest ExplainThisRepo release..."

RELEASE_JSON="$(
    curl \
        --fail \
        --silent \
        --show-error \
        --location \
        --retry 3 \
        --retry-delay 1 \
        --header "Accept: application/vnd.github+json" \
        --header "X-GitHub-Api-Version: 2026-03-10" \
        "${API_URL}"
)" || fail "Could not contact GitHub to determine the latest release."

VERSION="$(
    printf '%s\n' "${RELEASE_JSON}" |
        sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' |
        head -n 1
)"

[ -n "${VERSION}" ] ||
    fail "Could not determine the latest ExplainThisRepo release."

case "${VERSION}" in
    v[0-9]*)
        ;;
    *)
        fail "GitHub returned an invalid release tag: ${VERSION}"
        ;;
esac

# Construct artifact names

ARCHIVE_NAME="${BINARY_NAME}-${VERSION}-cli-installer-${TARGET}.tar.gz"
CHECKSUM_NAME="${ARCHIVE_NAME}.sha256"

ARCHIVE_URL="${RELEASE_BASE_URL}/${VERSION}/${ARCHIVE_NAME}"
CHECKSUM_URL="${RELEASE_BASE_URL}/${VERSION}/${CHECKSUM_NAME}"

info "Release: ${VERSION}"
info "Platform: ${TARGET}"
info "Archive: ${ARCHIVE_NAME}"

# Temporary workspace

TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t explainthisrepo)"

ARCHIVE_PATH="${TMP_DIR}/${ARCHIVE_NAME}"
CHECKSUM_PATH="${TMP_DIR}/${CHECKSUM_NAME}"
EXTRACT_DIR="${TMP_DIR}/extracted"

mkdir -p "${EXTRACT_DIR}"

# Download archive

info "Downloading installer archive..."

curl \
    --fail \
    --silent \
    --show-error \
    --location \
    --retry 3 \
    --retry-delay 1 \
    --output "${ARCHIVE_PATH}" \
    "${ARCHIVE_URL}" ||
    fail "Could not download ${ARCHIVE_NAME}"

# Download checksum

info "Downloading SHA256 checksum..."

curl \
    --fail \
    --silent \
    --show-error \
    --location \
    --retry 3 \
    --retry-delay 1 \
    --output "${CHECKSUM_PATH}" \
    "${CHECKSUM_URL}" ||
    fail "Could not download ${CHECKSUM_NAME}"

# Verify archive integrity

info "Verifying archive integrity..."

case "${SHA256_TOOL}" in
    sha256sum)
        (
            cd "${TMP_DIR}"
            sha256sum -c "${CHECKSUM_NAME}"
        ) || fail "SHA256 verification failed."
        ;;

    shasum)
        EXPECTED_HASH="$(
            sed -n 's/^\([0-9a-fA-F]\{64\}\).*/\1/p' "${CHECKSUM_PATH}" |
                head -n 1
        )"

        [ -n "${EXPECTED_HASH}" ] ||
            fail "Invalid SHA256 checksum file."

        ACTUAL_HASH="$(
            shasum -a 256 "${ARCHIVE_PATH}" |
                awk '{print $1}'
        )"

        if [ "${EXPECTED_HASH}" != "${ACTUAL_HASH}" ]; then
            fail "SHA256 verification failed."
        fi
        ;;
esac

info "SHA256 verification passed."

# Extract archive

info "Extracting archive..."

tar \
    --extract \
    --gzip \
    --file "${ARCHIVE_PATH}" \
    --directory "${EXTRACT_DIR}" ||
    fail "Could not extract ${ARCHIVE_NAME}"

# Validate archive contents

EXPECTED_BINARY="${BINARY_NAME}"

FILE_COUNT="$(
    find "${EXTRACT_DIR}" -type f -print |
        wc -l |
        tr -d ' '
)"

[ "${FILE_COUNT}" = "1" ] ||
    fail "Installer archive is invalid: expected exactly one file."

EXTRACTED_BINARY="${EXTRACT_DIR}/${EXPECTED_BINARY}"

[ -f "${EXTRACTED_BINARY}" ] ||
    fail "Installer archive is invalid: expected ${EXPECTED_BINARY}."

# Reject nested directories or unexpected paths.
DIRECTORY_COUNT="$(
    find "${EXTRACT_DIR}" -type d -mindepth 1 -print |
        wc -l |
        tr -d ' '
)"

[ "${DIRECTORY_COUNT}" = "0" ] ||
    fail "Installer archive is invalid: it contains nested directories."

# Prepare installation directory

if [ ! -d "${INSTALL_DIR}" ]; then
    info "Creating ${INSTALL_DIR}..."

    if mkdir -p "${INSTALL_DIR}" 2>/dev/null; then
        :
    elif command -v sudo >/dev/null 2>&1; then
        sudo mkdir -p "${INSTALL_DIR}"
    else
        fail "Cannot create ${INSTALL_DIR} and sudo is not available."
    fi
fi

# Install binary

chmod 0755 "${EXTRACTED_BINARY}" ||
    fail "Could not make ${BINARY_NAME} executable."

DESTINATION="${INSTALL_DIR}/${BINARY_NAME}"

if [ -w "${INSTALL_DIR}" ]; then
    mv "${EXTRACTED_BINARY}" "${DESTINATION}" ||
        fail "Could not install ${BINARY_NAME} to ${INSTALL_DIR}."
else
    if command -v sudo >/dev/null 2>&1; then
        info "Administrator permission is required to install to ${INSTALL_DIR}."
        sudo mv "${EXTRACTED_BINARY}" "${DESTINATION}" ||
            fail "Could not install ${BINARY_NAME} to ${INSTALL_DIR}."
    else
        fail "Cannot write to ${INSTALL_DIR} and sudo is not available."
    fi
fi

# Ensure the final installed file is executable.
if [ ! -x "${DESTINATION}" ]; then
    if command -v sudo >/dev/null 2>&1 && [ ! -w "${INSTALL_DIR}" ]; then
        sudo chmod 0755 "${DESTINATION}"
    else
        chmod 0755 "${DESTINATION}"
    fi
fi

# Verify installation

if [ ! -x "${DESTINATION}" ]; then
    fail "Installation completed but ${DESTINATION} is not executable."
fi

info "Installed ExplainThisRepo ${VERSION}."
info "Location: ${DESTINATION}"

# /usr/local/bin is normally already in PATH.
# A shell process cannot modify the PATH of its parent shell, so
# explicitly explain the only remaining user-side issue if needed.

case ":${PATH}:" in
    *":${INSTALL_DIR}:"*)
        info "Run: ${BINARY_NAME}"
        ;;

    *)
        echo
        echo "The binary was installed successfully, but ${INSTALL_DIR} is not in your PATH."
        echo "Add ${INSTALL_DIR} to your PATH, then run:"
        echo "  ${BINARY_NAME}"
        ;;
esac