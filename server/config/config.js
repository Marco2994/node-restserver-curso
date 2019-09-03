//=====================================
// Puerto
//=====================================

process.env.PORT = process.env.PORT || 3000;

//=====================================
// Entorno
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================================
// Base de Datos
//=====================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe'
} else {
    urlDB = 'mongodb+srv://admin:admin@cluster0-fff0g.mongodb.net/cafe'
}
//urlDB = 'mongodb+srv://admin:admin@cluster0-fff0g.mongodb.net/cafe'
process.env.URLDB = urlDB;