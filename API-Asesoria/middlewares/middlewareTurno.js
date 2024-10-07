const controlTurno = require('../controles/controlTurno');
const controlDefensor = require('../controles/controlDefensor');
const controlAsesoria = require('../controles/controlAsesoria');


const logger = require('../utilidades/logger');

async function existeTurno(req, res, next) {

    logger.info('Middleware existeTurno');
    try {
        const { id } = req.params;
        const turno = await controlTurno.onbtenerTurnoIDSimple(id);
        if (!turno) {
            res.status(404).send({ message: 'Turno no encontrado' });
        }
    } catch (error) {
        logger.error('Error en Middleware existeTurno');
        res.status(500).send({ message: error.message });
    }


    logger.info('Fin Middleware existeTurno');
    next();
}


async function validarPeticionPUT(req, res, next) {
    logger.info('Middleware validarPeticionPUT');

    const { id_turno, fecha_turno, hora_turno, id_asesoria, id_defensor, estatus_general } = req.body;

    if (!id_turno || !fecha_turno || !hora_turno || !id_asesoria || !id_defensor || !estatus_general) {
        return res.status(400).send({ message: 'Faltan datos' });
    }

    try {
        const turno = await controlTurno.onbtenerTurnoIDSimple(id_turno);
        if (!turno) {
            return res.status(404).send({ message: 'Turno no encontrado' });
        }
        if (turno.id_asesoria !== id_asesoria) {
            return res.status(400).send({ message: 'No se puede cambiar el id de la asesoria' });
        }
        if (turno.id_defensor !== id_defensor) {
            return res.status(400).send({ message: 'No se puede cambiar el id del defensor' });
        }
    } catch (error) {
        logger.error('Error en Middleware validarPeticionPUT');
        return res.status(500).send({ message: error.message });
    }

    if (isNaN(Date.parse(fecha_turno))) {
        return res.status(400).send({ message: 'Fecha invalida' });
    }

    if (!hora_turno.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)) {
        return res.status(400).send({ message: 'Hora invalida' });
    }



    if (estatus_general !== 'EN_SEGUIMIENTO' && estatus_general !== 'NO_SEGUIMIENTO') {
        return res.status(400).send({ message: 'Estatus invalido' });
    }

    if (isNaN(id_asesoria)) {
        return res.status(400).send({ message: 'Id de asesoria invalido' });
    }

    if (isNaN(id_defensor)) {
        return res.status(400).send({ message: 'Id de defensor invalido' });
    }

    try {
        const asesoria = await controlAsesoria.obtenerAsesoriaIDSimpleMiddleware(id_asesoria);
        if (!asesoria) {
            return res.status(404).send({ message: 'Asesoria no encontrada' });
        }
    } catch (error) {
        logger.error('Error en Middleware validarPeticionPUT');
        return res.status(500).send({ message: error.message });
    }

    try {
        const defensor = await controlDefensor.obtenerDefensorIDSimpleMiddleware(id_defensor);
        if (!defensor) {
            return res.status(404).send({ message: 'Defensor no encontrado' });
        }
    } catch (error) {
        logger.error('Error en Middleware validarPeticionPUT');
        return res.status(500).send({ message: error.message });
    }

    logger.info('Fin Middleware validarPeticionPUT');
    next();
}

module.exports = {
    existeTurno,
    validarPeticionPUT
}
