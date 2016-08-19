/**
 * Graphology Custom Errors
 * =========================
 *
 * Defining custom errors for ease of use & easy unit tests across
 * implementations (normalized typology rather than relying on error
 * messages to check whether the correct error was found).
 */
export class GraphError extends Error {
  constructor(message, data) {
    super();
    this.name = 'GraphError';
    this.message = message || '';
    this.data = data || {};

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function')
      Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidArgumentsGraphError extends GraphError {
  constructor(message, data) {
    super(message, data);
    this.name = 'InvalidArgumentsGraphError';
  }
}

export class NotFoundGraphError extends GraphError {
  constructor(message, data) {
    super(message, data);
    this.name = 'NotFoundGraphError';
  }
}

export class UsageGraphError extends GraphError {
  constructor(message, data) {
    super(message, data);
    this.name = 'UsageGraphError';
  }
}
