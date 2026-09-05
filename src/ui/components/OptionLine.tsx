import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { radius, spacing, stroke, touch } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

/**
 * idle : au repos. chosen : choisie, en cours de réponse. readonly : après le verdict.
 * mine : à la correction, celle que l'utilisateur avait choisie (crayon). right : la bonne
 * (encre). mineAndRight : les deux marques superposées.
 */
export type OptionState = 'idle' | 'chosen' | 'readonly' | 'mine' | 'right' | 'mineAndRight'

interface Props {
  readonly letter: string
  readonly label: string
  readonly state: OptionState
  readonly tag?: string
  readonly onPress?: () => void
}

/** Une ligne de carnet : une lettre à gauche, un filet en dessous, pas de boîte. */
export function OptionLine({ letter, label, state, tag, onPress }: Props) {
  const interactive = onPress !== undefined && (state === 'idle' || state === 'chosen')
  const chosen = state === 'chosen'
  const mine = state === 'mine' || state === 'mineAndRight'
  const right = state === 'right' || state === 'mineAndRight'
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: chosen, disabled: !interactive }}
      disabled={!interactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.line,
        chosen && styles.lineChosen,
        pressed && interactive && styles.linePressed,
        right && styles.lineRight,
        mine && !right && styles.lineMine,
      ]}
    >
      {mine && right && <View pointerEvents="none" style={styles.mineInside} />}
      <View style={[styles.letterBox, chosen && styles.letterBoxChosen]}>
        <Text style={[type.monoSmall, chosen && styles.letterChosen]}>{letter}.</Text>
      </View>
      <Text style={[chosen ? type.optionChosen : type.option, state === 'readonly' && styles.readonly, styles.label]}>{label}</Text>
      {tag !== undefined && <Text style={[type.label, styles.tag]}>{tag}</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  line: {
    minHeight: touch.option,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 2,
    borderBottomWidth: stroke.thin,
    borderBottomColor: colors.trame,
  },
  lineChosen: { borderBottomWidth: stroke.thick, borderBottomColor: colors.encre },
  linePressed: { backgroundColor: colors.trame },
  lineRight: { borderWidth: stroke.thick, borderColor: colors.encre, borderRadius: 6, paddingHorizontal: spacing.xs },
  lineMine: { borderWidth: stroke.thick, borderColor: colors.ocre, borderStyle: 'dashed', borderRadius: 6, paddingHorizontal: spacing.xs },
  mineInside: {
    position: 'absolute',
    left: 3,
    right: 3,
    top: 3,
    bottom: 3,
    borderWidth: stroke.thick,
    borderColor: colors.ocre,
    borderStyle: 'dashed',
    borderRadius: radius.page,
  },
  letterBox: { width: 28, height: 28, borderRadius: radius.page, alignItems: 'center', justifyContent: 'center' },
  letterBoxChosen: { backgroundColor: colors.encre },
  letterChosen: { color: colors.papier },
  label: { flex: 1 },
  readonly: { color: colors.graphite },
  tag: { color: colors.encre, paddingRight: spacing.xs },
})
