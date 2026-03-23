import readline, { Interface as ReadlineInterface } from "node:readline"
import process from "node:process"
import chalk from "chalk"

import { writeConfig } from "./config.js"

interface HiddenReadlineInterface extends ReadlineInterface {
  _writeToOutput: (stringToWrite: string) => void
}

const PROVIDERS: Record<string, string> = {
  "1": "gemini",
  "2": "openai",
  "3": "ollama",
  "4": "anthropic",
  "5": "groq",
  "6": "openrouter",
}

export async function runInit(): Promise<void> {
  const err = process.stderr

  err.write(
    chalk.yellow(
      "WARNING: input is hidden where applicable. Configuration will be written once.\n\n",
    ),
  )

  try {
    const provider = await promptProvider()
    const providerConfig = await promptProviderConfig(provider)

    const lines: string[] = [
      "[llm]",
      `provider = "${provider}"`,
      "",
      `[providers.${provider}]`,
    ]

    for (const [k, v] of Object.entries(providerConfig)) {
      lines.push(`${k} = "${v}"`)
    }

    const contents = lines.join("\n") + "\n"

    writeConfig(contents)

    err.write(chalk.green("Configuration written.\n"))
    process.exit(0)
  } catch (err: any) {
    if (err?.name === "AbortError") {
      process.stderr.write(chalk.red("\nInterrupted.\n"))
      process.exit(130)
    }

    process.stderr.write(chalk.red(`error: ${err?.message ?? err}\n`))
    process.exit(1)
  }
}

async function promptProvider(): Promise<string> {
  const err = process.stderr

  err.write(chalk.bold("Select LLM provider:\n"))
  err.write("  1) Gemini\n")
  err.write("  2) OpenAI\n")
  err.write("  3) Ollama (local)\n")
  err.write("  4) Anthropic (Claude)\n")
  err.write("  5) Groq\n")
  err.write("  6) OpenRouter\n")

  const choice = (await prompt("> ")).trim()

  const provider = PROVIDERS[choice]

  if (!provider) {
    throw new Error("invalid provider selection")
  }

  return provider
}

async function promptProviderConfig(
  provider: string,
): Promise<Record<string, string>> {

  if (provider === "gemini") {
    const key = (await promptHidden("Gemini API key: ")).trim()

    if (!key) throw new Error("API key cannot be empty")

    return { api_key: key }
  }

  if (provider === "openai") {
    const key = (await promptHidden("OpenAI API key: ")).trim()

    if (!key) throw new Error("API key cannot be empty")

    return { api_key: key }
  }

  if (provider === "anthropic") {
    const key = (await promptHidden("Anthropic (Claude) API key: ")).trim()

    if (!key) throw new Error("API key cannot be empty")

    return { api_key: key }
  }

  if (provider === "ollama") {
    const model = (
      await prompt("Ollama model (e.g. llama3, glm-5:cloud, gemma3:4b): ")
    ).trim()

    if (!model) throw new Error("Model cannot be empty")

    const host =
      (await prompt("Ollama host [http://localhost:11434]: ")).trim() ||
      "http://localhost:11434"

    return { model, host }
  }

  if (provider === "groq") {
    const key = (await promptHidden("Groq API key: ")).trim()

    if (!key) throw new Error("API key cannot be empty")

    const err = process.stderr

    err.write(chalk.bold("Select Groq model:\n"))
    err.write("  1) llama3-70b-8192\n")
    err.write("  2) mixtral-8x7b\n")
    err.write("  3) deepseek-r1-distill-llama-70b\n")

    const choice = (await prompt("> ")).trim()

    const modelMap: Record<string, string> = {
      "1": "llama3-70b-8192",
      "2": "mixtral-8x7b",
      "3": "deepseek-r1-distill-llama-70b",
    }

    const model = modelMap[choice]

    if (!model) throw new Error("Invalid model selection")

    return {
      api_key: key,
      model,
    }
  }

  if (provider === "openrouter") {
    const key = (await promptHidden("OpenRouter API key: ")).trim()

    if (!key) throw new Error("API key cannot be empty")

    const err = process.stderr

    err.write(chalk.bold("Select OpenRouter model:\n"))
    err.write("  1) openai/gpt-4o (balanced)\n")
    err.write("  2) anthropic/claude-3.5-sonnet (reasoning)\n")
    err.write("  3) meta-llama/llama-3-70b-instruct (open)\n")
    err.write("  4) deepseek/deepseek-chat (cheap/fast)\n")
    err.write("  5) Enter model manually\n")

    const choice = (await prompt("> ")).trim()

    const modelMap: Record<string, string> = {
      "1": "openai/gpt-4o",
      "2": "anthropic/claude-3.5-sonnet",
      "3": "meta-llama/llama-3-70b-instruct",
      "4": "deepseek/deepseek-chat",
    }

    let model: string

    if (choice === "5") {
      model = (await prompt("Enter model (provider/model): ")).trim()
    } else {
      model = modelMap[choice]
      if (!model) throw new Error("Invalid model selection")
    }

    if (!model || !model.trim()) {
      throw new Error("Model cannot be empty")
    }

    return {
      api_key: key,
      model,
    }
  }

  throw new Error(`Unsupported provider: ${provider}`)
}

function prompt(label: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true,
  })

  return new Promise((resolve) => {
    rl.question(label, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

function promptHidden(label: string): Promise<string> {
  const err = process.stderr

  return new Promise((resolve) => {
    err.write(label)

    const rl = readline.createInterface({
      input: process.stdin,
      output: undefined,
      terminal: true,
    }) as HiddenReadlineInterface

    rl._writeToOutput = () => {}

    rl.question("", (answer) => {
      rl.close()
      err.write("\n")
      resolve(answer)
    })
  })
}