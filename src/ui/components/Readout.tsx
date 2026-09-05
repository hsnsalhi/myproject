import { StyleSheet, Text, View } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { type } from '@/ui/theme/typography'

interface Props {
  readonly value: string
  readonly unit?: string
  readonly live?: boolean
}

/** Une lecture : valeur mono, unité en Graphite. Medium pendant un réglage. */
export function Readout({ value, unit, live = false }: Props) {
  return (
    <View style={styles.row}>
      <Text style={live ? type.readoutLive : type.readout}>{value}</Text>
      {unit !== undefined && <Text style={[type.monoSmall, styles.unit]}>{unit}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  unit: { color: colors.graphite },
})
