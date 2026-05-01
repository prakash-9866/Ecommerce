import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { placeOrder } from '../services/api'
import './Checkout.css'

const Checkout = ({ cart, user, clearCart, getOrders }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState('')

  // Auto-fill from saved profile (set in Profile page) or fall back to user object
  const savedProfile = (() => {
    try { return JSON.parse(localStorage.getItem('profilePersonal') || '{}') } catch { return {} }
  })()

  const [shippingAddress, setShippingAddress] = useState({
    name:       savedProfile.name       || user?.name  || '',
    phone:      savedProfile.phone      || '',
    address:    savedProfile.street     || '',
    city:       savedProfile.city       || '',
    postalCode: savedProfile.zip        || '',
  })

  const [selectedUpi, setSelectedUpi] = useState('')
  
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [step, setStep] = useState(2) // 1: Cart, 2: Address, 3: Payment, 4: Success
  const [isEditingAddress, setIsEditingAddress] = useState(
    !savedProfile.street  // open edit form if no address is saved yet
  )

  // Quantities passed from Cart via Link state
  const quantities = location.state?.quantities || {}
  const getQty = (id) => quantities[id] || 1

  const formatINR = (amount) =>
    '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in to place an order.')
      navigate('/login')
      return
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      alert('Please fill all shipping details.')
      setIsEditingAddress(true)
      return
    }

    setLoading(true)
    const orderItems = cart.map(item => ({
      name: item.name,
      quantity: getQty(item.id),
      product: item.id,
      image: item.image
    }))

    const cartTotal = cart.reduce((total, item) => total + item.price * getQty(item.id), 0)
    const discount = 249
    const deliveryTax = 90
    const finalTotal = cartTotal - discount + deliveryTax

    const result = await placeOrder({ 
      orderItems, 
      totalPrice: finalTotal,
      shippingAddress,
      paymentMethod
    }, user.token)

    if (result.success) {
      clearCart()
      getOrders(user.token)
      navigate('/order-success', { state: { orderId: result.data._id } })
    } else {
      alert('❌ Error placing order: ' + (result.error || 'Unknown error'))
    }
    setLoading(false)
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
           <h1 className="page-title">Cart is Empty</h1>
           <Link to="/" className="back-link">← Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const subtotal = cart.reduce((total, item) => total + item.price * getQty(item.id), 0)
  const discount = 249
  const deliveryTax = 90
  const totalPayable = subtotal - discount + deliveryTax

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        
        <div className="stepper-container">
          <div className="step completed">
            <span className="step-icon">✓</span>
             Cart
          </div>
          <div className="step-line active"></div>
          <div className="step active">
            <span className="step-icon">2</span>
             Address
          </div>
          <div className="step-line"></div>
          <div className="step">
            <span className="step-icon">3</span>
             Payment
          </div>
          <div className="step-line"></div>
          <div className="step">
            <span className="step-icon">4</span>
             Success
          </div>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-main-content">
          <section className="checkout-section-card">
            <h3>Shipping Address</h3>
            
            {isEditingAddress ? (
              <div className="address-form-edit">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Address</label>
                    <input 
                      name="address" 
                      value={shippingAddress.address} 
                      onChange={handleInputChange} 
                      placeholder="House No, Street, Area"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      name="city" 
                      value={shippingAddress.city} 
                      onChange={handleInputChange} 
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input 
                      name="postalCode" 
                      value={shippingAddress.postalCode} 
                      onChange={handleInputChange} 
                      placeholder="400001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      name="phone" 
                      value={shippingAddress.phone} 
                      onChange={handleInputChange} 
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <button className="apply-btn" onClick={() => setIsEditingAddress(false)} style={{marginTop: '1rem', width: '100%'}}>
                  Save Address
                </button>
              </div>
            ) : (
              <div className="address-selected-block">
                <div className="address-header">
                  <span>📍 Home Address</span>
                  <button className="edit-btn" onClick={() => setIsEditingAddress(true)}>Edit</button>
                </div>
                
                <div className="user-info-row">
                  <div className="user-avatar">
                     <img src={`https://ui-avatars.com/api/?name=${shippingAddress.name}&background=random`} alt="User" />
                  </div>
                  <div className="user-details">
                    <h4>{shippingAddress.name}</h4>
                    <p>{shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="address-text">
                  <p>📍 {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.postalCode}</p>
                </div>

                <div className="delivery-estimate">
                  <span className="truck-icon">🚚</span>
                  <span>Delivery by Apr 15 - Apr 18 • Free Delivery</span>
                </div>
              </div>
            )}
          </section>

          <section className="checkout-section-card">
            <h3>Payment Method</h3>
            <div className="payment-methods-list">

              {/* ── Cash on Delivery ── */}
              <div
                className={`payment-method-item ${paymentMethod === 'COD' ? 'selected' : ''}`}
                onClick={() => { setPaymentMethod('COD'); setSelectedUpi('') }}
              >
                <input type="radio" checked={paymentMethod === 'COD'} readOnly />
                <div className="payment-method-content">
                  <span className="payment-icon">💵</span>
                  <span>Cash on Delivery</span>
                </div>
              </div>

              {/* ── UPI ── */}
              <div
                className={`payment-method-item ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
              >
                <input type="radio" checked={paymentMethod === 'UPI'} readOnly />
                <div className="payment-method-content" style={{flex:1}}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <span className="payment-icon">📲</span>
                    <span>UPI</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" style={{height:'18px', marginLeft:'0.25rem'}} />
                  </div>

                  {/* UPI sub-options */}
                  {paymentMethod === 'UPI' && (
                    <div className="upi-options">
                      {[
                        { id: 'GPay',    label: 'Google Pay',  color: '#1a73e8', bg: '#e8f0fe',
                          logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
                        { id: 'PhonePe', label: 'PhonePe',     color: '#5f259f', bg: '#f3eaff',
                          logo: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.png' },
                        { id: 'Paytm',   label: 'Paytm',       color: '#00b9f1', bg: '#e0f7fe',
                          logo: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png' },
                      ].map(upi => (
                        <div
                          key={upi.id}
                          className={`upi-option-item ${selectedUpi === upi.id ? 'upi-selected' : ''}`}
                          style={{ '--upi-color': upi.color, '--upi-bg': upi.bg }}
                          onClick={(e) => { e.stopPropagation(); setSelectedUpi(upi.id) }}
                        >
                          <img src={upi.logo} alt={upi.label} className="upi-logo" />
                          <span>{upi.label}</span>
                          {selectedUpi === upi.id && <span className="upi-check">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card / Razorpay ── */}
              <div
                className={`payment-method-item ${paymentMethod === 'Razorpay' ? 'selected' : ''}`}
                onClick={() => { setPaymentMethod('Razorpay'); setSelectedUpi('') }}
              >
                <input type="radio" checked={paymentMethod === 'Razorpay'} readOnly />
                <div className="payment-method-content">
                  <span className="payment-icon">💳</span>
                  <span>Credit / Debit Card</span>
                  <div className="payment-logos">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>

        <aside className="checkout-sidebar">
          <div className="order-summary-card checkout-section-card">
            <h3>Order Summary</h3>
            
            <div className="coupon-section">
              <input 
                type="text" 
                placeholder="Apply Coupon" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="apply-btn">Apply</button>
            </div>

            <div className="order-items-list">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-img">
                    <img src={item.image || "https://via.placeholder.com/50"} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-meta">x{getQty(item.id)}</span>
                  </div>
                  <div className="item-price">
                    {formatINR(item.price * getQty(item.id))}
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="price-row discount">
                <span>Discount</span>
                <span>-{formatINR(discount)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Tax</span>
                <span>{formatINR(deliveryTax)}</span>
              </div>
            </div>

            <div className="price-total">
               <span>Total</span>
               <span>{formatINR(totalPayable)}</span>
            </div>

            <div className="savings-badge">
               <span>✅</span>
               <span>You saved {formatINR(discount)} on this order.</span>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : 'Place Order'}
            </button>

            <div className="secure-tag">
               <span>🔒</span> 100% Secure Payment
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
