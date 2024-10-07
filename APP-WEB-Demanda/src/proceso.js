import { ProcesoController   } from '../controllers/proceso.controller'
import { APIModel } from '../models/api.model'
import { ProcesoView } from '../views/proceso.view'

const main = () => {
  const model = new APIModel()
  const controller = new ProcesoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new ProcesoView(controller)
}

main()
