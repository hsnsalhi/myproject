import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { StepId } from '@/schema/session'
import { copy } from '@/ui/copy'
import { colors } from '@/ui/theme/colors'
import { stroke, touch } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

const STEPS: ReadonlyArray<StepId> = ['hook', 'prediction', 'observation', 'explanation', 'exercise', 'correction', 'sandbox', 'notebook']

interface Props {
  readonly current: StepId
  readonly onGoto: (step: StepId) => void
}

/**
 * La règle : huit graduations, une par étape. Passée = trait Encre 14 ; courante = trait
 * Encre 24 surmonté d'un point Vert-de-gris ; à venir = trait Graphite 8. Toucher une
 * graduation passée y ramène ; un appui long montre le nom de l'étape.
 */
export function StepRuler({ current, onGoto }: Props) {
  const currentIndex = STEPS.indexOf(current)
  const [hint, setHint] = useState<StepId | null>(null)

  useEffect(() => {
    if (hint === null) return
    const timer = setTimeout(() => setHint(null), 1500)
    return () => clearTimeout(timer)
  }, [hint])

  return (
    <View style={styles.band} accessibilityRole="tablist">
      {hint !== null && (
        <Text style={[type.label, styles.hint]} pointerEvents="none">
          {copy.steps[hint]}
        </Text>
      )}
      <View style={styles.ticks}>
        {STEPS.map((step, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'now' : 'todo'
          return (
            <Pressable
              key={step}
              accessibilityRole="tab"
              accessibilityLabel={copy.steps[step]}
              accessibilityState={{ selected: state === 'now', disabled: state === 'todo' }}
              hitSlop={{ left: 12, right: 12, top: 12, bottom: 12 }}
              disabled={state === 'todo'}
              onPress={() => {
                if (state === 'done') onGoto(step)
              }}
              onLongPress={() => setHint(step)}
              style={styles.tickZone}
            >
              {state === 'now' && <View style={styles.dot} />}
              <View style={[styles.tick, state === 'done' && styles.tickDone, state === 'now' && styles.tickNow]} />
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  band: { height: touch.min, justifyContent: 'flex-end' },
  ticks: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: stroke.medium,
    borderBottomColor: colors.encre,
    paddingHorizontal: 2,
  },
  tickZone: { height: 34, justifyContent: 'flex-end', alignItems: 'center', width: 12 },
  tick: { width: stroke.medium, height: 8, backgroundColor: colors.graphite },
  tickDone: { height: 14, backgroundColor: colors.encre },
  tickNow: { height: 24, backgroundColor: colors.encre },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.vertDeGris, marginBottom: 2 },
  hint: { position: 'absolute', top: 0, left: 0 },
})
