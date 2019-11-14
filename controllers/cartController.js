const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multipart = require('connect-multiparty');

const jwt = require('jsonwebtoken');

const { mongooose } = require('../db/config');
const { Product } = require('../models/product');
const { ShoppingCart } = require('../models/shoppingCart');

const multipartMiddleware = multipart({ uploadDir: './assets' });

var app = express();
app.use(bodyParser.json());

app.post("/removeProd", (req, res) => {
    console.log("removeProd");
    let prod = req.body.prod;
    let idCart = req.body.idCart;
    let quantite = req.body.quantite;
    let idprod=req.body.idprod;
    let shoppingCart;
    let ps = [];

console.log("aaaaaaaaa");

var obj = {  idprod ,prod, quantite };
console.log("f"+obj.quantite);
    ShoppingCart.findOne({ _id: idCart }).then((cart) => {
        if (cart) {
            ps = cart.products;
            console.log("zz"+ps);
            
            ps.splice(ps.indexOf(obj)+1,1);
            shoppingCart = new ShoppingCart({
                _id: idCart,
                idUser: cart.idUser,
                products: ps
            })
            console.log("+ps+"+ps);
            console.log("ee"+ps.indexOf(obj));

            ShoppingCart.findByIdAndUpdate({ _id: idCart }, { $set: shoppingCart }, { new: true }, (err, doc) => {

                if (!err) {
                    res.status(200).send(doc);
                }
                else {
                    res.status(400).send(console.log("erreur de mise a jour" + err));
                }

            })
        }
    });
});

app.post("/createCartuser", (req, res) => {
    console.log("createCartUser");
    let idUser = req.body.idUser;
    console.log(idUser);

    shoppingCart = new ShoppingCart({
        idUser: idUser,
        products: [

        ]
    })

    shoppingCart.save().then(() => {

        console.log(shoppingCart._id);

        res.status(200).send(shoppingCart._id);

    }).catch((err) => {
        res.status(400).send({
            message: "erreur : " + err
        })
    });


});


app.get("/createCart", (req, res) => {
    console.log("createCart");

    console.log("ccccccc");

    shoppingCart = new ShoppingCart({
        idClient: null,
        products: [

        ]
    })

    shoppingCart.save().then(() => {

        console.log(shoppingCart._id);

        res.status(200).send(shoppingCart._id);

    }).catch((err) => {
        res.status(400).send({
            message: "erreur : " + err
        })
    });


});

app.post("/getCart", (req, res) => {
    console.log("getCart");

    let token = req.body.token;
    let idUser = jwt.verify(token, 'kts');
    console.log(idUser.idUser);

    ShoppingCart.findOne({ idUser: idUser.idUser }).then((Cart) => {

        res.status(200).send(Cart);
    }).catch((e) => {
        res.status(400).send({
            message: "erreur : " + e
        })


    });
});

app.post("/getAllProductsUser", (req, res) => {
    console.log("getAllProductsUser");

    let idCart = req.body.idCart;


    ShoppingCart.findOne({ _id: idCart }).then((Cart) => {
        console.log(Cart.products);

        res.status(200).send(Cart.products);
    }).catch((e) => {
        res.status(400).send({
            message: "erreur : " + e
        })


    });
});



app.post("/findeAndUpdate", (req, res) => {
    console.log("findAndUpdate");
    let token = req.body.token;
    let idUser = jwt.verify(token, 'kts');
    let idCart = req.body.idCart;

    ShoppingCart.findByIdAndUpdate({ _id: idCart }), { $set: idUser }, { new: idUser.idUser }, (err, doc) => {
        if (!err) {

            console.log("d" + doc.idUser);
            console.log("d" + doc._id);
            res.status(200).send(doc);
        }
        else {
            res.status(400).send(console.log("erreur de mise a jour" + err));
            console.log("findAndUpdate");
        }

    }
});

app.post("/addToCart", (req, res) => {

    let idCart = req.body.idCart;
    let prod = req.body.prod;
    console.log(prod);

    let quantite = req.body.quantite;
    let shoppingCart;
    let ps = [];
    let prodt = new Product({
        productName: prod.productName,
        productDescription: prod.productDescription,
        productPrice: prod.productPrice,
        prodDate: prod.prodDate,
        idClient: prod.idClient,
        photoUrl: prod.photoUrl
    });
    console.log(prodt);

    var obj = { prod, quantite };

    ShoppingCart.findOne({ _id: idCart }).then((cart) => {
        if (cart) {
            ps = cart.products;
            ps.push(obj);
            shoppingCart = new ShoppingCart({
                _id: idCart,
                idUser: cart.idUser,
                products: ps
            })

            ShoppingCart.findByIdAndUpdate({ _id: idCart }, { $set: shoppingCart }, { new: true }, (err, doc) => {

                if (!err) {
                    res.status(200).send(doc);
                }
                else {
                    res.status(400).send(console.log("erreur de mise a jour" + err));
                }

            })
        }
    });
});




/*
 
    app.post("/getOrCreateCart", (req, res) => {
        console.log("ccccccc");
 
        let data = req.body;
        let idCart = data.id;
        let name = data.prod.productName;
        let shoppingCart;
 
        console.log(idCart);
        if (idCart === "") {
            shoppingCart = new ShoppingCart({
                products: [
                    {
                        prod:
                        {
                            _id: data.prod._id,
                            productName: data.prod.productName,
                            productDescription: data.prod.productDescription,
                            productPrice: data.prod.productPrice,
                            prodDate: data.prod.prodDate,
                            idSeller: data.prod.idSeller
                        },
                        quantite: data.quantite
 
                    }
                ]
            })
 
            shoppingCart.save().then(() => {
 
                console.log(shoppingCart._id);
 
                res.status(200).send(shoppingCart._id);
 
            }).catch((err) => {
                res.status(400).send({
                    message: "erreur : " + err
                })
            });
 
        }
        else {
            console.log("else");
 
            ShoppingCart.findOne({ _id: idCart }).then((shoppingCartArray) => {
 
                console.log(shoppingCartArray);
 
                for (let i = 0; i < shoppingCartArray.products.length; i++) {
 
                    if (shoppingCartArray.products[i].prod.productName == name) {
                        console.log(name);
                        console.log(shoppingCartArray.products[i].quantite);
 
 
                        ShoppingCart.findByIdAndUpdate({
                            _d: idCart
                        }, { $set: shoppingCartArray.products[i].quantite }, { new: shoppingCartArray.products[i].quantite++ }, (err, doc) => {
 
                        });
                        console.log(shoppingCartArray.products[i].quantite);
 
                    }
 
                }
                if (i == shoppingCartArray.products.length) {
                    shoppingCartArray.products.push({
                        prod:
                        {
                            name: data.prod._id,
                            productName: data.prod.productName,
                            productDescription: data.prod.productDescription,
                            productPrice: data.prod.productPrice,
                            prodDate: data.prod.prodDate,
                            idSeller: data.prod.idSeller
                        },
                        quantite: data.quantite
 
                    })
                }
                res.status(200).send(idCart);
 
            }).catch((e) => {
                res.status(400).send({
                    message: "erreur : " + e
                })
 
            })
        }
 
 
    });*/
module.exports = app;
