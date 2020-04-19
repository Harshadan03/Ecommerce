const REACT_APP_API_URL = "/api"

export const readUserProfile = (userId, token) => {
    return fetch(`${REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json()
        }).catch(err => console.log(err))
}

export const updateUserProfile = (userId, token, user) => {
    return fetch(`${REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

export const updateUserInLocalStorage = (userData, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"))
            auth.user = userData
            console.log(auth)
            localStorage.setItem("jwt", JSON.stringify(auth))
            next()
        }
    }
}


export const getPurchaseHistory = (userId, token) => {
    return fetch(`${REACT_APP_API_URL}/order/by/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json()
        }).catch(err => console.log(err))
}