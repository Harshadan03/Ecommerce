const User = require('../models/user')
const braintree = require('braintree')
require('dotenv').config()

// BRAINTREE_MERCHANT_ID = p6cgf58mzxqmg4br
// BRAINTREE_PUBLIC_KEY = jnnsnbqhx47dkwm7
// BRAINTREE_PRIVATE_KEY = 119f539c6f23682e04efd7c24050a308

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken = (req, res) => {
    //generate token 
    gateway.clientToken.generate({}, function (err, respose) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.send(respose)
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    //charge
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        if (error) {
            res.status(500).json(error)
        }
        else {
            res.json(result)
        }
    })
}