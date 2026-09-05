import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { SimulationModuleId } from '@/schema/simulation'
import { PrimaryButton } from '@/ui/components/PrimaryButton'
import { Prose } from '@/ui/components/Prose'
import { SecondaryButton } from '@/ui/components/SecondaryButton'
import { Sheet } from '@/ui/components/Sheet'
import { copy } from '@/ui/copy'
import { ranksFor } from '@/ui/simulation/marks'
import { SimulationCanvas } from '@/ui/simulation/SimulationCanvas'
import { slowMotionFactor, usePlayback } from '@/ui/simulation/use-playback'
import { colors } from '@/ui/theme/colors'
import { spacing, stroke } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'
import type { StepProps } from './step-props'

/**
 * 3. L'observation. Le cadre s'ouvre à t = 0, billes suspendues, chevrons posés. « Lâcher
 * les billes » lance en temps réel ; à l'atterrissage, le moteur reçoit les observables,
 * la révélation s'affiche, et « Rejouer » / « Ralenti » remplacent le bouton de lancement.
 */
export function ObservationStep<M extends SimulationModuleId>({ lesson, journal, module, result, bodies, dispatch, frameHeight }: StepProps<M>) {
  const params = lesson.simulation.params
  const bodyIds = useMemo(() => result.tracks.map((track) => track.bodyId), [result])
  const chosen = lesson.prediction.options.find((o) => o.id === journal.prediction?.optionId)
  const predicted = useMemo(() => (chosen ? ranksFor(chosen.expected, bodyIds) : bodyIds.map(() => null)), [chosen, bodyIds])
  const observed = useMemo(() => {
    if (!journal.verdict) return undefined
    const measured: unknown = journal.verdict.observables[lesson.prediction.observable]
    return ranksFor(measured, bodyIds)
  }, [journal.verdict, lesson.prediction.observable, bodyIds])
  // Le ralenti se règle sur le mouvement lui-même, pas sur le temps de repos qui suit le dernier atterrissage.
  const motionDuration = result.tracks.reduce((max, track) => Math.max(max, track.landingTime_s ?? 0), 0) || result.duration_s
  const factor = slowMotionFactor(motionDuration)
  const [slow, setSlow] = useState(false)
  const [launched, setLaunched] = useState(journal.verdict !== null)

  const playback = usePlayback(result.duration_s, {
    onFinished: () => {
      if (journal.verdict === null) dispatch({ type: 'observed', observables: module.observe(result, params) })
    },
  })

  useEffect(() => {
    if (journal.verdict !== null) playback.t.value = result.duration_s
    // Uniquement au montage : on montre l'état final si la chute a déjà eu lieu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const launch = (): void => {
    setLaunched(true)
    playback.setSpeed(1)
    setSlow(false)
    playback.play()
  }
  const replay = (): void => {
    dispatch({ type: 'replayed' })
    playback.replay()
  }
  const toggleSlow = (): void => {
    const next = !slow
    setSlow(next)
    playback.setSpeed(next ? 1 / factor : 1)
    dispatch({ type: 'replayed' })
    playback.replay()
  }

  const done = journal.verdict !== null
  const reveal = done && chosen ? chosen.reveal : null

  return (
    <Sheet
      scroll
      scrollToEndKey={done ? 'verdict' : null}
      footer={
        done ? (
          <>
            <View style={styles.row}>
              <SecondaryButton label={copy.buttons.replay} onPress={replay} />
              <SecondaryButton label={slow ? copy.buttons.realTime : copy.buttons.slowMotion(factor)} onPress={toggleSlow} />
            </View>
            <PrimaryButton label={copy.buttons.seeWhy} onPress={() => dispatch({ type: 'next' })} />
          </>
        ) : (
          <PrimaryButton label={lesson.observation.launchLabel} onPress={launch} disabled={launched} />
        )
      }
    >
      {journal.prediction && chosen && (
        <Text style={[type.reminder, styles.reminder]}>{copy.reminder(chosen.label, journal.prediction.confidence)}</Text>
      )}
      <SimulationCanvas
        height={frameHeight(0.55)}
        tracks={result.tracks}
        bodies={bodies}
        bounds={result.bounds_m}
        t={playback.t}
        speed={playback.speed}
        predicted={predicted}
        observed={observed}
      />
      {reveal !== null && <Prose variant="reveal">{reveal}</Prose>}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  reminder: { alignSelf: 'flex-start', borderBottomWidth: stroke.medium, borderBottomColor: colors.ocre, borderStyle: 'dashed', paddingBottom: 2 },
  row: { flexDirection: 'row', gap: spacing.xs },
})
