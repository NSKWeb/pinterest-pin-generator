// Error handling utilities

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, field?: string) {
    super(message, 400, `VALIDATION_ERROR${field ? `_${field.toUpperCase()}` : ''}`);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class GenerationError extends ApiError {
  constructor(message: string, provider?: string) {
    super(message, 500, `GENERATION_ERROR${provider ? `_${provider.toUpperCase()}` : ''}`);
  }
}

export class FileUploadError extends ApiError {
  constructor(message: string, code?: string) {
    super(message, 400, code || 'FILE_UPLOAD_ERROR');
  }
}

// Error handler middleware for API routes
export function handleApiError(error: any) {
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  // Operational errors (expected)
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'API_ERROR';
  }
  // Validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    code = 'VALIDATION_ERROR';
  }
  // JSON parsing errors
  else if (error instanceof SyntaxError && error.message.includes('JSON')) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
    code = 'INVALID_JSON';
  }
  // Prisma errors
  else if (error.code?.startsWith('P')) {
    statusCode = 500;
    message = 'Database error';
    code = 'DATABASE_ERROR';
    console.error('Prisma Error:', error);
  }
  // OpenAI/OpenRouter errors
  else if (error.status || error.code) {
    statusCode = error.status || 500;
    message = error.message || 'AI service error';
    code = 'AI_SERVICE_ERROR';
  }
  // Default unexpected errors
  else {
    console.error('Unexpected Error:', error);
    statusCode = 500;
    message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message;
    code = 'UNEXPECTED_ERROR';
  }

  return {
    success: false,
    error: message,
    code,
    statusCode,
  };
}

// Validate request data
export function validateRequired<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new ValidationError(`${String(field)} is required`);
    }
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize string (remove dangerous characters)
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

// Format error response for API
export function formatErrorResponse(error: any) {
  const { success, error: message, code, statusCode } = handleApiError(error);
  
  return {
    success,
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && error.stack && { stack: error.stack }),
  };
}

// Error codes for client-side handling
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  GENERATION_ERROR: 'GENERATION_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
} as const;