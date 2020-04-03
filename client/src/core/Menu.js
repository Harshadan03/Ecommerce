import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { signout, isAuthenticated } from '../auth'
import { itemTotal } from './cartHelpers'


const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' }
    }
    else {
        return { color: '#ffffff' }
    }
}

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" to="/" style={isActive(history, "/")}>Home</Link>

            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/shop" style={isActive(history, "/shop")}>Shop</Link>

            </li>

            {
                (isAuthenticated() && isAuthenticated().user.role === 0) ? (
                    <Fragment>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart" style={isActive(history, "/cart")}>
                                Cart{" "}<sup><small className="cart-badge">{itemTotal()}</small></sup>
                            </Link>

                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/user/dashboard" style={isActive(history, "/user/dashboard")}>Dashboard</Link>

                        </li>

                    </Fragment>
                ) : (
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/dashboard" style={isActive(history, "/admin/dashboard")}>Dashboard</Link>

                        </li>

                    )
            }

            {!isAuthenticated() ? (
                <Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signin" style={isActive(history, "/signin")}>SignIn</Link>

                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup" style={isActive(history, "/signup")}>SignUp</Link>

                    </li>
                </Fragment>
            ) : (
                    <li className="nav-item">
                        <Link className="nav-link" to="" style={{ cursor: 'pointer', color: '#ffffff' }}
                            onClick={() =>
                                signout(() => {
                                    if (localStorage.getItem('cart')) {
                                        localStorage.removeItem('cart')
                                    }
                                    history.push('/')
                                })
                            }>SignOut</Link>

                    </li>
                )}


        </ul>
    </div>
)

export default withRouter(Menu)