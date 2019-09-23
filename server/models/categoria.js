const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let CategoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El valor es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario' //Viene de modulo.export del usuario.js
    }
});


module.exports = mongoose.model('Categoria', CategoriaSchema);