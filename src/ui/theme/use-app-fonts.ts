import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible/400Regular'
import { AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible/700Bold'
import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono/400Regular'
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium'
import { STIXTwoText_400Regular } from '@expo-google-fonts/stix-two-text/400Regular'
import { STIXTwoText_400Regular_Italic } from '@expo-google-fonts/stix-two-text/400Regular_Italic'
import { useFonts } from 'expo-font'

/**
 * Les six fichiers de police, chargés une fois au lancement. Les clés sont les noms de
 * familles de typography.ts. Imports par sous-chemin : l'index d'un paquet embarquerait
 * toutes les graisses dans l'application.
 */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    STIXTwoText_400Regular,
    STIXTwoText_400Regular_Italic,
  })
  // Vrai dès que le chargement est terminé, réussi ou non : un échec ne doit jamais figer l'écran de lancement.
  return loaded || error !== null
}
