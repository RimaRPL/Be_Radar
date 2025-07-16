import { Prisma, PrismaClient } from '@prisma/client'
import logger from './logger.config' // Import the logger

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' }, // Capture query events
    { level: 'info', emit: 'event' }, // Capture info events
    { level: 'warn', emit: 'event' }, // Capture warnings
    { level: 'error', emit: 'event' }, // Capture errors
  ],
})

type PrismaQueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

type PrismaLogEvent = {
  timestamp: Date;
  message: string;
  target: string;
};


// Log every query executed
prisma.$on('query', async (event: PrismaQueryEvent) => {
  logger.info('PrismaQuery', event.query, `Duration: ${event.duration}ms`)
})

// Log other events
prisma.$on('info', (event: PrismaLogEvent) => {
  logger.info('PrismaInfo', event.message)
})

prisma.$on('warn', (event: PrismaLogEvent) => {
  logger.warn('PrismaWarning', event.message)
})

prisma.$on('error', (event: PrismaLogEvent) => {
  logger.error('PrismaError', event.message)
})

export default prisma
