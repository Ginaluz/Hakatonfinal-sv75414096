const controller = {};
const connection = require("../dbConnection/Connection");
const product = require("../models/productos.model")


controller.index = async (req, res) => {
    try{
        const title = "index en el servidor";
        await connection();
        const  allproductos = await product.find();
        console.log(allproductos);
         res.render("index", { title});
    } catch(err) {
        console.error(err);
    }

};


module.exports = controller;