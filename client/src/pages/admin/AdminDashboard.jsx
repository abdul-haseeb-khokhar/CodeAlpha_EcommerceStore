import  {useNavigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin.css'

const AdminDashboard = () => {
    const {user} = useAuth()
    const navigate = useNavigate()

    return (
        <div className='page-container'>
            <div className='admin-header'>
                <h2>Admin Dashboard</h2>
                <p>Welcome back, {user.name}</p>
            </div>

            <div className='admin-cards'>
                <div className='admin-card' onClick={() => navigate('/admin/products')}>
                    <span className='admin-card-icon'>📦</span>
                    <h3>Manage Products</h3>
                    <p>Add, edit or delete products</p>
                </div>

                <div className='admin-card' onClick={() => navigate('/orders')}>
                    <span className='admin-card-icon'>🧾</span>
                    <h3>View Orders</h3>
                    <p>See all customer orders</p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard