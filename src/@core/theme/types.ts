declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      dark: string
      main: string
      light: string
      background1: string
      darkBg: string
      lightBg: string
      background2: string
      background3: string
      primaryGradient: string
    }
  }
  interface PaletteOptions {
    customColors?: {
      dark?: string
      main?: string
      light?: string
      background1?: string
      darkBg?: string
      lightBg?: string
      background2?: string
      background3?: string
      primaryGradient?: string
    }
  }
}

export {}
