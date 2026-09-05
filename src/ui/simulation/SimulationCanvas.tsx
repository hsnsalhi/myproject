import {
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  Line,
  Path,
  Picture,
  Skia,
  Text,
  createPicture,
  vec,
  type SkFont,
} from '@shopify/react-native-skia'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDerivedValue, type SharedValue } from 'react-native-reanimated'
import { sampleAt } from '@/physics/trajectory'
import type { BodyTrack, Vec2 } from '@/schema/simulation'
import { colors } from '@/ui/theme/colors'
import { radius, stroke } from '@/ui/theme/spacing'
import type { Rank } from './marks'
import { useCanvasFonts } from './use-canvas-font'
import { buildTransform, toPxX, toPxY, type FrameTransform } from './world-to-frame'

export interface CanvasBody {
  readonly id: string
  readonly label: string
  /** Le corps le plus massif est un disque plein ; les autres sont creux. */
  readonly filled: boolean
}

interface Props {
  readonly height: number
  readonly tracks: ReadonlyArray<BodyTrack>
  readonly bodies: ReadonlyArray<CanvasBody>
  readonly bounds: { readonly min: Vec2; readonly max: Vec2 }
  readonly t: SharedValue<number>
  readonly speed: SharedValue<number>
  /** Repères au crayon, un par corps, dans l'ordre des corps ; null pour ne rien dessiner. */
  readonly predicted?: ReadonlyArray<Rank>
  /** Repères confirmés par la simulation : quand ils diffèrent de la prédiction, le rang prédit est barré. */
  readonly observed?: ReadonlyArray<Rank>
  readonly showClock?: boolean
}

const BALL_RADIUS_PX = 12
const TICK_DURATION_S = 0.18

/**
 * Le cadre : bord Encre 1,5, arrondi 12, grille millimétrée en Picture, échelle en mètres,
 * ligne de sol, corps lus à chaque image depuis les trajectoires échantillonnées, repères
 * au crayon et coches à l'encre, chronomètre. Tout ce qui bouge est dérivé de `t` sur le
 * thread d'interface.
 */
