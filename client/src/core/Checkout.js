import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore'
import { emptyCart } from './cartHelpers'
import Card from './Card'
import { isAuthenticated } from '../auth'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({ products, setRun = f => f, run = undefined }) => {

    const [data, setdata] = useState({
        success: false,
        clientToken: null,
        error: "",
        instance: {},
        address: "",
        loading: false
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getClientToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                setdata({ ...data, error: data.error })
            }
            else {
                setdata({ clientToken: data.clientToken })
            }
        })
    }

    useEffect(() => {
        getClientToken(userId, token)
    }, [])

    const getTotal = () => {
        //reduce is a mrthod of arrays
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    let deliveryAddress = data.address
    const buy = () => {

        setdata({ loading: true })

        // send nonce to your server 
        // nonce  = data.instance.requestPaymentmethod()
        let nonce
        let getNonce = data.instance.requestPaymentMethod()
            .then(data => {
                //console.log(data)
                nonce = data.nonce
                //once you have nonce (card type, card  number) send nonce as 'paymentMethodNonce'
                //and also total to be charged
                //console.log('send nonce and total to process', nonce, getTotal(products))
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }
                processPayment(userId, token, paymentData)
                    .then(response => {
                        console.log(response)

                        //create order
                        const createOrderdata = {
                            products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        }

                        createOrder(userId, token, createOrderdata).then(
                            (response) => {

                                //empty cart
                                emptyCart(() => {
                                    setRun(!run)// run useEffect in Parent Cart
                                    console.log("Payment sucesss and cart is empty")
                                    setdata({ loading: false, success: true })
                                })

                            }
                        ).catch(err => {
                            console.log(err)
                            setdata({ loading: false })
                        })



                    }).catch(err => {
                        console.log(err)
                        setdata({ loading: false })
                    })
            })
            .catch(error => {
                //console.log('drop in error: ', error)
                setdata({ ...data, error: error.message })
            })

    }

    const handleAddress = (event) => {
        setdata({ ...data, address: event.target.value })
    }

    const showdropIn = () => (
        <div onBlur={() => setdata({ ...data, error: "" })} >
            {data.clientToken !== null && products.length > 0 ?
                (
                    <div>
                        <div className="form-group mb-3">
                            <label className="text-muted">Delivery address</label>
                            <textarea
                                onChange={handleAddress}
                                className="form-control"
                                value={data.address}
                                placeholder="Type your delivery address here..."
                                required
                            />
                        </div>
                        <DropIn options={{
                            authorization: data.clientToken
                        }} onInstance={instance => data.instance = instance} />
                        <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                    </div>
                ) :
                null
            }
        </div>
    )
    const showSuccess = (success) => (
        <div className="alert alert-info" style={{ display: success ? "" : "none" }} >
            Payment Done successfully! :)
        </div>
    )

    const showLoading = loading => loading && <h2>Loading....</h2>

    const showError = (error) => (
        <div className="alert alert-danger" style={{ display: error ? "" : "none" }} >
            {error}
        </div>
    )


    return (

        <div>
            <h2>Total : ${getTotal()}</h2>

            {showError(data.error)}
            {showSuccess(data.success)}
            {showLoading(data.loading)}
            <div>{showdropIn()}</div>
        </div>
    )
}

export default Checkout