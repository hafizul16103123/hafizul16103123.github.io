const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const bodyParser = require('body-parser')              //will receive form data
const cookieParser = require('cookie-parser')          // express-jwt need cookie-parser to Authorization
const cors = require('cors')          // express-jwt need cookie-parser to Authorization
const expressValidator=require('express-validator')    // to validate form data

//import routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const productRouter = require('./routes/productRoutes')

//Connect to mongoose database
const db=process.env.DATABASE
mongoose.connect(db,{
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>console.log("DB connected"))

//create main App
const app = express()

// invock middlewares must be before route middleware
app.use(morgan('dev'));
app.use(bodyParser.json());                          //convert form-data to json
app.use(cookieParser());                             //convert form-data to json ,must use like function call
app.use(expressValidator());                         // to validate user input
app.use(cors());                                     // to handle front-end request
  
// routes middleware
app.use('/api',authRouter);
app.use('/api',userRouter);
app.use('/api',categoryRouter);
app.use('/api',productRouter);

//define port and listening the port
const port=process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})