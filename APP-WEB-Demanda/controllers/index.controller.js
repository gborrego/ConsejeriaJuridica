import { ControllerUtils } from '../lib/controllerUtils'

class IndexController {
  constructor(model) {
    this.model = model
    this.utils = new ControllerUtils(model.user)
   // console.log(this.model.user)
  }

  #acceptablePermissions = ['ALL_SD', 'AD_ESCOLARIDAD_SD', 'AD_ETNIA_SD', 'AD_JUZGADO_SD', 'AD_OCUPACION_SD', 'CONSULTA_PROCESO_JUDICIAL_SD', 'SEGUIMIENTO_PROCESO_JUDICIAL_SD', 'REGISTRO_PROCESO_JUDICIAL_SD']
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
