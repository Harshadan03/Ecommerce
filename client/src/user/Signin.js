import React, { useState } from 'react'
import Layout from '../core/Layout'
import { signin, authenticate, isAuthenticated } from '../auth'
import { Redirect } from 'react-router-dom'


const Signin = () => {

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectToReferrer: false
    })

    const { email, password, error, loading, redirectToReferrer } = values
    //this is HIGHER ORDER FUNCTION: a function returnning another function
    const handleChange = name => event => {
        setValues({
            ...values,
            error: false,
            [name]: event.target.value
        })
    }


    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, error: false, loading: true })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                }
                else {

                    authenticate(data, () => {
                        setValues({
                            ...values,
                            redirectToReferrer: true
                        })
                    })
                }
            })
    }


    const signInForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" onChange={handleChange('email')} className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" onChange={handleChange('password')} className="form-control" value={password} />
            </div>
            <button onClick={clickSubmit} className="btn btn-outline-primary">Submit</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? "" : 'none' }}>
            {error}
        </div>
    )

    const showLoading = () => loading && (
        <div className="alert alert-info">
            <h2>Loading.......</h2>
        </div>
    )

    const { user } = isAuthenticated()

    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            }
            else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    return (
        <Layout title="SignIn Page" description="signin for Node React E-commerce App"
            className="container  offset-md-2 ">
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}

        </Layout>
    )
}

export default Signin