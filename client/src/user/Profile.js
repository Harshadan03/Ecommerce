import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Redirect } from 'react-router-dom'
import { readUserProfile, updateUserInLocalStorage, updateUserProfile } from './apiUser'

const Profile = ({ match }) => {

    const [values, setValues] = useState({
        name: "",
        password: "",
        email: "",
        error: false,
        success: false
    })

    const { name, email, password, error, success } = values
    const { token } = isAuthenticated()

    const init = (userId) => {
        // console.log(userId)
        readUserProfile(userId, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: true })
            }
            else {
                setValues({ ...values, name: data.name, password: data.password, email: data.email })
            }
        })
    }

    useEffect(() => {
        init(match.params.userId)
    }, [])

    const handleChange = name => e => {
        setValues({ ...values, error: false, [name]: e.target.value })
    }

    const clickSubmit = (e) => {
        e.preventDefault()
        updateUserProfile(match.params.userId, token, { name, email, password }).then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                updateUserInLocalStorage(data, () => {
                    setValues({ ...values, name: data.name, email: data.email, success: true })
                })
            }
        })
    }

    const redirectUser = (success) => {
        if (success) {
            return <Redirect to="/cart" />
        }
    }

    const profileUpdate = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" onChange={handleChange("name")} value={name} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" onChange={handleChange("email")} value={email} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" onChange={handleChange("password")} value={password} className="form-control" />
            </div>
            <button className="btn btn-primary" onClick={clickSubmit} >Update</button>
        </form>
    )

    return (
        <Layout title="Profile" description="Update your profile" className="container">
            <h2 className="mb-4">Profile</h2>
            {profileUpdate(name, email, password)}
            {redirectUser(success)}
        </Layout>
    )
}

export default Profile