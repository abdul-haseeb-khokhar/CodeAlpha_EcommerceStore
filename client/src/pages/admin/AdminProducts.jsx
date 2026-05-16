import { useState, useEffect } from "react";
import { fetchClient } from "../../api/fetchClient";
import '../../styles/Admin.css'

const EMPTY_FORM = {
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'electronics',
    stock: ''
}

const AdminProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [form , setForm] = useState(EMPTY_FORM)
    const [editingId , setEditingId] = useState(null)
    const [formError, setFormError] = useState('')
    const [formLoading, setFormLoading] = useState(false)

    const fetchProducts = async () => {
        try {
            const data = await fetchClient('/products')
            setProducts(data)
        } catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setFormError('')
        setFormLoading(true)

        try{
            if(editingId){
                await fetchClient(`products/${editingId}`,{
                    method: 'PUT',
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                        stock: Number(form.stock)
                    })
                })
            } else {
                await fetchClient('/products', {
                    method: 'POST', 
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                        stock: Number(form.stock)
                    })
                })
            }

            setForm(EMPTY_FORM)
            setEditingId(null)
            fetchProducts()
        } catch (err) {
            setFormError(err.message)
        } finally {
            setFormLoading (false)
        }
    }

    const handleEdit = (product) => {
        setEditingId(product._id)
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category, 
            stock: product.stock
        })

        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const handleDelete = async(id) => {
        if(!window.confirm('Are you sure you want to delete this product'))  return

        try { 
            await fetchClient(`/products/${id}`, {method: 'DELETE'})
            fetchProducts()
        } catch(err) {
            setError(err.message)
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setFormError('')
    }

    return(
        <div className="page-container">
            <h2 className="page-title">Manage Products</h2>

            <div className="admin-form-card">
                <h3>{editingId? 'Edit Product': 'Add New Product'}</h3>

                {formError && <p className="error-msg">{formError}</p>}
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Nike Air Max" required disabled={formLoading}/>
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={form.category} onChange={handleChange} disabled={formLoading}>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="footwear">Footwear</option>
                                <option value="accessories">Accessories</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input name="description" value={form.description} onChange={handleChange} placeholder="Product description..." required disabled={formLoading}/>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="image" value={form.image}  onChange={handleChange} placeholder="https://example.com/image.jpg" required disabled={formLoading}/>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input name="price" type="number" min='0' step='0.01' value={form.price} onChange={handleChange} placeholder="99.99" required disabled={formLoading}/>
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input name="stock" type="number" min='0' value={form.stock} onChange={handleChange} placeholder="100" required disabled={formLoading}/>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={formLoading}>
                            {formLoading ? 'Saving...':
                            editingId? 'Update product':'Add Product'}
                        </button>

                        {editingId && (
                            <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-table-wrapper">
                <h3>All Products ({products.length})</h3>

                {loading && <p className="state-msg">Loading...</p>}
                {error && <p className="error-msg">{error}</p>}

                {!loading && products.length === 0 && (
                    <p className="state-msg">No products yet - add one above.</p>
                )}

                {products.length > 0 && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <img src={product.image} alt={product.name} className="table-img" />
                                    </td>
                                    <td>{product.name}</td>
                                    <td className="capitalize">{product.category}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>
                                        <span className={`stock-badge ${product.stock === 0 ? 'out' : ''}`}>{product.stock}</span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn btn-outline" onClick={() => handleEdit(product)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default AdminProducts