import { Link, useLocation } from 'react-router-dom'

const OrderSuccess = () => {
  const location = useLocation()
  const orderId = location.state?.orderId || 'ORD' + Math.floor(Math.random() * 1000000)

  return (
    <div className="success-container">
      <span className="success-icon">🎉</span>
      <h1 className="success-title">Order Placed!</h1>
      <p>Your order has been successfully placed and is being processed.</p>
      <div style={{ marginTop: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Order ID: </span>
        <span className="order-id-badge">{orderId}</span>
      </div>
      
      <div className="success-actions">
        <Link to="/profile" className="track-order-btn">Track Order Status</Link>
        <Link to="/" className="continue-shopping-link">← Continue Shopping</Link>
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          We've sent a confirmation email with all the details of your order.
        </p>
      </div>
    </div>
  )
}

export default OrderSuccess
