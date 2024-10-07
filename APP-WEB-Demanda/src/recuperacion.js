import { RecuperacionController } from '../controllers/recuperacion.controller'
import { APIModel } from '../models/api.model'
import { RecuperacionView } from '../views/recuperacion.view'

const main = () => {
  const model = new APIModel()
  const controller = new RecuperacionController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new RecuperacionView(controller)
}

main()
