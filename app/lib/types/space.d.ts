import { Space } from '@prisma/client'

export interface SpaceWithState extends Space {
  state: 'ENABLED' | 'DISABLED'
} 