import { ControllerUtils } from '../lib/controllerUtils.js'

class IndexController {
  constructor(model) {
    this.model = model
    this.utils = new ControllerUtils(model.user)
   // console.log(model.user)
  }
  /*
ALL_SA
AD_USUARIOS_SA
AD_EMPLEADOS_SA
AD_JUICIOS_SA
AD_GENEROS_SA
AD_ESTADOSCIVILES_SA
AD_MOTIVOS_SA
AD_CATALOGOREQUISITOS_SA
CONSULTA_ASESORIA_SA
REGISTRO_ASESORIA_SA
TURNAR_ASESORIA_SA
  */
  #acceptablePermissions =  ['ALL_SA','AD_USUARIOS_SA','AD_EMPLEADOS_SA','AD_JUICIOS_SA','AD_GENEROS_SA','AD_ESTADOSCIVILES_SA','AD_MOTIVOS_SA','AD_CATALOGOREQUISITOS_SA','CONSULTA_ASESORIA_SA','REGISTRO_ASESORIA_SA','TURNAR_ASESORIA_SA']
  // DOMContentLoaded
  handleDOMContentLoaded = () => {
    // add permissions
    const permiso = this.utils.validatePermissions({})
    if (permiso) {
      const userPermissions = this.model.user.permisos;
      const acceptablePermissions = this.#acceptablePermissions;
      const hasPermission = (userPermissions, acceptablePermissions) => {
        return userPermissions.some(permission => acceptablePermissions.includes(permission));
      };
      if (!hasPermission(userPermissions, acceptablePermissions)) {
        window.location.href = 'login.html';
      }
    }
  }
}

export { IndexController }
