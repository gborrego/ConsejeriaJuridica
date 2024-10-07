import { SeguimientoController   } from '../controllers/seguimiento.controller'
import { APIModel } from '../models/api.model'
import { SeguimientoView } from '../views/seguimiento.view'

const main = () => {
  const model = new APIModel()
  const controller = new SeguimientoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new SeguimientoView(controller)
}

main()
