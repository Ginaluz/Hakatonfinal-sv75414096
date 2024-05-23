const mongoose = require('mongoose');

const password = 'DX2KWNoAIS96BNkF';
const dbname = 'Productex';
const uri = `mongodb+srv://ginaluzsanchez:${password}@cluster0.ohph65c.mongodb.net/${dbname}?retryWrites=true&w=majority`;

module.exports = () => mongoose.connect(uri)
    .then(() => console.log('Conexión a la base de datos exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos', err));
