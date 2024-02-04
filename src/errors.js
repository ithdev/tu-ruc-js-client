/**
 * Clase de error personalizada que representa un error de validación.
 * @class ValidationError
 * @extends Error
 * @param {string} message - El mensaje de error que describe la falla de validación.
 * @param {string} rule - La regla de validación específica que falló.
 */
class ValidationError extends Error {
  /**
   * Crea una instancia de ValidationError.
   * @param {string} message - El mensaje de error que describe la falla de validación.
   * @param {string} rule - La regla de validación específica que falló.
   * @constructor
   */
  constructor(message, rule) {
    super(message);
    /**
     * El nombre de la clase de error.
     * @member {string}
     */
    this.name = this.constructor.name;
    /**
     * La regla de validación específica que falló.
     * @member {string}
     */
    this.rule = rule;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convierte el objeto de error a una representación JSON.
   * @return {Object} - Representación JSON del error.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      rule: this.rule,
    };
  }

  /**
   * Convierte el objeto de error a una cadena JSON.
   * @return {string} - Representación en cadena JSON del error.
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

/**
 * Clase de error personalizada que representa un error en el lado del servidor.
 * @class ServerError
 * @extends Error
 * @param {string} message - El mensaje de error que describe el error del lado del servidor.
 * @param {string} serverMessage - El mensaje de error específico del servidor.
 * @param {number} [statusCode=500] - El código de estado HTTP asociado con el error.
 * @param {string} [errorCode] - Un código de error opcional para identificar el tipo de error.
 * @param {string} [debugMessage] - Un mensaje de depuración opcional para el modo de desarrollo.
 */
class ServerError extends Error {
  /**
   * Crea una instancia de ServerError.
   * @param {string} message - El mensaje de error que describe el error del lado del servidor.
   * @param {string} serverMessage - El mensaje de error específico del servidor.
   * @param {number} [statusCode=500] - El código de estado HTTP asociado con el error.
   * @param {string} [errorCode] - Un código de error opcional para identificar el tipo de error.
   * @param {string} [debugMessage] - Un mensaje de depuración opcional para el modo de desarrollo.
   * @constructor
   */
  constructor(message, serverMessage, statusCode = 500, errorCode, debugMessage) {
    super(message);
    /**
     * El nombre de la clase de error.
     * @member {string}
     */
    this.name = this.constructor.name;
    /**
     * El mensaje de error específico del servidor.
     * @member {string}
     */
    this.serverMessage = serverMessage;
    /**
     * El código de estado HTTP asociado con el error.
     * @member {number}
     */
    this.statusCode = statusCode;
    /**
     * Un código de error opcional para identificar el tipo de error.
     * @member {string}
     */
    this.errorCode = errorCode;
    /**
     * La marca de tiempo cuando ocurrió el error.
     * @member {string}
     */
    this.timestamp = new Date().toISOString();
    /**
     * Un mensaje de depuración opcional para el modo de desarrollo.
     * @member {string}
     */
    this.debugMessage = debugMessage;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convierte el objeto de error a una representación JSON.
   * @return {Object} - Representación JSON del error.
   */
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

  /**
   * Convierte el objeto de error a una cadena JSON.
   * @return {string} - Representación en cadena JSON del error.
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

module.exports = {
  ValidationError,
  ServerError,
};
