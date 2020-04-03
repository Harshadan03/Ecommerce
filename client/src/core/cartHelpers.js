export const addItem = (item, next) => {
    let cart = []
    if (typeof window !== 'undefined') {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }

        cart.push({
            ...item,
            count: 1
        })

        //remove duplicates
        //built an array from new Set and turn it back into array using Array.from()
        //so that later we cam re-map it
        //new Set wil allow only unique values in it
        //so pass the ids of each Object/product
        //If the loop tries to add the same value again , it will get ignored
        //...with array of ids we got on when first map() was used
        //run map() on it again and retrun the actual product from the cart

        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
            return cart.find(p => p._id === id)
        })

        localStorage.setItem("cart", JSON.stringify(cart))
        next()
    }

}


export const itemTotal = () => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
            return JSON.parse(localStorage.getItem("cart")).length
        }
    }
    return 0
}

//get items from the localstorage to show them on cart page
export const getCart = () => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
            return JSON.parse(localStorage.getItem("cart"))
        }
    }
    return []
}

//update the count/quantity of the product in the localstorage
export const updateItem = (productId, count) => {
    let cart = []
    if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        cart.map((p, i) => {
            if (p._id === productId) {
                cart[i].count = count
            }
        })
        localStorage.setItem("cart", JSON.stringify(cart))
    }
}

//remove product from cart and so from localstorage
export const removeItem = (productId) => {
    let cart = []
    if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        cart.map((p, i) => {
            if (p._id === productId) {
                cart.splice(i, 1)
            }
        })
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    return cart
}

// empty the cart after the payment is successful
export const emptyCart = (next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            localStorage.removeItem('cart')
        }
        next()
    }
}