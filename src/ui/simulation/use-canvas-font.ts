import { useFont, type SkFont } from '@shopify/react-native-skia'

/**
 * Le texte dessiné par Skia dans le cadre (échelle, chronomètre, rangs, temps mesurés)
 * exige une police Skia : celles enregistrées par expo-font ne lui sont pas visibles.
 * On charge donc le fichier du paquet directement. Aucun .ttf dans le dépôt.
 */
const monoRegular = require('@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf')
const monoMedium = require('@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf')

export interface CanvasFonts {
  /** Plex Mono 13 : échelle, rangs, temps mesurés. */
  readonly small: SkFont | null
  /** Plex Mono Medium 15 : le chronomètre. */
  readonly readout: SkFont | null
}

export function useCanvasFonts(): CanvasFonts {
  const small = useFont(monoRegular, 13)
  const readout = useFont(monoMedium, 15)
  return { small, readout }
}
