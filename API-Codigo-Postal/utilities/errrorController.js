//Modulo para manejar errores en funciones asincronas y estandarizar los errores
module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
        message: error.message
    });
}