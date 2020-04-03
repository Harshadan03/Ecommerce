import React, { useState } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { createCategory } from './apiAdmin'
import { Link } from 'react-router-dom'

const AddCategory = () => {
    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    //destucture user and token from localstorage
    const { user, token } = isAuthenticated()

    const handleChange = (e) => {
        setError(false)
        setName(e.target.value)
    }

    const clickSubmit = (e) => {
        e.preventDefault()
        setError(false)
        setSuccess(false)
        //make req to api to create category from backend
        createCategory(user._id, token, { name })
            .then((data) => {
                if (data.error) {
                    setError(true)
                }
                else {
                    setError("")
                    setSuccess(true)
                }
            })
    }

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted"> Name Of Category</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} autoFocus required />
            </div>
            <button className="btn btn-outline-primary">Create Category</button>
        </form>
    )

    const showSuccess = () => {
        if (success) {
            return <h3 className="alert alert-info">{name} category is created</h3>
        }
    }

    const showError = () => {
        if (error) {
            return <h3 className="alert alert-danger">Category already exist! Category should Be Unique</h3>
        }
    }

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to dashboard
            </Link>
        </div>
    )

    return (
        <Layout title="Add a new category" description={`Good Day! ${user.name}, ready to add a new category?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    )
}

export default AddCategory