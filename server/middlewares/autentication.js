//////
const jwt = require('jsonwebtoken');

//=====================================
// Autentication
//=====================================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

//=====================================
// Admin Role
//=====================================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                menssage: 'El usuario no es administrador'
            }
        })

    }

}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}