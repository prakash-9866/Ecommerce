import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Login from './components/Login'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Profile from './components/Profile'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './components/AdminDashboard'
import AdminProducts from './components/AdminProducts'
import AdminOrders from './components/AdminOrders'
import AdminUsers from './components/AdminUsers'
import AdminLogin from './components/AdminLogin'
import SplashScreen from './components/SplashScreen'
import OrderSuccess from './components/OrderSuccess'
import { products as fallbackProducts, categories } from './data/products.js'
import { fetchProducts, fetchOrders } from './services/api'

const AppContent = () => {
  const [products, setProducts] = useState(fallbackProducts)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [showSplash, setShowSplash] = useState(true)
  
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        // Map _id to id and imageUrl to image to match frontend expectation
        const mappedData = data.map(p => ({
          ...p,
          id: p._id,
          image: p.imageUrl
        }));
        setProducts(mappedData);
      }
    };
    getProducts();
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('profileSettings')
      return savedSettings ? JSON.parse(savedSettings) : { notifications: true, privacy: true, emailAlerts: true }
    } catch {
      return { notifications: true, privacy: true, emailAlerts: true }
    }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const getOrders = async (token) => {
    if (!token) return
    const data = await fetchOrders(token)
    if (data) setOrders(data)
  }

  useEffect(() => {
    if (!user?.token) return;

    const loadOrders = async () => {
      const data = await fetchOrders(user.token);
      if (data) setOrders(data);
    };

    loadOrders();
  }, [user?.token]);

  const addToCart = (product) => {
    if (product.quantity) {
      const items = Array(product.quantity).fill({...product, quantity: 1})
      setCart(prev => [...prev, ...items])
    } else {
      setCart(prev => [...prev, product])
    }
  }

  const addToWishlist = (product) => {
    setWishlist(prev => [...prev, product])
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const handleLogout = () => {
    setUser(null)
    setOrders([])
    localStorage.removeItem('profilePersonal')
    localStorage.removeItem('profileSettings')
  }


  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={`app ${showSplash ? 'hidden' : ''}`}>
        <header className="header">
        <div className="header-content">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="store-name">My Shop</h1>
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link">Products</Link>
          </nav>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="search-input" 
            />
          </div>
          <div className="header-actions">
            {user ? (
              <>
              {user.isAdmin && (
                <Link to="/admin" className="admin-link-header" style={{ marginRight: '1rem', color: '#ffcc00', fontWeight: 'bold', textDecoration: 'none' }}>🛡️ Admin</Link>
              )}
              <Link to="/profile" className="profile-btn">
                <div className="user-avatar-small">{user.name.charAt(0).toUpperCase()}</div>
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn-header" style={{ marginLeft: '1rem', background: 'none', border: '1px solid white', color: 'white', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="login-btn-header">Sign In</Link>
            )}
            <Link to="/cart" className="cart-icon">
              <span className="cart-count">{cart.length}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <div className="home-page">
              <nav className="category-nav">
                <div className="category-buttons">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      className={`category-btn ${selectedCategory === cat ? 'active' : ''}`} 
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </nav>
              <main className="products-section">
                <h2 className="section-title">{selectedCategory === 'All' ? 'All Products' : selectedCategory}</h2>
                <ProductList 
                  products={products} 
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  selectedCategory={selectedCategory}
                  searchTerm={searchTerm}
                  cart={cart}
                  wishlist={wishlist}
                />
              </main>
            </div>
          } />
           <Route path="/product/:id" element={<ProductDetail products={products} onAddToCart={addToCart} onAddToWishlist={addToWishlist} cart={cart} wishlist={wishlist} />} />
          <Route path="/cart" element={<ProtectedRoute user={user}><Cart cart={cart} onRemoveFromCart={removeFromCart} /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute user={user}><Checkout cart={cart} user={user} clearCart={() => setCart([])} getOrders={getOrders} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} setUser={setUser} orders={orders} getOrders={getOrders} settings={settings} setSettings={setSettings} onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register setUser={setUser} />} />
          <Route path="/admin/login" element={user && user.isAdmin ? <Navigate to="/admin" replace /> : <AdminLogin setUser={setUser} />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute user={user}><AdminDashboard user={user} /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute user={user}><AdminProducts user={user} /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute user={user}><AdminOrders user={user} /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute user={user}><AdminUsers user={user} /></AdminRoute>} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2024 My Shop. All rights reserved.</p>
      </footer>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

