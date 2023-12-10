const express = require("express")
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


// cross origin requests
// app.use(cors({
//     origin: ['http://localhost:3000'],
//     // origin: '*',
//     credentials: true,
// }))

// app.use(
//     cors({
//       origin: "*",
//       credentials: true,
//     })
//   );
app.use(cors())
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });



// regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// cookies and file middleware
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))

// morgan middleware
app.use(morgan("tiny"))


// import all routes here

const user = require('./routes/user')
const product = require('./routes/product')
const category = require('./routes/category')
const cart = require('./routes/cart')
const payment = require('./routes/payment')
const address = require('./routes/address')
const order = require('./routes/order')


// router middleware

app.use('/api/v1',user)
app.use('/api/v1',product)
app.use('/api/v1',category)
app.use('/api/v1',cart)
app.use('/api/v1',payment)
app.use('/api/v1',address)
app.use('/api/v1',order)



// export app js
module.exports = app