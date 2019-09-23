const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');
const Producto = require('../models/producto');
const _ = require('underscore');

const app = express();

//Crear Producto
app.post('/producto', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//Actualizar Producto

app.put('/producto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, actualizarProducto) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actualizarProducto) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'ID NO EXISTE'
                }
            });
        } else {
            res.json({
                ok: true,
                producto: actualizarProducto
            })
        }
    });

})

//Listar los campos de Produtos
app.get('/producto', verificaToken, function(req, res) {

    Producto.find()
        .populate('usuario categoria', 'nombre descripcion')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
})

//Listar los campos por un ID de Categoria
app.get('/producto/:id', verificaToken, function(req, res) {

    let categoria = req.params.id

    Producto.find(({ categoria }), (err, productoCategoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoCategoria
        });
    });

});

//Buscar productos con especie de LIKE

app.get('/producto/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosBusqueda) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productosBusqueda
            });
        })

})



//Eliminar el producto pero por actualizacion de estado
app.delete('/producto/:id', verificaToken, function(req, res) {

    let disponible = { disponible: false }
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, disponible, { new: true }, (err, eliminarEstado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!eliminarEstado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'ID NO EXISTE'
                }
            });
        } else {
            res.json({
                ok: true,
                producto: eliminarEstado
            });
        }

    });

})



module.exports = app;