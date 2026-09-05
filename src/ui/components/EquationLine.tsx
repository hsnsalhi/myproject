import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import type { EquationNode, EquationView } from '@/engine/equation'
import { leaves, toNodes } from '@/engine/equation'
import type { EquationToken } from '@/schema/explanation'
import { colors } from '@/ui/theme/colors'
import { spacing, stroke } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

interface Props {
  readonly view: EquationView
}

/**
 * La bande d'équation : 64 de haut, deux filets Trame, symboles STIX en italique, fraction
 * à barre Encre, symbole barré d'un trait Encre oblique. Sous la bande, une seule cotation :
 * le dernier symbole apparu. Les lignes terminées restent au-dessus, en petit.
 */
export function EquationLine({ view }: Props) {
  return (
    <View style={styles.wrap}>
      {view.history.map((line, i) => (
        <View key={i} style={styles.historyLine}>
          <Nodes nodes={line} visible={Number.POSITIVE_INFINITY} size="history" offset={0} />
        </View>
      ))}
      <View style={styles.band}>
        <Nodes nodes={view.current} visible={view.visibleLeaves} size="large" offset={0} />
      </View>
      {view.caption && (
        <View style={styles.caption}>
          <Text style={type.captionSymbol}>{view.caption.symbol}</Text>
          <Text style={[type.body, styles.meaning]}>{view.caption.meaning}</Text>
        </View>
      )}
      {view.text !== null && (
        <Animated.Text entering={FadeIn.duration(120)} style={type.body}>
          {view.text}
        </Animated.Text>
      )}
    </View>
  )
}

/** Une équation entière, sans bande ni cotation : pour la page de carnet. */
export function StaticEquation({ tokens }: { readonly tokens: ReadonlyArray<EquationToken> }) {
  return (
    <View style={styles.staticLine}>
      <Nodes nodes={toNodes(tokens)} visible={Number.POSITIVE_INFINITY} size="large" offset={0} />
    </View>
  )
}

type Size = 'large' | 'small' | 'history'

function symbolStyle(size: Size) {
  return size === 'large' ? type.symbol : size === 'small' ? type.symbolSmall : type.historySymbol
}
function operatorStyle(size: Size) {
  return size === 'large' ? type.operator : size === 'small' ? type.operatorSmall : type.historyOperator
}

interface NodesProps {
  readonly nodes: ReadonlyArray<EquationNode>
  readonly visible: number
  readonly size: Size
  /** Nombre de feuilles qui précèdent ce groupe dans la ligne, pour savoir lesquelles sont visibles. */
  readonly offset: number
}

function Nodes({ nodes, visible, size, offset }: NodesProps) {
  let index = offset
  return (
    <View style={styles.row}>
      {nodes.map((node, i) => {
        const start = index
        const count = node.kind === 'fraction' ? leaves([node]).length : 1
        index += count
        if (node.kind === 'fraction') {
          const inner = size === 'history' ? 'history' : 'small'
          const numeratorCount = leaves(node.numerator).length
          const anyVisible = start < visible
          if (!anyVisible) return null
          return (
            <Animated.View key={i} entering={FadeIn.duration(120)} style={styles.fraction}>
              <Nodes nodes={node.numerator} visible={visible} size={inner} offset={start} />
              <View style={[styles.bar, size === 'history' && styles.barSmall]} />
              <Nodes nodes={node.denominator} visible={visible} size={inner} offset={start + numeratorCount} />
            </Animated.View>
          )
        }
        if (start >= visible) return null
        const cancelled = node.kind === 'symbol' && node.cancelled
        return (
          <Animated.View key={i} entering={FadeIn.duration(120)} style={styles.leaf}>
            <Text style={node.kind === 'symbol' ? symbolStyle(size) : operatorStyle(size)}>
              {node.kind === 'number' && node.unit !== undefined ? `${node.text} ${node.unit}` : node.text}
            </Text>
            {cancelled && <View pointerEvents="none" style={styles.cancel} />}
          </Animated.View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  staticLine: { alignItems: 'center' },
  historyLine: { alignItems: 'center' },
  band: {
    minHeight: 64,
    borderTopWidth: stroke.thin,
    borderBottomWidth: stroke.thin,
    borderColor: colors.trame,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fraction: { alignItems: 'center', gap: 3 },
  bar: { alignSelf: 'stretch', height: stroke.medium, backgroundColor: colors.encre },
  barSmall: { backgroundColor: colors.graphite, height: stroke.thin },
  leaf: { justifyContent: 'center' },
  cancel: {
    position: 'absolute',
    left: -3,
    right: -3,
    top: '50%',
    height: stroke.thick,
    backgroundColor: colors.encre,
    transform: [{ rotate: '-28deg' }],
  },
  caption: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  meaning: { color: colors.graphite, flex: 1 },
})
