import { Canvas, Picture, Skia, createPicture } from '@shopify/react-native-skia'
import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { buildNotebookPage } from '@/engine/notebook-page'
import type { SimulationModuleId } from '@/schema/simulation'
import { StaticEquation } from '@/ui/components/EquationLine'
import { OutcomeLabel } from '@/ui/components/OutcomeLabel'
import { Prose } from '@/ui/components/Prose'
import { SecondaryButton } from '@/ui/components/SecondaryButton'
import { Sheet } from '@/ui/components/Sheet'
import { copy, formatDate } from '@/ui/copy'
import { ranksFor } from '@/ui/simulation/marks'
import { SimulationCanvas } from '@/ui/simulation/SimulationCanvas'
import { colors } from '@/ui/theme/colors'
import { radius, spacing, stroke } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'
import type { StepProps } from './step-props'

interface Props<M extends SimulationModuleId> extends StepProps<M> {
  readonly onRestart: () => void
}

/**
 * 8. La page de carnet, posée sur un plan Trame. Elle se remplit toute seule : croquis,
 * équation découverte, prédiction et résultat, ce qui reste à revoir, la phrase à retenir.
 */
export function NotebookStep<M extends SimulationModuleId>({ lesson, journal, module, result, bodies, onRestart }: Props<M>) {
  const page = useMemo(() => buildNotebookPage(lesson, journal, result, module, journal.startedAt, 1), [lesson, journal, result, module])
  const bodyIds = useMemo(() => result.tracks.map((track) => track.bodyId), [result])
  const chosen = lesson.prediction.options.find((o) => o.id === journal.prediction?.optionId)
  const predicted = chosen ? ranksFor(chosen.expected, bodyIds) : undefined
  const measured: unknown = journal.verdict ? journal.verdict.observables[lesson.prediction.observable] : null
  const observed = journal.verdict ? ranksFor(measured, bodyIds) : undefined
  const t = useSharedValue(result.duration_s)
  const speed = useSharedValue(1)

  return (
    <Sheet scroll ground="trame" footer={<SecondaryButton label={copy.buttons.restart} onPress={onRestart} />}>
      <View style={styles.page}>
        <GridHeader left={copy.notebook.page(page.number)} right={formatDate(page.date)} />
        <View style={styles.body}>
          <Prose variant="question">{page.title}</Prose>
          <SimulationCanvas height={170} tracks={result.tracks} bodies={bodies} bounds={result.bounds_m} t={t} speed={speed} predicted={predicted} observed={observed} showClock={false} />
          {page.equation && (
            <View style={styles.equation}>
              <StaticEquation tokens={page.equation.tokens} />
              {page.equationCaption !== null && <Text style={[type.monoSmall, styles.legend]}>{page.equationCaption}</Text>}
            </View>
          )}
          {page.prediction && <Text style={type.reminder}>{copy.notebook.predicted(page.prediction.label, page.prediction.confidence)}</Text>}
          {page.observed !== '' && <Prose>{copy.notebook.observed(page.observed)}</Prose>}
          {page.toReview.length > 0 && (
            <View style={styles.review}>
              <OutcomeLabel text={copy.notebook.toReview} tone="graphite" />
              {page.toReview.map((question) => (
                <Prose key={question} variant="body">
                  {question}
                </Prose>
              ))}
            </View>
          )}
          <Prose>{page.takeaway}</Prose>
          <Text style={[type.monoSmall, styles.number]}>{page.number}</Text>
        </View>
      </View>
    </Sheet>
  )
}

/** La bande d'en-tête quadrillée : la première ligne d'un carnet. */
function GridHeader({ left, right }: { readonly left: string; readonly right: string }) {
  const [width, setWidth] = useState(0)
  const picture = useMemo(() => {
    const paint = Skia.Paint()
    paint.setColor(Skia.Color(colors.trame))
    paint.setStrokeWidth(stroke.thin)
    return createPicture((canvas) => {
      for (let x = 0; x <= width; x += 8) canvas.drawLine(x, 0, x, 32, paint)
      for (let y = 0; y <= 32; y += 8) canvas.drawLine(0, y, width, y, paint)
    })
  }, [width])
  return (
    <View style={styles.header} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <Picture picture={picture} />
        </Canvas>
      )}
      <Text style={type.label}>{left}</Text>
      <Text style={type.label}>{right}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.papier,
    borderWidth: stroke.medium,
    borderColor: colors.encre,
    borderRadius: radius.page,
    overflow: 'hidden',
  },
  header: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: stroke.thin,
    borderBottomColor: colors.trame,
  },
  body: { padding: 20, gap: spacing.s },
  equation: { alignItems: 'center', gap: 4 },
  legend: { textAlign: 'center' },
  review: { gap: 4 },
  number: { textAlign: 'right' },
})
