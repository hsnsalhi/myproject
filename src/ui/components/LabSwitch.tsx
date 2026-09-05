import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { spacing, stroke } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

interface Props {
  readonly label: string
  readonly value: boolean
  readonly onLabel: string
  readonly offLabel: string
  readonly onChange: (value: boolean) => void
}

/** L'interrupteur : zone 64 × 48, dessin 52 × 28, bouton Papier cerclé d'Encre. Piste Vert-de-gris enclenché. */
export function LabSwitch({ label, value, onLabel, offLabel, onChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[type.body, styles.label]}>{label}</Text>
      <Text style={[type.monoSmall, !value && styles.active]}>{offLabel}</Text>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
        onPress={() => onChange(!value)}
        style={styles.zone}
      >
        <View style={[styles.track, value && styles.trackOn]}>
          <View style={[styles.knob, value && styles.knobOn]} />
        </View>
      </Pressable>
      <Text style={[type.monoSmall, value && styles.active]}>{onLabel}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  label: { flex: 1 },
  active: { color: colors.encre },
  zone: { width: 64, height: 48, alignItems: 'center', justifyContent: 'center' },
  track: { width: 52, height: 28, borderRadius: 14, backgroundColor: colors.trame, justifyContent: 'center', paddingHorizontal: 2 },
  trackOn: { backgroundColor: colors.vertDeGris },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.papier, borderWidth: stroke.thick, borderColor: colors.encre },
  knobOn: { alignSelf: 'flex-end' },
})
