import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { Confidence } from '@/schema/session'
import { copy } from '@/ui/copy'
import { colors } from '@/ui/theme/colors'
import { radius, spacing, stroke, touch } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

const LEVELS: ReadonlyArray<Confidence> = ['guess', 'think', 'sure']

interface Props {
  readonly value: Confidence | null
  readonly onChange: (value: Confidence) => void
  readonly disabled?: boolean
}

/** Le pari : au hasard · je pense · c'est sûr. La cellule choisie est remplie d'Encre. */
export function ConfidencePicker({ value, onChange, disabled = false }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={type.label}>{copy.confidence.label}</Text>
      <View style={styles.segments} accessibilityRole="radiogroup">
        {LEVELS.map((level, index) => {
          const on = value === level
          return (
            <Pressable
              key={level}
              accessibilityRole="radio"
              accessibilityState={{ checked: on, disabled }}
              disabled={disabled}
              onPress={() => onChange(level)}
              style={({ pressed }) => [styles.cell, index < LEVELS.length - 1 && styles.cellDivider, on && styles.cellOn, pressed && !on && styles.cellPressed]}
            >
              <Text style={[type.body, on && styles.textOn, disabled && !on && styles.textOff]}>{copy.confidence[level]}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  segments: {
    flexDirection: 'row',
    borderWidth: stroke.medium,
    borderColor: colors.encre,
    borderRadius: radius.control,
    overflow: 'hidden',
  },
  cell: { flex: 1, height: touch.min, alignItems: 'center', justifyContent: 'center' },
  cellDivider: { borderRightWidth: stroke.medium, borderRightColor: colors.encre },
  cellOn: { backgroundColor: colors.encre },
  cellPressed: { backgroundColor: colors.trame },
  textOn: { color: colors.papier, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  textOff: { color: colors.graphite },
})
