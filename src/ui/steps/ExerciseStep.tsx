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

/** 5. L'exercice : comme la prédiction, avec le pari. « Répondre » mène à la correction. */
export function ExerciseStep<M extends SimulationModuleId>({ lesson, journal, dispatch }: StepProps<M>) {
  const exercise = lesson.exercises.find((e) => e.id === journal.currentExerciseId)
  const previous = journal.answers.find((a) => a.exerciseId === journal.currentExerciseId)
  const [optionId, setOptionId] = useState<string | null>(previous?.optionId ?? null)
  const [confidence, setConfidence] = useState<Confidence | null>(previous?.confidence ?? null)
  if (!exercise) return null
  const answered = previous !== undefined
  const ready = optionId !== null && confidence !== null

  const submit = (): void => {
    if (answered) {
      dispatch({ type: 'next' })
      return
    }
    if (optionId === null || confidence === null) return
    dispatch({ type: 'answer', exerciseId: exercise.id, optionId, confidence })
  }

  return (
    <Sheet scroll={false} footer={<PrimaryButton label={copy.buttons.answer} onPress={submit} disabled={!answered && !ready} />}>
      <Prose variant="question">{exercise.question}</Prose>
      <View>
        {exercise.options.map((option, i) => (
          <OptionLine
            key={option.id}
            letter={LETTERS[i] ?? String(i + 1)}
            label={option.label}
            state={answered ? (option.id === optionId ? 'chosen' : 'readonly') : option.id === optionId ? 'chosen' : 'idle'}
            onPress={answered ? undefined : () => setOptionId(option.id)}
          />
        ))}
      </View>
      <ConfidencePicker value={confidence} onChange={setConfidence} disabled={answered} />
    </Sheet>
  )
}
