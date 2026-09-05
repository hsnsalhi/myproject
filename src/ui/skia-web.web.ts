import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web'
import { useEffect, useState } from 'react'

let loading: Promise<void> | null = null

/**
 * Sur le web, Skia tourne dans CanvasKit (WebAssembly), servi depuis public/canvaskit.wasm.
 * Le web n'est pas une cible du produit : il sert à exécuter et capturer l'app sans appareil.
 */
export function useSkiaReady(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    loading ??= LoadSkiaWeb({ locateFile: (file: string) => `/${file}` })
    let cancelled = false
    void loading.then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])
  return ready
}
