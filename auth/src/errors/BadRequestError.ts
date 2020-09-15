import { CustomError } from "./CustomError";
import { ErrorResult } from "./Request-validation-error";

export class BadRequestError extends CustomError {
  statusCode: number = 401;
  constructor(public message: string) {
    super(message);
  }
  serializeErrors = (): ErrorResult[] => {
    return [{ message: this.message }];
  };
}
