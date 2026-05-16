import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useCartStore from '../store/cartStore'
import '../styles/Navbar.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { totalItems } = useCartStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    console.log('Nav USER', user)
    console.log('Name: ', user?.name)
    return (
        <nav className="navbar">
            {user ? (
            <div className="navbar-profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span>{user?.name}</span>
            </div>
            ): (
                <div></div>
            )}

            <div className="navbar-links">
                <Link to='/'>Home</Link>
                {user ? (
                    <>
                        <Link to='/cart' className="cart-link">
                            Cart
                            {totalItems > 0 && (
                                <span className="cart-badge">{totalItems}</span>
                            )}
                        </Link>

                        <Link to='/orders'>Orders</Link>
                        <button className="btn btn-outline" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register' className="btn btn-primary">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar