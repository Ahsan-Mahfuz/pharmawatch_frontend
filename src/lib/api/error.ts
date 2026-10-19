export class ApiError extends Error {
  readonly status: number;
  readonly field?: string;
  readonly fieldMessage?: string;

  constructor(message: string, status = 0, field?: string, fieldMessage?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.field = field;
    this.fieldMessage = fieldMessage;
  }
}

export const messageOf = (error: unknown): string =>
  error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
