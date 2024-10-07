import { ConsultaProcesoController } from '../controllers/consulta-proceso.controller'
import { APIModel } from '../models/api.model'
import { ConsultaProcesoView } from '../views/consulta-proceso.view'

const main = () => {
  const model = new APIModel()
  const controller = new ConsultaProcesoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new ConsultaProcesoView(controller)
}

main()
