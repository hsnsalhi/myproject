import type { ReactNode } from 'react'
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native'
import { type } from '@/ui/theme/typography'

type Variant = keyof typeof type

interface Props {
  readonly variant?: Variant
  readonly style?: StyleProp<TextStyle>
  readonly children: ReactNode
  readonly numberOfLines?: number
}

/** Un texte typé par son rôle, jamais par une taille écrite à la main. */
export function Prose({ variant = 'body', style, children, numberOfLines }: Props) {
  return (
    <Text style={[type[variant], styles.reset, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  reset: { includeFontPadding: false },
})
