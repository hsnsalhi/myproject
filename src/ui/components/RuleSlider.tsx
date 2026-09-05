import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { colors } from '@/ui/theme/colors'
import { spacing, stroke, touch } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'

// `text` est déjà une prop native de TextInput : Reanimated l'écrit directement depuis le thread d'interface.
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export interface SliderScaleSpec {
  readonly kind: 'linear' | 'log'
  /** Pas en linéaire ; chiffres significatifs en logarithmique. */
  readonly step: number
}

interface Props {
  readonly label: string
  readonly unit: string
  readonly min: number
  readonly max: number
  readonly value: number
  readonly scale: SliderScaleSpec
  /** Formatage de la valeur pour la lecture, appelé dans un worklet : rester simple. */
  readonly format: (value: number) => string
  /** Appelé au plus dix fois par seconde pendant le geste, et à la fin du geste. */
  readonly onChange: (value: number) => void
}

/** Position de la poignée (0..1) → valeur, selon l'échelle. Worklet. */
function positionToValue(p: number, min: number, max: number, scale: SliderScaleSpec): number {
  'worklet'
  const clamped = Math.min(1, Math.max(0, p))
  if (scale.kind === 'log') {
    const raw = Math.exp(Math.log(min) + clamped * (Math.log(max) - Math.log(min)))
    const magnitude = Math.floor(Math.log10(raw))
    const factor = Math.pow(10, scale.step - 1 - magnitude)
    return Math.round(raw * factor) / factor
  }
  const raw = min + clamped * (max - min)
  const steps = Math.round((raw - min) / scale.step)
  return Math.min(max, Math.max(min, min + steps * scale.step))
}

function valueToPosition(value: number, min: number, max: number, scale: SliderScaleSpec): number {
  'worklet'
  if (scale.kind === 'log') return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))
  return (value - min) / (max - min)
}

/**
 * La réglette : piste Trame de 2, poignée Vert-de-gris de 28 cerclée d'Encre, bornes en
 * mono sous la piste. La valeur suit le doigt dans une valeur partagée, la lecture est
 * mise à jour sur le thread d'interface, et le parent n'est prévenu qu'au plus dix fois
 * par seconde puis à la fin du geste.
 */
export function RuleSlider({ label, unit, min, max, value, scale, format, onChange }: Props) {
  const width = useSharedValue(0)
  const position = useSharedValue(valueToPosition(value, min, max, scale))
  const startPosition = useSharedValue(0)
  const live = useSharedValue(false)
  const lastSent = useSharedValue(0)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!live.value) position.value = valueToPosition(value, min, max, scale)
  }, [value, min, max, scale, live, position])

  const emit = (v: number): void => onChangeRef.current(v)

  // Intention horizontale déclarée : sans cela, le ScrollView de la feuille avale un glissement oblique sur Android.
  const pan = Gesture.Pan()
    .hitSlop({ vertical: 10, horizontal: 10 })
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onBegin(() => {
      startPosition.value = position.value
      live.value = true
    })
    .onUpdate((e) => {
      if (width.value <= 0) return
      const p = Math.min(1, Math.max(0, startPosition.value + e.translationX / width.value))
      position.value = p
      const now = Date.now()
      if (now - lastSent.value >= 100) {
        lastSent.value = now
        scheduleOnRN(emit, positionToValue(p, min, max, scale))
      }
    })
    .onFinalize(() => {
      live.value = false
      scheduleOnRN(emit, positionToValue(position.value, min, max, scale))
    })

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * Math.max(0, width.value - touch.thumb) }],
  }))

  // `text` est une prop native de TextInput que ses types TypeScript ne déclarent pas : d'où le passage par unknown.
  const readoutProps = useAnimatedProps(
    () => ({ text: format(positionToValue(position.value, min, max, scale)) }) as unknown as Partial<TextInputProps>,
  )
  // Figé au montage : une valeur par défaut recalculée à chaque rendu entrerait en concurrence avec animatedProps.
  const [initialText] = useState(() => format(value))

  const readoutStyle = useAnimatedStyle(() => ({
    fontFamily: live.value ? 'IBMPlexMono_500Medium' : 'IBMPlexMono_400Regular',
  }))

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[type.body, styles.label]}>{label}</Text>
        <View style={styles.readout}>
          <AnimatedTextInput
            editable={false}
            underlineColorAndroid="transparent"
            animatedProps={readoutProps}
            style={[type.readout, styles.readoutInput, readoutStyle]}
            defaultValue={initialText}
          />
          <Text style={[type.monoSmall, styles.unit]}>{unit}</Text>
        </View>
      </View>
      <GestureDetector gesture={pan}>
        <View
          style={styles.track}
          onLayout={(e) => {
            width.value = e.nativeEvent.layout.width
          }}
          accessibilityRole="adjustable"
          accessibilityLabel={label}
        >
          <View style={styles.rail} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
      <View style={styles.ends}>
        <Text style={type.monoTiny}>{format(min)}</Text>
        <Text style={type.monoTiny}>{format(max)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.s },
  label: { flex: 1 },
  readout: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  readoutInput: { padding: 0, margin: 0, minWidth: 56, textAlign: 'right', color: colors.encre },
  unit: { color: colors.graphite },
  track: { height: touch.min, justifyContent: 'center' },
  rail: { height: stroke.thick, backgroundColor: colors.trame },
  thumb: {
    position: 'absolute',
    left: 0,
    width: touch.thumb,
    height: touch.thumb,
    borderRadius: touch.thumb / 2,
    backgroundColor: colors.vertDeGris,
    borderWidth: stroke.thick,
    borderColor: colors.encre,
  },
  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6 },
})
