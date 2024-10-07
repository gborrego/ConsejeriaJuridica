/**
 * @file customeError.js    
 * @brief Este archivo se encarga de crear un error personalizado para la aplicación
 */
class CustomeError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomeError;