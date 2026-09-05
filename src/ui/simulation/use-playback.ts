import { useCallback, useEffect, useRef } from 'react'
import { useFrameCallback, useSharedValue, type SharedValue } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

export interface Playback {
  /** Temps simulé, en secondes. */
  readonly t: SharedValue<number>
  /** Secondes simulées par seconde d'écran : 1 en temps réel, 0,25 au ralenti ×4. */
  readonly speed: SharedValue<number>
  readonly playing: SharedValue<boolean>
  play(): void
  pause(): void
  replay(): void
  reset(): void
  setSpeed(speed: number): void
}

interface Options {
  readonly loop?: boolean
  readonly onFinished?: () => void
}

/**
 * L'horloge de la simulation. Avancée dans useFrameCallback sur le thread d'interface :
 * rien ne repasse par JavaScript pendant le mouvement. Émet onFinished une seule fois
 * quand le temps atteint la durée, sauf en boucle.
 */
export function usePlayback(duration_s: number, options: Options = {}): Playback {
  const t = useSharedValue(0)
  const speed = useSharedValue(1)
  const playing = useSharedValue(false)
  const loop = options.loop ?? false
  const onFinishedRef = useRef(options.onFinished)
  onFinishedRef.current = options.onFinished

  const finish = useCallback((): void => {
    onFinishedRef.current?.()
  }, [])

  useFrameCallback((frame) => {
    'worklet'
    if (!playing.value) return
    const dt = (frame.timeSincePreviousFrame ?? 0) / 1000
    const next = t.value + dt * speed.value
    if (next >= duration_s) {
      if (loop) {
        t.value = 0
        return
      }
      t.value = duration_s
      playing.value = false
      scheduleOnRN(finish)
      return
    }
    t.value = next
  })

  useEffect(() => {
    // Une nouvelle durée (paramètres changés) repart du début.
    t.value = 0
  }, [duration_s, t])

  const play = useCallback((): void => {
    if (t.value >= duration_s) t.value = 0
    playing.value = true
  }, [duration_s, playing, t])
  const pause = useCallback((): void => {
    playing.value = false
  }, [playing])
  const replay = useCallback((): void => {
    t.value = 0
    playing.value = true
  }, [playing, t])
  const reset = useCallback((): void => {
    playing.value = false
    t.value = 0
  }, [playing, t])
  const setSpeed = useCallback(
    (value: number): void => {
      speed.value = value
    },
    [speed],
  )

  return { t, speed, playing, play, pause, replay, reset, setSpeed }
}

/** Le facteur de ralenti proposé : celui de ×2, ×4, ×10 qui rapproche le plus la durée à l'écran de 2,5 s. */
export function slowMotionFactor(duration_s: number): number {
  const target = 2.5
  const candidates = [2, 4, 10]
  let best = 2
  let bestGap = Number.POSITIVE_INFINITY
  for (const factor of candidates) {
    const gap = Math.abs(duration_s * factor - target)
    if (gap < bestGap) {
      bestGap = gap
      best = factor
    }
  }
  return best
}
