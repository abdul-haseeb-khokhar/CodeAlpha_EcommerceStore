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
        } catch {

        }
    }
}