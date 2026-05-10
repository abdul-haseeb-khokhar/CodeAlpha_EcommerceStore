import { useState, useEffect } from "react";
import { fetchClient } from "../api/fetchClient";
import ProductCard from '../components/ProductCard'
import '../styles/Home.css'

const Home = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    const fetchProducts = async () => {
        setLoading(true)
        try{
            let query = ''
            if(search) query += `search=${search}`
            if(category) query += `category=${category}`

            const data = await fetchClient(`/products${query}`)
            setProducts(data)
        } catch(err) {
            setError(err.message)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])
    useEffect(() => {
        fetchProducts()
    }, [category])
    const handleSearch = (e) => {
        e.preventDefault()
        fetchProducts()
    }

    return(
        <div className="page-container">
            <div className="home-controls">
                <form className="search-form" onSubmit={handleSearch}>
                    <input type="text" placeholder="Search Products..." value={search} onChange={(e)=> setSearch(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
                    <option value="">All categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {loading && <p className="state-msg">Loading products</p>}
            {error && <p className="error-msg">{error}</p>}
            {!loading && products.length === 0} && (
                <p className="state-msg">No products found</p>
            )

            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product._id} product={product}/>
                ))}
            </div>

        </div>
    )
}

export default Home