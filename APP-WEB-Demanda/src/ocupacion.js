import { OcupacionController   } from '../controllers/ocupacion.controller'
import { APIModel } from '../models/api.model'
import { OcupacionView } from '../views/ocupacion.view'

const main = () => {
  const model = new APIModel()
  const controller = new OcupacionController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new OcupacionView(controller)
}

main()
