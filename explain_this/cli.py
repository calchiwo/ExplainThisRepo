import sys
from explain_this.github import fetch_repo, fetch_readme
from explain_this.prompt import build_prompt
from explain_this.generate import generate_explanation
from explain_this.writer import write_output


def main():
    if len(sys.argv) != 2:
        print("Usage: explain-this owner/repo")
        sys.exit(1)

    target = sys.argv[1]

    if "/" not in target or target.count("/") != 1:
        print("Invalid format. Use owner/repo")
        sys.exit(1)

    owner, repo = target.split("/")

    if not owner or not repo:
        print("Invalid format. Use owner/repo")
        sys.exit(1)

    print(f"Fetching {owner}/{repo}...")

    try:
        repo_data = fetch_repo(owner, repo)
        readme = fetch_readme(owner, repo)
    except Exception as e:
        print(str(e))
        sys.exit(1)

    prompt = build_prompt(
        repo_name=repo_data.get("full_name"),
        description=repo_data.get("description"),
        readme=readme,
    )

    print("Generating explanation...")

    try:
        output = generate_explanation(prompt)
    except Exception as e:
        print("Failed to generate explanation")
        print(str(e))
        sys.exit(1)

    write_output(output)

    print("EXPLAIN.md generated successfully.")


if __name__ == "__main__":
    main()

