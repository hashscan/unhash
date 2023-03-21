import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
export const JetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

// primary Sans Serif font for the UI
export const Lausanne = localFont({
  src: [
    {
      path: './Lausanne/Lausanne-200.woff2',
      weight: '200'
    },
    {
      path: './Lausanne/Lausanne-300.woff2',
      weight: '300'
    },
    {
      path: './Lausanne/Lausanne-400.woff2',
      weight: '400'
    },
    {
      path: './Lausanne/Lausanne-500.woff2',
      weight: '500'
    },
    {
      path: './Lausanne/Lausanne-600.woff2',
      weight: '600'
    }
  ],
  fallback: ['system-ui'],
  display: 'swap'
})
