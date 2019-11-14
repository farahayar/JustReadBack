const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const userId = require('mongoose').Types.idUser;



const { mongooose } = require('./../db/config');
const { User } = require('./../models/user')




var app = express();
app.use(bodyParser.json());



app.get("/getAll", (req, res) => {

    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log("error in retriving users" + jason.stringify(err, undefined, 2)); }

    })

});


app.get("/getAllUser", (req, res) => {

    User.find(({ statut: 'user' }), (err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log("error in retriving users" + jason.stringify(err, undefined, 2)); }

    })

});







app.post("/inscription", (req, res) => {
    let data = req.body;
    console.log(data);
    
    let privateKey = 10;
    let hashedPassword = bcrypt.hashSync(data._motDePass, privateKey);

    var user = new User({  
        nom: data._nom,
        prenom: data._prenom,
        email: data._email,
        tel: data._tel,
        motDePass: hashedPassword
    });
    console.log(user);
    user.save().then(() => {

        res.status(200).send(user);

    }).catch((err) => {
        res.status(400).send({
            message: "erreur : " + err
        })
    });

});


app.post("/connection", (req, res) => {

    var data = req.body;
    let email = data._email;
    let motDePass = data._motDePass;

    User.findOne({ email }).then((user) => {

        if (!user) {
            res.status(400).send({ message: "email incorrect" })
        }

        if (!bcrypt.compareSync(motDePass, user.motDePass)) {
            res.status(404).send({ message: "mot de passe incorrect" })

        }
        /*if (!user.etat == "active") {
            res.status(404).send({ message: "access denied" });

        }*/


        let token = jwt.sign({ idUser: user._id, statut: user.statut }, "kts").toString();
        res.status(200).send({ token });

    }).catch((err) => {
        res.status(400).send({
            message: "erreur : " + err
        })
    });

});


app.put("/acitvate/:id", (req, res) => {

    let id = req.params.id;



    User.findById({ _id: id }).then((user) => {


        if (!user) {
            res.status(400).send(console.log("user not found" + err));
        }
        else {
            let e = user.etat;

            x: String;
            x = (e == "active") ? "desactive" : "active"

            var u = {
                etat: x
            }

            User.findByIdAndUpdate({ _id: user.id }, { $set: u }, { new: true }, (err, doc) => {
                if (!err) {
                    User.find({ statut: 'user' }).then((users) => {
                        res.status(200).send(users);

                    })
                }
                else {
                    res.status(400).send(console.log("erreur de mise a jour" + err));
                }
            });
        }

    });



})

app.put("/toAdmin/:id", (req, res) => {

    let id = req.params.id;



    User.findById({ _id: id }).then((user) => {


        if (!user) {
            res.status(400).send(console.log("user not found" + err));
        }
        else {
            let e = user.statut;

            x: String;
            x = (e == "admin") ? "user" : "admin"

            var u = {
                statut: x
            }

            User.findByIdAndUpdate({ _id: user.id }, { $set: u }, { new: true }, (err, doc) => {
                if (!err) { res.status(200).send(doc); }
                else {
                    res.status(400).send(console.log("erreur de mise a jour" + err));
                }
            });
        }

    });
})




module.exports = app;