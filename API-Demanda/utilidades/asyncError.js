/**
 * Función que permite manejar los errores de las promesas
 */
module.exports=(func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(err=>next(err))
    }
}
