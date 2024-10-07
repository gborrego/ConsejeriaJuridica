import { ControllerUtils } from '../lib/controllerUtils'



class EtniaController {
  constructor(model) {
    this.model = model
    this.utils = new ControllerUtils(model.user)
  }
 #acceptablePermissions = ['ALL_SD', 'AD_ETNIA_SD']
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
        window.location.href = 'index.html';
      }
    }
  }
}

export { EtniaController }



