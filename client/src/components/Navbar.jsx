import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useCartStore from '../store/cartStore'
import '../styles/Navbar.css'

const Navbar = () => {
    const {user, logout} = useAuth()
    const {totalItems} = useCartStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return(
        <nav className="navbar">
            <Link to='/' className="navbar=brand">ShopNow</Link>

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
                    <span className="navbar-user">Hi, {user.name}</span>
                    <button className="btn btn-outline" onClick={handleLogout}>
                        Logout
                    </button>
                    </>
                ):(
                    <>
                    <Link to='/login'>Login</Link>
                    <link to='/register' className="btn btn-primary">Register</link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar