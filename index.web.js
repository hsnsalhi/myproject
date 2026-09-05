// Point d'entrée web : Skia construit son API au chargement de ses modules à partir de
// global.CanvasKit. Il faut donc que CanvasKit (WebAssembly, servi depuis public/) soit
// chargé avant que l'application, et donc Skia, ne soit évaluée. Le web n'est pas une
// cible du produit : il sert à exécuter et capturer l'app sans appareil.
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web'

LoadSkiaWeb({ locateFile: (file) => `/${file}` })
  .then(() => {
    require('expo-router/entry')
  })
  .catch((error) => {
    console.error('CanvasKit n’a pas pu être chargé :', error)
  })
