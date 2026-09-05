import type { TextStyle } from 'react-native'
import { colors } from './colors'

/** Noms de familles tels qu'enregistrés par expo-font (voir use-app-fonts.ts). */
export const families = {
  text: 'AtkinsonHyperlegible_400Regular',
  textBold: 'AtkinsonHyperlegible_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  math: 'STIXTwoText_400Regular',
  mathItalic: 'STIXTwoText_400Regular_Italic',
} as const

/** Le tableau des styles de la spécification : taille, interligne, couleur. */
export const type = {
  question: { fontFamily: families.textBold, fontSize: 22, lineHeight: 28, color: colors.encre },
  body: { fontFamily: families.text, fontSize: 15, lineHeight: 22, color: colors.encre },
  reveal: { fontFamily: families.text, fontSize: 17, lineHeight: 24, color: colors.encre },
  option: { fontFamily: families.text, fontSize: 17, lineHeight: 24, color: colors.encre },
  optionChosen: { fontFamily: families.textBold, fontSize: 17, lineHeight: 24, color: colors.encre },
  button: { fontFamily: families.textBold, fontSize: 17, lineHeight: 22 },
  reminder: { fontFamily: families.text, fontSize: 15, lineHeight: 22, color: colors.ocre },
  label: { fontFamily: families.mono, fontSize: 13, lineHeight: 16, letterSpacing: 0.06 * 13, textTransform: 'uppercase', color: colors.graphite },
  readout: { fontFamily: families.mono, fontSize: 15, lineHeight: 20, color: colors.encre },
  readoutLive: { fontFamily: families.monoMedium, fontSize: 15, lineHeight: 20, color: colors.encre },
  monoSmall: { fontFamily: families.mono, fontSize: 13, lineHeight: 16, color: colors.graphite },
  monoTiny: { fontFamily: families.mono, fontSize: 11, lineHeight: 14, color: colors.graphite },
  symbol: { fontFamily: families.mathItalic, fontSize: 28, lineHeight: 34, color: colors.encre },
  symbolSmall: { fontFamily: families.mathItalic, fontSize: 24, lineHeight: 28, color: colors.encre },
  operator: { fontFamily: families.math, fontSize: 28, lineHeight: 34, color: colors.encre },
  operatorSmall: { fontFamily: families.math, fontSize: 24, lineHeight: 28, color: colors.encre },
  captionSymbol: { fontFamily: families.mathItalic, fontSize: 17, lineHeight: 22, color: colors.encre },
  historySymbol: { fontFamily: families.mathItalic, fontSize: 17, lineHeight: 22, color: colors.graphite },
  historyOperator: { fontFamily: families.math, fontSize: 17, lineHeight: 22, color: colors.graphite },
} as const satisfies Record<string, TextStyle>
