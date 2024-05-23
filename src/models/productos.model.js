const mongoose = require('mongoose');
const { Schema } = mongoose;

const productschema = new Schema ({
    name: { type: String, required: true },
})

const product = mongoose.model('productos', productschema);

module.exports = product;