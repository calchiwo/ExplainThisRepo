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
}

export async function runInit(): Promise<void> {

  const err = process.stderr

  err.write(
    chalk.yellow(
      "WARNING: input is hidden where applicable. Configuration will be written once.\n\n"
    )
  )

  try {

    const provider = await promptProvider()
    const providerConfig = await promptProviderConfig(provider)

    const lines: string[] = [
      "[llm]",
      `provider = "${provider}"`,
      "",
      `[providers.${provider}]`
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
  err.write("  4) Anthropic\n")

  const choice = (await prompt("> ")).trim()

  const provider = PROVIDERS[choice]

  if (!provider) {
    throw new Error("invalid provider selection")
  }

  return provider

}

async function promptProviderConfig(provider: string): Promise<Record<string, string>> {

  if (provider === "gemini") {

    const key = (await promptHidden("Gemini API key: ")).trim()

    if (!key) {
      throw new Error("API key cannot be empty")
    }

    return { api_key: key }

  }

  if (provider === "openai") {

    const key = (await promptHidden("OpenAI API key: ")).trim()

    if (!key) {
      throw new Error("API key cannot be empty")
    }

    return { api_key: key }

  }

  if (provider === "ollama") {

    const model = (await prompt("Ollama model (e.g. llama3, glm-5:cloud): ")).trim()

    if (!model) {
      throw new Error("Model cannot be empty")
    }

    const host =
      (await prompt("Ollama host [http://localhost:11434]: ")).trim()
      || "http://localhost:11434"

    return {
      model,
      host
    }

  }

  if (provider === "anthropic") {

    const key = (await promptHidden("Anthropic API key: ")).trim()

    if (!key) {
      throw new Error("API key cannot be empty")
    }

    return { api_key: key }
  }

  throw new Error(`Unsupported provider: ${provider}`)

}

function prompt(label: string): Promise<string> {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true
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
      terminal: true
    }) as HiddenReadlineInterface

    rl._writeToOutput = () => {}

    rl.question("", (answer) => {
      rl.close()
      err.write("\n")
      resolve(answer)
    })

  })

}