/** Base 8, marges 16, rayons 4 / 8 / 12, épaisseurs 1 / 1,5 / 2, zones tactiles 48. */
export const spacing = {
  xs: 8,
  s: 16,
  m: 24,
  l: 40,
  margin: 16,
} as const

export const radius = {
  page: 4,
  control: 8,
  frame: 12,
  phone: 24,
} as const

export const stroke = {
  thin: 1,
  medium: 1.5,
  thick: 2,
} as const

export const touch = {
  min: 48,
  button: 52,
  option: 56,
  thumb: 28,
} as const