export function SimulationCanvas({ height, tracks, bodies, bounds, t, speed, predicted, observed, showClock = true }: Props) {
  const [width, setWidth] = useState(0)
  const fonts = useCanvasFonts()
  const transform = useMemo(() => (width > 0 ? buildTransform(bounds, tracks, width, height) : null), [bounds, tracks, width, height])
  const grid = useMemo(() => (transform ? makeGridPicture(transform) : null), [transform])

  return (
    <View style={[styles.frame, { height }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {transform && width > 0 && (
        <Canvas style={{ width, height }}>
          {grid && <Picture picture={grid} />}
          <ScaleLabels transform={transform} font={fonts.small} />
          <Line p1={vec(0, transform.groundY)} p2={vec(width, transform.groundY)} color={colors.encre} strokeWidth={stroke.thick} />
          {tracks.map((track, i) => {
            const body = bodies[i]
            const x = toPxX(transform, track.x_m[0] ?? 0, i)
            return (
              <Group key={track.bodyId}>
                <PredictionMark x={x} transform={transform} rank={predicted?.[i] ?? null} font={fonts.small} />
                <StrikeMark x={x} transform={transform} predicted={predicted?.[i] ?? null} observed={observed?.[i] ?? null} track={track} t={t} speed={speed} />
                <LandingMark x={x} side={x < width / 2 ? 'left' : 'right'} transform={transform} track={track} t={t} speed={speed} font={fonts.small} />
                {body && fonts.small && (
                  <Text
                    x={x - fonts.small.measureText(body.label).width / 2}
                    y={toPxY(transform, track.y_m[0] ?? 0) - BALL_RADIUS_PX - 8}
                    text={body.label}
                    font={fonts.small}
                    color={colors.graphite}
                  />
                )}
                <BodyDot track={track} index={i} transform={transform} t={t} filled={body?.filled ?? true} />
              </Group>
            )
          })}
          {showClock && <Clock t={t} transform={transform} font={fonts.readout} />}
        </Canvas>
      )}
    </View>
  )
}

function makeGridPicture(transform: FrameTransform) {
  const cell = transform.gridStep_m * transform.pxPerM
  const fine = Skia.Paint()
  fine.setColor(Skia.Color(colors.trame))
  fine.setStrokeWidth(stroke.thin)
  const strong = Skia.Paint()
  strong.setColor(Skia.Color(colors.graphite))
  strong.setStrokeWidth(stroke.thin)
  return createPicture((canvas) => {
    if (cell < 2) return
    // Lignes horizontales depuis le sol vers le haut ; renforcées tous les dix carreaux.
    for (let i = 0, y = transform.groundY; y >= 0; i++, y -= cell) {
      canvas.drawLine(0, y, transform.width, y, i % 10 === 0 ? strong : fine)
    }
    // Lignes verticales depuis l'origine, dans les deux sens.
    const originX = transform.layoutX ? transform.width / 2 : transform.originX
    for (let i = 0, x = originX; x <= transform.width; i++, x += cell) {
      canvas.drawLine(x, 0, x, transform.height, i % 10 === 0 ? strong : fine)
    }
    for (let i = 1, x = originX - cell; x >= 0; i++, x -= cell) {
      canvas.drawLine(x, 0, x, transform.height, i % 10 === 0 ? strong : fine)
    }
  })
}

function ScaleLabels({ transform, font }: { readonly transform: FrameTransform; readonly font: SkFont | null }) {
  if (!font) return null
  const major = transform.gridStep_m * 10
  const labels: { readonly y: number; readonly text: string }[] = []
  for (let k = 0; ; k++) {
    const y = toPxY(transform, k * major)
    if (y < 12) break
    labels.push({ y, text: formatMeters(k * major) })
    if (labels.length > 12) break
  }
  const shown = labels.length > 6 ? labels.filter((_, i) => i === 0 || i === labels.length - 1) : labels
  return (
    <Group>
      {shown.map((label) => (
        <Text key={label.text} x={6} y={label.y + 4} text={label.text} font={font} color={colors.graphite} />
      ))}
    </Group>
  )
}

function formatMeters(value: number): string {
  const text = value >= 1 || value === 0 ? String(Math.round(value)) : String(value).replace('.', ',')
  return `${text} m`
}

interface BodyDotProps {
  readonly track: BodyTrack
  readonly index: number
  readonly transform: FrameTransform
  readonly t: SharedValue<number>
  readonly filled: boolean
}

function BodyDot({ track, index, transform, t, filled }: BodyDotProps) {
  const cx = useDerivedValue(() => toPxX(transform, sampleAt(track, t.value).x, index), [track, transform, index])
  const cy = useDerivedValue(() => toPxY(transform, sampleAt(track, t.value).y), [track, transform])
  return filled ? (
    <Circle cx={cx} cy={cy} r={BALL_RADIUS_PX} color={colors.encre} />
  ) : (
    <Group>
      <Circle cx={cx} cy={cy} r={BALL_RADIUS_PX} color={colors.papier} />
      <Circle cx={cx} cy={cy} r={BALL_RADIUS_PX} color={colors.encre} style="stroke" strokeWidth={stroke.thick} />
    </Group>
  )
}

function PredictionMark({ x, transform, rank, font }: { readonly x: number; readonly transform: FrameTransform; readonly rank: Rank; readonly font: SkFont | null }) {
  if (rank === null) return null
  const y = transform.groundY + 12
  const chevron = Skia.Path.Make()
  chevron.moveTo(x - 8, y)
  chevron.lineTo(x, y - 8)
  chevron.lineTo(x + 8, y)
  const textWidth = font ? font.measureText(rank).width : 0
  return (
    <Group>
      <Path path={chevron} color={colors.ocre} style="stroke" strokeWidth={stroke.medium}>
        <DashPathEffect intervals={[2, 2]} />
      </Path>
      {font && <Text x={x - textWidth / 2} y={y + 15} text={rank} font={font} color={colors.ocre} />}
    </Group>
  )
}

interface MarkProps {
  readonly x: number
  readonly transform: FrameTransform
  readonly track: BodyTrack
  readonly t: SharedValue<number>
  readonly speed: SharedValue<number>
}

/** Quand le rang prédit est démenti, un trait Encre oblique barre le chiffre au crayon, à l'atterrissage. */
function StrikeMark({ x, transform, predicted, observed, track, t, speed }: MarkProps & { readonly predicted: Rank; readonly observed: Rank }) {
  const landing = track.landingTime_s
  const opacity = useDerivedValue(() => (landing !== null && t.value >= landing ? 1 : 0), [landing])
  if (predicted === null || observed === null || predicted === observed || landing === null) return null
  const y = transform.groundY + 12
  return <Line p1={vec(x - 7, y + 19)} p2={vec(x + 7, y + 6)} color={colors.encre} strokeWidth={stroke.medium} opacity={opacity} />
}

/** La coche à l'encre, tracée en 180 ms d'écran à l'atterrissage, et le temps mesuré. */
function LandingMark({ x, side, transform, track, t, speed, font }: MarkProps & { readonly side: 'left' | 'right'; readonly font: SkFont | null }) {
  const landing = track.landingTime_s
  const progress = useDerivedValue(() => {
    if (landing === null) return 0
    const elapsedScreen = (t.value - landing) / Math.max(speed.value, 1e-6)
    return Math.min(1, Math.max(0, elapsedScreen / TICK_DURATION_S))
  }, [landing])
  const textOpacity = useDerivedValue(() => (progress.value >= 1 ? 1 : 0))
  if (landing === null) return null
  const y = transform.groundY + 8
  const dx = side === 'left' ? -24 : 24
  const tick = Skia.Path.Make()
  tick.moveTo(x + dx - 6, y - 2)
  tick.lineTo(x + dx - 2, y + 2)
  tick.lineTo(x + dx + 6, y - 6)
  const label = `${landing.toFixed(2).replace('.', ',')} s`
  const textWidth = font ? font.measureText(label).width : 0
  const textX = side === 'left' ? x + dx - textWidth + 6 : x + dx - 6
  return (
    <Group>
      <Path path={tick} color={colors.encre} style="stroke" strokeWidth={stroke.thick} start={0} end={progress} />
      {font && <Text x={textX} y={y + 19} text={label} font={font} color={colors.encre} opacity={textOpacity} />}
    </Group>
  )
}

function Clock({ t, transform, font }: { readonly t: SharedValue<number>; readonly transform: FrameTransform; readonly font: SkFont | null }) {
  const text = useDerivedValue(() => `t = ${t.value.toFixed(2).replace('.', ',')} s`)
  if (!font) return null
  const width = font.measureText('t = 00,00 s').width
  return <Text x={transform.width - width - 10} y={20} text={text} font={font} color={colors.encre} />
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderWidth: stroke.medium,
    borderColor: colors.encre,
    borderRadius: radius.frame,
    overflow: 'hidden',
    backgroundColor: colors.papier,
  },
})
