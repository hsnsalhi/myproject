import { Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { radius, spacing, stroke, touch } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

interface Props {
  readonly label: string
  readonly onPress: () => void
}

/** Bouton secondaire : fond Papier, bord Encre. */
export function SecondaryButton({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
    >
      <Text style={[type.button, styles.text]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: touch.min,
    borderRadius: radius.control,
    borderWidth: stroke.medium,
    borderColor: colors.encre,
    backgroundColor: colors.papier,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s,
  },
  pressed: { backgroundColor: colors.trame },
  text: { color: colors.encre },
})
