const CustomeError = require("../utilidades/customeError");

const validarPermisos = (permisosRequeridos) => {
  return (req, res, next) => {
    const permisosUsuario = req.permisos;
    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const tienePermiso = permisosUsuario.some(permiso => permisosRequeridos.includes(permiso));

    if (!tienePermiso) {
      const error = new CustomeError('No tienes permisos para realizar esta acción.', 403); 
       return res.status(403).json({ message: error.message });
    }

    next();
  };
};

module.exports = validarPermisos;
