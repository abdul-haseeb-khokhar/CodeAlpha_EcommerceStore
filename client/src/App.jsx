import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
