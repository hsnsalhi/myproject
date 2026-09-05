import { Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { radius, spacing, stroke, touch } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

interface Props {
  readonly label: string
  readonly onPress: () => void
  readonly disabled?: boolean
}

/** Le seul bouton principal d'un écran : pleine largeur, plein, en bas de la feuille. */
export function PrimaryButton({ label, onPress, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, disabled ? styles.disabled : pressed ? styles.pressed : styles.enabled]}
    >
      <Text style={[type.button, disabled ? styles.textDisabled : styles.text]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    height: touch.button,
    borderRadius: radius.control,
    borderWidth: stroke.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s,
  },
  enabled: { backgroundColor: colors.encre, borderColor: colors.encre },
  pressed: { backgroundColor: colors.encre, borderColor: colors.encre, opacity: 0.85 },
  disabled: { backgroundColor: colors.trame, borderColor: colors.trame },
  text: { color: colors.papier },
  textDisabled: { color: colors.graphite },
})
