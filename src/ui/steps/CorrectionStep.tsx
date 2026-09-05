import { StyleSheet, Text, View } from 'react-native'
import { positionIndex, positionsOf } from '@/engine/lesson-machine'
import type { Confidence } from '@/schema/session'
import type { SimulationModuleId } from '@/schema/simulation'
import { OptionLine, type OptionState } from '@/ui/components/OptionLine'
import { OutcomeLabel } from '@/ui/components/OutcomeLabel'
import { PrimaryButton } from '@/ui/components/PrimaryButton'
import { Prose } from '@/ui/components/Prose'
import { Sheet } from '@/ui/components/Sheet'
import { copy } from '@/ui/copy'
import { spacing } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'
import type { StepProps } from './step-props'

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f']

function outcomeText(confidence: Confidence, correct: boolean): string | null {
  if (!correct) return null
  switch (confidence) {
    case 'sure':
      return copy.outcome.sureRight
    case 'think':
      return copy.outcome.thinkRight
    case 'guess':
      return copy.outcome.guessRight
  }
}

/**
 * 6. La correction. L'option choisie garde le crayon, la bonne prend l'encre. Si le pari
 * était « c'est sûr » et la réponse fausse, « ce qui trompe » précède le raisonnement,
 * qui est toujours montré, même quand la réponse est juste.
 */
export function CorrectionStep<M extends SimulationModuleId>({ lesson, journal, dispatch }: StepProps<M>) {
  const exercise = lesson.exercises.find((e) => e.id === journal.currentExerciseId)
  const answer = journal.answers.find((a) => a.exerciseId === journal.currentExerciseId)
  if (!exercise || !answer) return null
  const chosenOption = exercise.options.find((o) => o.id === answer.optionId)
  const positions = positionsOf(lesson)
  const next = positions[positionIndex(lesson, journal) + 1]
  const label = next?.step === 'exercise' ? copy.buttons.nextExercise : copy.buttons.toSandbox
  const remediate = answer.outcome.followUp === 'remediate' && chosenOption?.misconception !== undefined
  const outcome = outcomeText(answer.confidence, answer.correct)

  return (
    <Sheet scroll footer={<PrimaryButton label={label} onPress={() => dispatch({ type: 'next' })} />}>
      <Prose variant="question">{exercise.question}</Prose>
      <View>
        {exercise.options.map((option, i) => {
          const mine = option.id === answer.optionId
          const right = option.id === exercise.answerId
          const state: OptionState = mine && right ? 'mineAndRight' : right ? 'right' : mine ? 'mine' : 'readonly'
          return (
            <OptionLine
              key={option.id}
              letter={LETTERS[i] ?? String(i + 1)}
              label={option.label}
              state={state}
              tag={right ? (outcome ?? copy.outcome.right) : undefined}
            />
          )
        })}
      </View>
      {remediate && chosenOption?.misconception !== undefined && (
        <View style={styles.block}>
          <OutcomeLabel text={copy.outcome.misconception} tone="ocre" />
          <Prose>{chosenOption.misconception}</Prose>
        </View>
      )}
      <View style={styles.list}>
        {exercise.correction.map((line, i) => (
          <View key={i} style={styles.item}>
            <Text style={[type.monoSmall, styles.number]}>{i + 1}.</Text>
            <Prose style={styles.itemText}>{line}</Prose>
          </View>
        ))}
      </View>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  block: { gap: spacing.xs },
  list: { gap: spacing.xs },
  item: { flexDirection: 'row', gap: spacing.xs },
  number: { width: 24, paddingTop: 3 },
  itemText: { flex: 1 },
})
