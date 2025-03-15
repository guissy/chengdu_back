import { CBD, Part } from '@prisma/client'

export interface CBDWithParts extends CBD {
  parts: Part[]
}

export interface CBDFormatted extends CBD {
  cbdId: string
  total_part: number
} 