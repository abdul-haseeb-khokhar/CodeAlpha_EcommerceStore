import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import {fetchClient } from '../api/fetchClient'

import '../styles/Auth.css'

const login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const {login} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')
        setLoading('')

        try{
            const data = await fetchClient('/auth/login', {
                method: 'Post', body: JSON.stringify({email, password})
            })
            console.log(data)
            login(data)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Login to your account</p>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="........" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%'}} disabled={loading}>
                        {loading? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
    )
}

export default login