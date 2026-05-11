import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClient } from "../api/fetchClient";
import { useAuth } from "../context/AuthContext";
import useCartStore from "../store/cartStore";
import '../styles/ProductDetail.css'

const ProductDetail = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {user} = useAuth()
    const {setCart} = useCartStore()

    const [product , setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                const data = await fetchClient(`/products/${id}`)
                setProduct(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleAddToCart = async() => {
        if(!user) {
            navigate('/login')
            return
        }

        setAdding(true)

        try {
            const data = await fetchClient('/cart', {
                method: 'POST',
                body: JSON.stringify({productId: product._id, quantity})
            })

            setCart(data.items)
            setAdded(true)
            setTimeout(() => setAdded(false), 2000)
        } catch (error) {
            setError(error)
        } finally{
            setAdding(false)
        }
    }

    if(loading) return <p className="state-msg">Loading...</p>
    if(error) return <p className="error-msg" style={{padding: '40px'}}>{error}</p>
    if(!product) return null

    return (
        <div className="page-container">
            <button className="back-btn" onClick={()=> navigate(-1)}>
                {'< back'}
            </button>

            <div className="detail-wrapper">
                <div className="detail-img-wrapper">
                    <img src={product.imgae} alt={product.name} />
                </div>

                <div className="detail-info">
                    <span className="product-category">{product.category}</span>
                    <h1>{product.name}</h1>
                    <p className="detail-price">${product.price.toFixed(2)}</p>
                    <p className="detail-description">{product.description}</p>

                    <div className="detail.stock">
                        {product.stock > 0
                        ? <span className="stock-badge">{product.stock} in stock</span>
                        : <span className="stock-badge out">Out of stock</span> 
                        }
                    </div>

                    {product.stock > 0 && (
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(q=> Math.max(1, q-1))} className="qty-btn">-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))} className="qty-btn">+</button>
                        </div>
                    )}

                    <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock === 0 || adding} style={{marginTop: '16px', width: '100%'}}>
                        {adding ? 'Adding...': added? 'Added to Cart!' : 'Add to Cart' }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail