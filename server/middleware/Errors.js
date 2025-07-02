class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}
class ForbiddenError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

// Used for when a user is already in use
class ConflictError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

module.exports = {
  ValidationError,
  CustomError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
