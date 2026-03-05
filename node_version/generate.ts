import { getActiveProvider } from "./providers/registry.js"

export async function generateExplanation(
  prompt: string,
  providerOverride?: string
): Promise<string> {

  const provider = getActiveProvider(providerOverride)

  try {

    const output = await provider.generate(prompt)

    if (!output || !output.trim()) {
      throw new Error(`${provider.name} returned no output`)
    }

    return output.trim()

  } catch (err: any) {

    const message =
      err?.message ? String(err.message) : String(err)

    throw new Error(
      `${provider.name} generation failed: ${message}`
    )

  }

}