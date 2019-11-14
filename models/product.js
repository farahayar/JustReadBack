const mongooose = require('mongoose');
const validator = require('validator');


const productSchema = new mongooose.Schema({

    productName:
    {
        type: String,
        require: true,
        trim: true,

    },
    productDescription:
    {
        type: String,
        require: true,
        trim: true,

    },
    productPrice:
    {
        type: String,
        require: true,
        trim: true,

    },
    prodDate:
    {
        type: String,
        require: true,
        trim: true,

    },
    idClient:
    {
        type: String,
        require: true,
        trim: true,

    },
    photoUrl:{
        type: String,
        require: true,
        trim: true,
    }


})

Product = mongooose.model('Product', productSchema);
module.exports = { Product };