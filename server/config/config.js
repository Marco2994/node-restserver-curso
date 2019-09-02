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
/*
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe'
} else {
    urlDB = 'mongodb://admin:admin@cluster0-shard-00-00-fff0g.mongodb.net:27017,cluster0-shard-00-01-fff0g.mongodb.net:27017,cluster0-shard-00-02-fff0g.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
}*/
urlDB = 'mongodb+srv://admin:admin@cluster0-fff0g.mongodb.net/cafe'
process.env.URLDB = urlDB;