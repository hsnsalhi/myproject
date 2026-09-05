import { StyleSheet, Text } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { type } from '@/ui/theme/typography'

interface Props {
  readonly text: string
  readonly tone?: 'encre' | 'ocre' | 'graphite'
}

/** Une étiquette mono en capitales : `JUSTE`, `CE QUI TROMPE`. Jamais une valeur ni une unité. */
export function OutcomeLabel({ text, tone = 'graphite' }: Props) {
  return <Text style={[type.label, styles[tone]]}>{text}</Text>
}

const styles = StyleSheet.create({
  encre: { color: colors.encre },
  ocre: { color: colors.ocre },
  graphite: { color: colors.graphite },
})
