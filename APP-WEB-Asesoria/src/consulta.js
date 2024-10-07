import { ConsultaController } from '../controllers/consulta.controller.js'
import { APIModel } from '../models/api.model.js'
import { ConsultaView } from '../views/consulta.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new ConsultaController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new ConsultaView(controller)
}

main()
