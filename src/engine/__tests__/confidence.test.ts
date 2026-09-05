import { describe, expect, it } from '@jest/globals'
import { outcomeFor } from '@/engine/confidence'

describe('table du pari de confiance', () => {
  it('couvre les six couples', () => {
    expect(outcomeFor('sure', true)).toEqual({ reward: 'strong', followUp: 'none' })
    expect(outcomeFor('think', true)).toEqual({ reward: 'normal', followUp: 'none' })
    expect(outcomeFor('guess', true)).toEqual({ reward: 'weak', followUp: 'review' })
    expect(outcomeFor('sure', false)).toEqual({ reward: 'none', followUp: 'remediate' })
    expect(outcomeFor('think', false)).toEqual({ reward: 'none', followUp: 'review' })
    expect(outcomeFor('guess', false)).toEqual({ reward: 'none', followUp: 'review' })
  })
})
