import { useState } from 'react'
import { View } from 'react-native'
import type { Confidence } from '@/schema/session'
import type { SimulationModuleId } from '@/schema/simulation'
import { ConfidencePicker } from '@/ui/components/ConfidencePicker'
import { OptionLine } from '@/ui/components/OptionLine'
import { PrimaryButton } from '@/ui/components/PrimaryButton'
import { Prose } from '@/ui/components/Prose'
import { Sheet } from '@/ui/components/Sheet'
import { copy } from '@/ui/copy'
import type { StepProps } from './step-props'

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f']

/** 2. La prédiction : trois lignes d'option et le pari. Obligatoire pour continuer. Lecture seule après le verdict. */
export function PredictionStep<M extends SimulationModuleId>({ lesson, journal, dispatch }: StepProps<M>) {
  const [optionId, setOptionId] = useState<string | null>(journal.prediction?.optionId ?? null)
  const [confidence, setConfidence] = useState<Confidence | null>(journal.prediction?.confidence ?? null)
  const locked = journal.verdict !== null
  const ready = optionId !== null && confidence !== null

  const submit = (): void => {
    if (locked) {
      dispatch({ type: 'next' })
      return
    }
    if (optionId === null || confidence === null) return
    dispatch({ type: 'predict', optionId, confidence })
    dispatch({ type: 'next' })
  }

  return (
    <Sheet
      scroll={false}
      footer={<PrimaryButton label={locked ? copy.buttons.reviewFall : copy.buttons.predict} onPress={submit} disabled={!locked && !ready} />}
    >
      <Prose variant="question">{lesson.prediction.question}</Prose>
      <View>
        {lesson.prediction.options.map((option, i) => (
          <OptionLine
            key={option.id}
            letter={LETTERS[i] ?? String(i + 1)}
            label={option.label}
            state={locked ? (option.id === optionId ? 'chosen' : 'readonly') : option.id === optionId ? 'chosen' : 'idle'}
            onPress={locked ? undefined : () => setOptionId(option.id)}
          />
        ))}
      </View>
      <ConfidencePicker value={confidence} onChange={setConfidence} disabled={locked} />
    </Sheet>
  )
}
