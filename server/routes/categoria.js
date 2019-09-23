////////
const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');
const Categoria = require('../models/categoria');
const _ = require('underscore');

const app = express();


//Crear Categoria con ID de usuario
app.post('/categoria', verificaToken, function(req, res) {

    let body = req.body; //Toma los valores de categoria
    let usuario = req.usuario; //Toma los valores de usuario(proviene del token)

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//listar todas las categorias
app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            });
        });
})

//Listar usuarios por ID del creador
app.get('/categoriaID', verificaToken, function(req, res) {

    let usuario1 = req.usuario;
    let usuaID = new Categoria({ usuario: usuario1._id });
    let usuario = usuaID.usuario;

    //console.log({ usuario });
    Categoria.find(({ usuario }), 'descripcion usuario', (err, data) => {

        if (err) {
            return res.json(400).json({
                ok: false,
                err
            });
        }

        if (!data) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no ha registrado ninguna categoria'
                }
            });
        } else {
            res.json({
                ok: true,
                data1: data
            })
        }
    })

});


//Actualizar un registro de categorias
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, actualizarCategoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actualizarCategoria) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe registro para actualizar'
                }
            });
        } else {
            res.json({
                ok: true,
                categoria: actualizarCategoria
            })
        }
    })

});

//Eliminar De MONGO
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.json(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe registro para actualizar'
                }
            });
        } else {
            res.json({
                ok: true,
                categoria: categoriaBorrada
            })
        }
    })
})



module.exports = app;