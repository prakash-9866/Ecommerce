import { Link } from 'react-router-dom'
import { useState } from 'react'

const Cart = ({ cart, onRemoveFromCart }) => {
  // Store quantity per unique product id
  const [quantities, setQuantities] = useState({})

  const getQty = (id) => quantities[id] || 1

  const handleIncrement = (itemId) => {
    setQuantities(prev => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }))
  }

  const handleDecrement = (itemId) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(1, (prev[itemId] || 1) - 1) }))
  }

  const handleRemove = (itemId) => {
    onRemoveFromCart(itemId)
    setQuantities(prev => { const n = {...prev}; delete n[itemId]; return n })
  }

  // Total = sum of (unitPrice × qty) for each item
  const cartTotal = cart.reduce((total, item) => total + item.price * getQty(item.id), 0)

  // Format number to Indian Rupees
  const formatINR = (amount) =>
    '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="page-title">Your Cart is Empty</h1>
        <div className="empty-cart">
          <p>No products in your cart yet.</p>
          <Link to="/" className="continue-btn">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">🛒 Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items-list">
          {cart.map((item) => {
            const qty = getQty(item.id)
            const itemTotal = item.price * qty
            return (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-cat">{item.category}</p>
                  <div className="cart-item-price">
                    {formatINR(item.price)} × {qty} = <strong>{formatINR(itemTotal)}</strong>
                  </div>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => handleDecrement(item.id)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Continue Shopping</span>
            <Link to="/" className="continue-shopping-btn">← Back to Shop</Link>
          </div>
          <div className="summary-row">
            <span>Items:</span>
            <span>{cart.reduce((s, item) => s + getQty(item.id), 0)}</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span style={{ color: '#f97316', fontSize: '1.25rem' }}>{formatINR(cartTotal)}</span>
          </div>
          <Link
            to="/checkout"
            state={{ quantities }}
            className="checkout-btn"
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem', padding: '1rem', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: '600' }}
          >
            Proceed to Checkout →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
