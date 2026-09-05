/** Sur iOS et Android, Skia est natif : rien à charger. Le pendant web est dans skia-web.web.ts. */
export function useSkiaReady(): boolean {
  return true
}
