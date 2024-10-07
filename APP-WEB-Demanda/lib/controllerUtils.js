class ControllerUtils {
  constructor(user) {
    this.user = user
  }

  //Methods

  validatePermissions = ({ permissions = [], redirect = 'index.html' }) => {
    if (!this.user) {
      window.location.replace('login.html')
      return false
    }
    if (permissions.length === 0) return true

    const userPermissions = this.user.role
    const valid = permissions.some(permission =>
      userPermissions?.includes(permission)
    )
    if (!valid) {
      window.location.replace(redirect)
      return false
    }

    return true
  }

  handleLogout = () => {
    sessionStorage.removeItem('user')
    window.location.replace('login.html')
  }
}

export { ControllerUtils }
