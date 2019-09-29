const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication')

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

//Default Options
app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' No se ha seleccionado ningun archivo '
            }
        });
    }
    //Valida el tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
                    //ext: extension
            }
        })
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //console.log(extension); //Saber que extension tiene el archivo

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getUTCDate()}-${ new Date().getMilliseconds() }.${extension}`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);

        }
        if (tipo === 'productos') {

            imagenProducto(id, res, nombreArchivo);

        } else {
            'No se realizo nada'
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                err: {
                    ok: false,
                    message: 'Usuario no existe'
                }
            })
        }

        BorrarArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                err: {
                    ok: false,
                    message: 'Producto no existe'
                }
            });
        }

        //Borrar Archivo
        BorrarArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function BorrarArchivo(nombreArchivo, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;