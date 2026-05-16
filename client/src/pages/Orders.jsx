import { useState, useEffect } from "react";
import { fetchClient } from "../api/fetchClient";
import '../styles/Orders.css'

const statusColors = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  delivered: '#22c55e',
  cancelled: '#ef4444'
}

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchClient('/orders')
                setOrders(data)
            } catch (error) {
                setError(error)
            }finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    if(loading) return <p className="state-msg">Loading orders...</p>
    if(error) return <p className="error-msg" style={{padding: '40px'}}>{error}</p>

    return
    (
        <div className="page-container">
            <h2 className="page-title">
                My Orders
            </h2>

            {orders.length === 0 ? (
                <p className="state-msg">You have no orders yet</p>
            ): (
                <div className="orders-list">
                    {orders.map(order => (
                        <div className="order-card" key={order._id}>
                            <div className="order-header">
                                <div>
                                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-US',{
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <span className="order-status" style={{ backgroundColor: statusColors[order.status]}}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map (item => (
                                    <div className="order-item" key={item.product._id}>
                                        <img src={item.product.image} alt={item.product.name} />
                                        <div className="order-item-info">
                                            <p>{item.product.name}</p>
                                            <span>Qty: {item.quantity}</span>
                                        </div>

                                        <p className="order-item-price">
                                            ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-address">
                                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                                </div>
                                <p className="order-total">
                                    Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders