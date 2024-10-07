import { RecuperacionController } from '../controllers/recuperacion.controller.js'
import { APIModel } from '../models/api.model.js'
import { RecuperacionView } from '../views/recuperacion.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new RecuperacionController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new RecuperacionView(controller)
}

main()
