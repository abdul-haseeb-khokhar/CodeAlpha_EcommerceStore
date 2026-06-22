import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClient } from "../api/fetchClient";
import useCartStore from "../store/cartStore";
import '../styles/Checkout.css'

const Checkout = () => {
    const {items, totalPrice, clearCart} = useCartStore()
    const navigate = useNavigate()

    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await fetchClient('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    shippingAddress: {street, city, country}
                })
            })

            clearCart()
            navigate('/orders')
        } catch (error) {
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }

    if(items.length === 0) {
        navigate('/')
        return null
    }

    return(
        <div className="page-container">
            <h2 className="page-title">Checkout</h2>
            <div className="checkout-wrapper">
                <div className="checkout-form">
                    <h3>Shipping Address</h3>
                    {error && <p className="error-msg">{error}</p>}

                    <form onSubmit={handlePlaceOrder}>
                        <div className="form-group">
                            <label>Street Address</label>
                            <input type="text" placeholder="123 Main Street" value={street} onChange={(e) => setStreet(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input type="text" placeholder="Lahore" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input type="text" placeholder="Pakistan" value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '8px'}} disabled={loading}>
                            {loading? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary">
                    <h3>Order Summary</h3>

                    <div className="checkout-items">
                        {items.map(item => (
                            <div className="checkout-item" key={item.product._id}>
                                <img src={item.product.image} alt={item.product.name} />
                                <div className="checkout-item-info">
                                    <p>{item.product.name}</p>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                                <p className="checkout-item-price">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="summary-row total" style={{ marginTop: '16px'}}>
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout