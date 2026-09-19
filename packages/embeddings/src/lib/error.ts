import { Prisma } from "@repo/db";

export class DocumentProcessingError extends Error {
  public readonly code: Prisma.DOCUMENT_ERROR_CODE;

  constructor(
    code: Prisma.DOCUMENT_ERROR_CODE,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
  }
}

export class RetryableError extends DocumentProcessingError {
  constructor(
    code: Prisma.DOCUMENT_ERROR_CODE,
    message: string,
    options?: ErrorOptions,
  ) {
    super(code, message, options);
    this.name = "RetryableError";
  }
}

export class NonRetryableError extends DocumentProcessingError {
  constructor(
    code: Prisma.DOCUMENT_ERROR_CODE,
    message: string,
    options?: ErrorOptions,
  ) {
    super(code, message, options);
    this.name = "NonRetryableError";
  }
}