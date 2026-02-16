// Winston logger configuration

import winston from 'winston';
import { config } from './config';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  }),
);

// Create logger
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'ai-saas-dashboard' },
  transports: [
    // Write all logs to console in development
    new winston.transports.Console({
      format: config.NEXT_PUBLIC_APP_ENV === 'development' ? consoleFormat : logFormat,
    }),
  ],
});

// In production, also log to files
if (config.NEXT_PUBLIC_APP_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Helper functions for common use cases
export const log = {
  info: (message: string, meta?: any) => logger.info(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  error: (message: string, meta?: any) => logger.error(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  
  // Auth-specific logging
  auth: {
    success: (action: string, meta?: any) => logger.info(`Auth: ${action} - SUCCESS`, meta),
    failure: (action: string, reason: string, meta?: any) => 
      logger.warn(`Auth: ${action} - FAILURE: ${reason}`, meta),
    attempt: (layer: string, meta?: any) => 
      logger.info(`Auth: Attempting ${layer}`, meta),
  },
  
  // Generation-specific logging
  generation: {
    start: (type: string, input: any) => 
      logger.info(`Generation: Starting ${type}`, { input }),
    complete: (type: string, result: any) => 
      logger.info(`Generation: ${type} completed`, { result }),
    error: (type: string, error: any) => 
      logger.error(`Generation: ${type} failed`, { error }),
  },
  
  // Campaign-specific logging
  campaign: {
    create: (name: string, id: string) => 
      logger.info(`Campaign: Created '${name}'`, { id }),
    run: (id: string, name: string) => 
      logger.info(`Campaign: Running '${name}'`, { id }),
    complete: (id: string, items: number) => 
      logger.info(`Campaign: Completed with ${items} items`, { id }),
    error: (id: string, error: any) => 
      logger.error(`Campaign: Failed`, { id, error }),
  },
  
  // API logging
  api: {
    request: (method: string, url: string, ip?: string) => 
      logger.info(`API: ${method} ${url}`, { ip }),
    response: (method: string, url: string, status: number, duration: number) => 
      logger.info(`API: ${method} ${url} - ${status} (${duration}ms)`),
    error: (method: string, url: string, error: any) => 
      logger.error(`API: ${method} ${url} - ERROR`, { error }),
  },
};

export default logger;