import { EscolaridadController   } from '../controllers/escolaridad.controller'
import { APIModel } from '../models/api.model'
import { EscolaridadView } from '../views/escolaridad.view'

const main = () => {
  const model = new APIModel()
  const controller = new EscolaridadController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new EscolaridadView(controller)
}

main()
