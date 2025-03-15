import { Shop, Space } from '@prisma/client'

export interface ShopWithSpaces extends Shop {
  spaces: Space[]
}

export interface ErrorWithName extends Error {
  name: string
  errors?: unknown
} 