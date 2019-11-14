const mongooose = require('mongoose');
const validator = require('validator');



const userschema = new mongooose.Schema(
    {
        nom: {
            type: String,
            require: true,
            trim: true,
            minlength: 2

        },
        prenom: {
            type: String,
            require: true,
            trim: true,
            minlength: 2,

        },
        email: {
            type: String,
            require: true,
            trim: true,
            minlength: 2,
            unique:true,
            validate:
            {
                validator: validator.isEmail,
                message: "email invalid"

            }
        },
        tel: {
            type: String,
            require :true,
            trim: true,
            minlength: 2
        },
        motDePass:
        {
            type: String,
            trim: true,
            minlength: 4
        },
        etat : 
        {
            type: String,
            default :"desactive",
            require :true,
            trim: true,
            
        },
        statut :
        {
            type: String,
            default : "user",
            require :true,
            trim: true, 
        }

    }
);

User = mongooose.model('User', userschema);
module.exports = { User };