const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
// Morgan is basically a logger, on any requests being made,it generates logs automatically. 
//Morgan is a popular HTTP request middleware logger for Node. js and basically used as a logger.
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser')//bcz we are saving user credentials in the cookie
const expressValidator = require('express-validator')
//Cross-Origin Resource Sharing (CORS) is a protocol that enables scripts running on a
// browser client to interact with resources from a different origin.
//CORS is a node.js package for providing a Connect/Express middleware 
//that can be used to enable CORS with various options.
const cors = require('cors')

//import the .env file
require('dotenv').config()

//import routes 
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const braintreeRoutes = require('./routes/braintree')
const orderRoutes = require('./routes/order')


//middlewares
app.use(morgan('dev'))//we pass the dev flag
app.use(bodyParser.json())
app.use(cookieparser())
app.use(expressValidator())
app.use(cors())


//routes middleware
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", braintreeRoutes)
app.use("/api", orderRoutes)


//connect to db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => { console.log("Mongo connected!") })

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})



// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})
