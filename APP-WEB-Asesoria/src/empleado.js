import { EmpleadoController } from '../controllers/empleado.controller.js'
import { APIModel } from '../models/api.model.js'
import { EmpleadoView } from '../views/empleado.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new EmpleadoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new EmpleadoView(controller)
}

main()
