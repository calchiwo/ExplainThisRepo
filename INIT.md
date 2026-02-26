# Initialization (`init`)

The `init` command bootstraps ExplainThisRepo by creating a local, persistent configuration file.

It is designed to be safe, offline, and one-time.

---

## What `init` does

- Prompts once for your `GEMINI_API_KEY`
- Writes a minimal `config.toml` file to the OS-appropriate config directory
- Exits immediately

No analysis is performed.

---

## What `init` does NOT do

- No network requests are made
- No API key validation occurs
- No data is sent to any server
- No environment variables are modified
- No input is logged or echoed to the terminal

The API key is written locally only.

---

## Input handling

- Input is read with terminal-level hidden input
- Characters are not echoed or masked
- Paste works normally
- Ctrl+C exits cleanly without writing partial state

---

## Config location

A single authoritative config path is used per OS.

- **Windows**  
  `%APPDATA%\ExplainThisRepo\config.toml`

- **macOS / Linux**  
  `$XDG_CONFIG_HOME/explainthisrepo/config.toml`  
  Fallback: `~/.config/explainthisrepo/config.toml`

---

## Design intent

`init` exists to separate **bootstrap** from **analysis**.

After initialization:
- All analysis commands can run without setup
- Future binaries (pip, npm) can share the same config
- No repeated prompting is required

This establishes a stable foundation for long-term usage.