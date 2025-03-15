import { Part, Position } from '@prisma/client'

export interface PartWithPositions extends Part {
  positions: Position[]
}

export interface PartFormatted extends Part {
  partId: string
  total_position: number
} 