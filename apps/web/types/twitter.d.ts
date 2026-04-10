declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: Element | null) => Promise<void>
      }
    }
  }
}

export {}
