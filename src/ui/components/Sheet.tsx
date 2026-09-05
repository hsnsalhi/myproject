import { useEffect, useRef, type ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { colors } from '@/ui/theme/colors'
import { spacing } from '@/ui/theme/spacing'

interface Props {
  readonly children: ReactNode
  /** Le bouton principal, toujours en bas de la feuille. */
  readonly footer: ReactNode
  /** Une feuille qui défile (observation, explication, correction, bac à sable) ou qui tient sans défilement. */
  readonly scroll: boolean
  /** Quand cette valeur change, la feuille défile jusqu'en bas : pour amener la révélation et le bouton à l'écran. */
  readonly scrollToEndKey?: string | number | null
  readonly ground?: 'papier' | 'trame'
}

/** La feuille : marges 16, rythme vertical 16, fond Papier. */
export function Sheet({ children, footer, scroll, scrollToEndKey = null, ground = 'papier' }: Props) {
  const ref = useRef<ScrollView>(null)
  useEffect(() => {
    if (scrollToEndKey !== null) {
      const timer = setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 50)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [scrollToEndKey])

  const background = ground === 'trame' ? styles.trame : styles.papier
  if (scroll) {
    return (
      <ScrollView ref={ref} style={[styles.fill, background]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {children}
        <View style={styles.footer}>{footer}</View>
      </ScrollView>
    )
  }
  return (
    <View style={[styles.fill, background, styles.content]}>
      {children}
      <View style={styles.spacer} />
      <View style={styles.footer}>{footer}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  papier: { backgroundColor: colors.papier },
  trame: { backgroundColor: colors.trame },
  content: { paddingHorizontal: spacing.margin, paddingTop: spacing.s, paddingBottom: spacing.s, gap: spacing.s },
  spacer: { flex: 1 },
  footer: { gap: spacing.xs, paddingTop: spacing.xs },
})
