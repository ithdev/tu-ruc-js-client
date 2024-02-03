class ValidationError extends Error {
  constructor(message,rule) {
    super(message);
    this.name = this.constructor.name;
    this.rule = rule;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

class ServerError extends Error {
  constructor(
    message,
    serverMessage,
    statusCode = 500,
    errorCode,
    debugMessage
  ) {
    super(message);
    this.name = this.constructor.name;
    this.serverMessage = serverMessage;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    this.debugMessage = debugMessage;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      serverMessage: this.serverMessage,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
      debugMessage: this.debugMessage,
      stack: this.stack,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

module.exports = {
  ValidationError,
  ServerError,
};
