import {data, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import {fetchClient} from '../api/fetchClient'
import useCartStore from '../store/cartStore'
import '../styles/PorductCart.css'

const ProductCard = ({product}) => {
    const {user} = useAuth()
    const {setCart} = useCartStore()
    const navigate  = useNavigate()

    const handleAddToCart = async(e) => {
        e.stopPropagation()

        if(!user) {
            navigate('/login')
            return
        }

        try{
            const data = await fetchClient('/cart',{
                method: 'POST',
                body: JSON.stringify({productId: product._id, quantity: 1})
            })
            setCart(data.items)
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <div className='product-card' onClick={() => navigate(`/product/${product._id}`)}>
            <div className='product-img-wrapper'>
                <img src="{product.img" alt="product.name" />
            </div>

            <div className='product-info'>
                <span className='product-category'>{product.category}</span>
                <h3 className='product-name'>{product.name}</h3>
                <p className='product-price'>${product.price.toFixed(2)}</p>

                <div className='product-footer'>
                    <span className={`stock-badge ${product.stock === 0 ? 'out' : ''}`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                    </span>

                    <button className='btn btn-primary' onClick={handleAddToCart} disabled={product.stock === 0}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard