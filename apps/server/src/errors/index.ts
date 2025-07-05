import { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

const InklateAPIErrorPrefix = "InklateAPI";

type HTTPExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
};

export class AsyncStatusApiError extends HTTPException {
  name = `${InklateAPIErrorPrefix}Error`;
  constructor(status: ContentfulStatusCode, options: HTTPExceptionOptions) {
    super(status, options);
  }
}

export class AsyncStatusBadRequestError extends AsyncStatusApiError {
  name = `${InklateAPIErrorPrefix}BadRequestError`;
  constructor(options: HTTPExceptionOptions) {
    super(400, options);
  }
}

export class AsyncStatusUnauthorizedError extends AsyncStatusApiError {
  name = `${InklateAPIErrorPrefix}UnauthorizedError`;
  constructor(options: HTTPExceptionOptions) {
    super(401, options);
  }
}

export class AsyncStatusForbiddenError extends AsyncStatusApiError {
  name = `${InklateAPIErrorPrefix}ForbiddenError`;
  constructor(options: HTTPExceptionOptions) {
    super(403, options);
  }
}

export class AsyncStatusNotFoundError extends AsyncStatusApiError {
  name = `${InklateAPIErrorPrefix}NotFoundError`;
  constructor(options: HTTPExceptionOptions) {
    super(404, options);
  }
}

export class AsyncStatusUnexpectedApiError extends HTTPException {
  name = `${InklateAPIErrorPrefix}UnexpectedError`;
  constructor(options?: HTTPExceptionOptions) {
    super(500, {
      message: "An unexpected error occurred. Please try again later.",
      ...options
    });
  }
}
