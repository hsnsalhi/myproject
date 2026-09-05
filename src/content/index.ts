import type { AnyLesson } from '@/schema/lesson'
import { freeFallTwoBalls } from './lessons/free-fall-two-balls'

/** Le registre des leçons. Ajouter une leçon = un fichier dans lessons/ et une ligne ici. */
export const lessons: ReadonlyArray<AnyLesson> = [freeFallTwoBalls]
