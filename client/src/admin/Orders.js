import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin'
import moment from 'moment'

const Orders = () => {

    const [orders, setOrders] = useState([])
    const [statusValues, setStatusValues] = useState([])

    const { user, token } = isAuthenticated()

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {

            if (data.error) {

                console.log(data.error)
            }
            else {
                setOrders(data)
            }
        })
    }

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {

            if (data.error) {
                console.log(data.error)
            }
            else {
                setStatusValues(data)
            }
        })
    }

    useEffect(() => {
        loadOrders()
        loadStatusValues()
    }, [])

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h2 className="text-danger display-2"> Total Orders: {orders.length}</h2>
            )
        }
        else {
            return (
                <h2 className="text-danger">No Orders</h2>
            )
        }
    }

    const handleStatusChange = (e, orderId) => {
        // update the status of the order in the database too , when it changes here

        updateOrderStatus(user._id, token, orderId, e.target.value).then(data => {

            if (data.error) {
                console.log("status update failed", data.error)
            }
            else {
                loadOrders()
            }
        })
    }

    const showStatus = (o) => (
        <div className="form-group">
            <h3 className="mark mb-4">Status : {o.status}</h3>
            <select className="form-control" onChange={(e) => handleStatusChange(e, o._id)}>
                <option>Update Status</option>
                {
                    statusValues.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                    ))

                }
            </select>
        </div>
    )

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            <input type="text" value={value} className="form-control" readOnly />
        </div>
    )

    return (
        <Layout title="Orders" description={`G'day ${user.name}, you can manage all the orders here`}
            className="container">
            <div className="row" >
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}
                    {
                        orders.map((o, oIndex) => {
                            return (
                                <div className="mt-5" key={oIndex}
                                    style={{ borderBottom: "5px solid Indigo" }}>
                                    <h2 className="mb-5">
                                        <span className="bg-warning">
                                            Order Id: {o._id}
                                        </span>
                                    </h2>
                                    <ul className="list-group-mb-2">
                                        <li className="list-group-item" >
                                            {showStatus(o)}
                                        </li>
                                        <li className="list-group-item">
                                            Transaction Id : {o.transaction_id}
                                        </li>
                                        <li className="list-group-item">
                                            Amount: ${o.amount}
                                        </li>
                                        <li className="list-group-item" >
                                            Order By : {o.user.name}
                                        </li>
                                        <li className="list-group-item" >
                                            Ordered on: {moment(o.createdAt).fromNow()}
                                        </li>
                                        <li className="list-group-item" >
                                            Delivery Address : {o.address}
                                        </li>

                                    </ul>
                                    <h3 className="mb-4 mt-4 font-italic">
                                        Total Products in the order  : {o.products.length}
                                    </h3>
                                    {
                                        o.products.map((p, pIndex) => (
                                            <div className="mb-4" key={pIndex}
                                                style={{ padding: "20px", border: "1px solid indigo" }} >
                                                {showInput('Product name', p.name)}
                                                {showInput('Product price', p.price)}
                                                {showInput('Product total', p.count)}
                                                {showInput('Product Id', p._id)}
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Layout>
    )
}

export default Orders