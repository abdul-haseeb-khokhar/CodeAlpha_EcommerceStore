import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClient } from "../api/fetchClient";
import useCartStore from "../store/cartStore";
import '../styles/Cart.css'

const Cart = () => {
    const { items, setCart, clearCart, totalPrice } = useCartStore()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await fetchClient('/cart')
                setCart(data.items || [])
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCart()

    }, [])

    const handleQuantityChange = async (productId, qunatity) => {
        try {
            const data = await fetchClient(`/cart/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({qunatity})
            })
        } catch (error) {
            setError(error.message)
        }
    }

    const handleRemove = async (productId) => {
        try {
            const data = await fetchClient(`/cart/${productId}`,{
                method: 'DELETE'
            })

            setCart(data.items)
        } catch (error) {
            setError(error.message)
        }
    }

    if(loading) return <p className="state-msg">Loading...</p>
    if(error) return <p className="error-msg" style={{padding: '40px'}}>{error}</p>

    if(items.length === 0) {
        return (
            <div className="page-container">
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }
    return(
        <div className="page-container">
            <h2 className="page-title">Your Cart</h2>

            <div className="cart-wrapper">
                <div className="cart-items">
                    {items.map(item => (
                        <div className="cart-item" key={item.product._id}>
                            <img src={item.product.image} alt={item.product.name} />
                            <div className="cart-item-info">
                                <h4>{item.product.name}</h4>
                                <p className="cart-item-price">
                                    ${item.product.price.toFixed(2)}
                                </p>
                            </div>

                            <div className="cart-item-qty">
                                <button className="qty-btn" onClick={() => handleQuantityChange(item.product._id,item.qunatity-1)}>-</button>
                                <span>{item.qunatity}</span>
                                <button className="qty-btn" onClick={() => handleQuantityChange(item.product._id,item.qunatity+1)}></button>
                            </div>

                            <p className="cart-item-total">
                                ${(item.product.price * item.qunatity).toFixed(2)}
                            </p>

                            <button className="btn btn-danger" onClick={() => handleRemove(item.product._id)}>Remove</button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>

                    <div className="summary-row">
                        <span>Suntotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span className="free">Free</span>
                    </div>
                    <div className="summary-row-total">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <button className="btn btn-primary" style={{width: '100%', marginTop: '20px'}} onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px'}} onClick={() =>  navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart