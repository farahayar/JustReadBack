const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");


var app = express();
var port = "3000";


const product= require('./controllers/productController');
const user= require('./controllers/userController');
const cart= require('./controllers/cartController');


app.use(bodyParser.json());
app.use(cors());

app.use(express.static('assets'))

app.use('/product',product);
app.use('/user',user);
app.use('/cart',cart);



app.listen(port, () => console.log(`Listening on port ${port}`));
