import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element= {<Home/>}/>
          <Route path='/product/:id' element= {<ProductDetail/>}/>
          <Route path='/login' element= {<Login/>}/>
          <Route path='/register' element= {<Register/>}/>
          {/* Protected Routes */}
          <Route path='/cart' element={
            <ProtectedRoute>
              <Cart/>
            </ProtectedRoute>
          }/>
          <Route path='/checkout' element={
            <ProtectedRoute>
              <Checkout/>
            </ProtectedRoute>
          }/>
          <Route path='/orders' element={
            <ProtectedRoute>
              <Orders/>
            </ProtectedRoute>
          }/>

          {/* Admin Routes */}
          <Route  path='/admin' element ={
            <AdminRoute><AdminDashboard /></AdminRoute>
          }/>
          <Route  path='/admin/products' element ={
            <AdminRoute><AdminProducts /></AdminRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
