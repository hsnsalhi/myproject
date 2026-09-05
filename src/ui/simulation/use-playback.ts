import { useCallback, useEffect, useMemo, useRef } from 'react'
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
 * rien ne repasse par JavaScript pendant le mouvement. La boucle d'images n'est active
 * que pendant la lecture. Émet onFinished une seule fois quand le temps atteint la
 * durée, sauf en boucle.
 *
 * Le callback d'image est stable : la durée et le mode boucle sont lus dans des valeurs
 * partagées, sinon chaque rendu du composant hôte réenregistrerait le callback et
 * perdrait une image de temps simulé.
 */
export function usePlayback(duration_s: number, options: Options = {}): Playback {
  const t = useSharedValue(0)
  const speed = useSharedValue(1)
  const playing = useSharedValue(false)
  const duration = useSharedValue(duration_s)
  const loop = useSharedValue(options.loop ?? false)
  const onFinishedRef = useRef(options.onFinished)
  onFinishedRef.current = options.onFinished

  const finish = useCallback((): void => {
    onFinishedRef.current?.()
  }, [])

  const frame = useFrameCallback(
    useCallback(
      (info: { readonly timeSincePreviousFrame: number | null }) => {
        'worklet'
        if (!playing.value) return
        const dt = (info.timeSincePreviousFrame ?? 0) / 1000
        const next = t.value + dt * speed.value
        if (next >= duration.value) {
          if (loop.value) {
            t.value = 0
            return
          }
          t.value = duration.value
          playing.value = false
          scheduleOnRN(finish)
          return
        }
        t.value = next
      },
      [duration, finish, loop, playing, speed, t],
    ),
    false,
  )
  const setActive = frame.setActive

  useEffect(() => {
    // Une nouvelle durée (paramètres changés) repart du début.
    duration.value = duration_s
    t.value = 0
  }, [duration_s, duration, t])

  useEffect(() => {
    loop.value = options.loop ?? false
  }, [options.loop, loop])

  const play = useCallback((): void => {
    if (t.value >= duration.value) t.value = 0
    playing.value = true
    setActive(true)
  }, [duration, playing, setActive, t])
  const pause = useCallback((): void => {
    playing.value = false
    setActive(false)
  }, [playing, setActive])
  const replay = useCallback((): void => {
    t.value = 0
    playing.value = true
    setActive(true)
  }, [playing, setActive, t])
  const reset = useCallback((): void => {
    playing.value = false
    setActive(false)
    t.value = 0
  }, [playing, setActive, t])
  const setSpeed = useCallback(
    (value: number): void => {
      speed.value = value
    },
    [speed],
  )

  // Quand la lecture se termine d'elle-même, la boucle d'images est arrêtée depuis JavaScript.
  const finishedRef = onFinishedRef
  useEffect(() => {
    const previous = finishedRef.current
    finishedRef.current = () => {
      setActive(false)
      previous?.()
    }
    return () => {
      finishedRef.current = previous
    }
  })

  return useMemo(() => ({ t, speed, playing, play, pause, replay, reset, setSpeed }), [t, speed, playing, play, pause, replay, reset, setSpeed])
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
