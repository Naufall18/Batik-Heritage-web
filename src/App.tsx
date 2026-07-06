import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Vendors from './pages/Vendors'
import VendorDetail from './pages/VendorDetail'
import Nearby from './pages/Nearby'
import Login from './pages/Login'
import Register from './pages/Register'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import { VendorLayout } from './pages/vendor/Dashboard'
import DashboardHome from './pages/vendor/Dashboard'
import VendorProducts from './pages/vendor/VendorProducts'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorProfile from './pages/vendor/VendorProfile'

function App() {
  return (
    <Routes>
      {/* Auth — full-screen standalone (tanpa navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/daftar" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/katalog" element={<Catalog />} />
        <Route path="/produk/:slug" element={<ProductDetail />} />
        <Route path="/umkm" element={<Vendors />} />
        <Route path="/umkm/:slug" element={<VendorDetail />} />
        <Route path="/sekitar" element={<Nearby />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pesanan" element={<Orders />} />
        <Route path="/pesanan/:id" element={<OrderDetail />} />
      </Route>

      <Route element={<VendorLayout />}>
        <Route path="/vendor" element={<DashboardHome />} />
        <Route path="/vendor/produk" element={<VendorProducts />} />
        <Route path="/vendor/pesanan" element={<VendorOrders />} />
        <Route path="/vendor/profil" element={<VendorProfile />} />
      </Route>
    </Routes>
  )
}

export default App
