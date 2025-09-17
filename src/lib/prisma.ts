// Temporarily disable Prisma for build - uncomment when database is ready
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Mock prisma for build time
export const prisma = {
  user: {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
  },
  usageEvent: {
    create: async () => null,
  },
  subscription: {
    upsert: async () => null,
    update: async () => null,
  }
} as any