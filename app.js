const express = require("express");
const bodyParser = require("body-parser");
const compression = require('compression');
const app = express();
require('dotenv').config();

//routing
const home = require("./src/routes")

//app setting
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(compression());
app.use(express.static(`${__dirname}/src/publics`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", home);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    console.log('server start');
});