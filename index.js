var express = require('express')
var cors = require('cors')
var morgan = require('morgan')
var bodyParser = require('body-parser')
const axios = require("axios")
let dal = require ('wtr-dal'); 

const db = require('./db')
var app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000, function(){
    console.log("PORT 3000!")
})

let getData = require("./data/yandex.js"); 
getData.getforecast(55.75396, 37.620393);
