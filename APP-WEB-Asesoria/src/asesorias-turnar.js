import { AsesoriasTurnarController } from '../controllers/asesorias-turnar.controller.js'
import { APIModel } from '../models/api.model.js'
import { AsesoriasTurnarView } from '../views/asesorias-turnar.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new AsesoriasTurnarController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new AsesoriasTurnarView(controller)
}

main()
