
import qs from 'query-string'
require('dotenv').config()

export const getProducts = (sortBy) => {
    return fetch(`${process.env.REACT_APP_API_URL}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
        .then(response => {
            return response.json()
        }).catch(err => console.log(err))
}


export const getAllCategories = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/categories`, {
        method: "GET"
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}


export const getFilteredProducts = (skip, limit, filters = {}) => {

    const data = {
        limit, skip, filters
    }

    return fetch(`${process.env.REACT_APP_API_URL}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => { return response.json() })
        .catch(err => { console.log(err) })

}



export const list = (params) => {
    const query = qs.stringify(params)
    console.log("query", query)
    return fetch(`${process.env.REACT_APP_API_URL}/products/search?${query}`, {
        method: "GET"
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}


//get singl eproduct by id from backend
export const readSingleProductFromApi = (productId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/product/${productId}`, {
        method: "GET"
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

//get list of related products
export const listRealted = (productId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/products/related/${productId}`, {
        method: "GET"
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}


//get braintree client token from backend
export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

//get braintree client token from backend
export const processPayment = (userId, token, paymentData) => {
    return fetch(`${process.env.REACT_APP_API_URL}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}


// create order
export const createOrder = (userId, token, createOrderdata) => {
    return fetch(`${process.env.REACT_APP_API_URL}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderdata })
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}
