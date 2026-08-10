import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { updateUserProfile } from '../services/api'

const Profile = ({ user, setUser, orders, getOrders, settings, setSettings, onLogout }) => {
  const savedPersonal = (() => {
    try {
      return JSON.parse(localStorage.getItem('profilePersonal') || 'null')
    } catch {
      return null
    }
  })()

  const [activeTab, setActiveTab] = useState('personal')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    name: savedPersonal?.name || user?.name || '',
    email: savedPersonal?.email || user?.email || '',
    phone: savedPersonal?.phone || '',
    street: savedPersonal?.street || user?.address?.street || '',
    city: savedPersonal?.city || user?.address?.city || '',
    state: savedPersonal?.state || user?.address?.state || '',
    zip: savedPersonal?.zip || user?.address?.zip || ''
  })
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  const handleSettingsChange = (e) => {
    const newSettings = { ...settings, [e.target.name]: e.target.checked }
    setSettings(newSettings)
    localStorage.setItem('profileSettings', JSON.stringify(newSettings))
  }

  const handlePersonalSave = async () => {
    setError('')
    const response = await updateUserProfile({
      name: personalInfo.name,
      email: personalInfo.email,
    }, user.token)

    if (response.success) {
      localStorage.setItem('profilePersonal', JSON.stringify(personalInfo))
      setUser({ ...user, ...response.data })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      setError(response.error || 'Failed to update profile.')
    }
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (!passwords.current) { setPwError('Enter your current password.'); return }
    if (passwords.newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return }
    if (passwords.newPw !== passwords.confirm) { setPwError('Passwords do not match.'); return }
    setPwError('')
    setPasswords({ current: '', newPw: '', confirm: '' })
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  useEffect(() => {
    if (user?.token && getOrders) {
      getOrders(user.token)
    }
  }, [user?.token, getOrders])

  useEffect(() => {
    if (activeTab === 'orders' && user?.token && getOrders) {
      getOrders(user.token)
    }
  }, [activeTab, user?.token, getOrders])

  if (!user) {
    return (
      <div className="profile-page">
        <div style={{textAlign: 'center', padding: '4rem'}}>
          <h2>Please log in to view profile</h2>
          <Link to="/login" style={{color: 'var(--primary-color)'}}>Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {personalInfo.name.charAt(0).toUpperCase()}
          </div>
          <h1>{personalInfo.name}</h1>
          <p>{personalInfo.email}</p>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
            👤 Personal Info
          </button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            ⚙️ Account Settings
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📦 My Orders ({orders?.length || 0})
          </button>
        </div>

        {/* ── Personal Info Tab ── */}
        {activeTab === 'personal' && (
          <div className="personal-info-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3>Personal Information</h3>
              <button
                className="save-settings-btn"
                onClick={editing ? handlePersonalSave : () => setEditing(true)}
                style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}
              >
                {editing ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>
            {saved && <div className="profile-success-msg">✓ Profile saved successfully!</div>}
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Full Name</label>
                <input value={personalInfo.name} onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="e.g. +91 98765 43210" value={personalInfo.phone} onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input value={personalInfo.street} onChange={(e) => setPersonalInfo({...personalInfo, street: e.target.value})} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={personalInfo.city} onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})} disabled={!editing} />
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>State</label>
                  <input value={personalInfo.state} onChange={(e) => setPersonalInfo({...personalInfo, state: e.target.value})} disabled={!editing} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>ZIP Code</label>
                  <input value={personalInfo.zip} onChange={(e) => setPersonalInfo({...personalInfo, zip: e.target.value})} disabled={!editing} />
                </div>
              </div>
            </form>
            {error && <div className="profile-error-msg" style={{ marginTop: '1rem' }}>⚠ {error}</div>}
          </div>
        )}

        {/* ── Account Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className="account-settings-section">

            {/* Change Password */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-card-icon">🔒</span>
                <div>
                  <h4>Change Password</h4>
                  <p>Update your account password</p>
                </div>
              </div>
              {pwSaved && <div className="profile-success-msg">✓ Password changed successfully!</div>}
              {pwError && <div className="profile-error-msg">⚠ {pwError}</div>}
              <form className="settings-inner-form" onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Minimum 6 characters" value={passwords.newPw} onChange={(e) => setPasswords({...passwords, newPw: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Re-enter new password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
                </div>
                <button type="submit" className="save-settings-btn">Update Password</button>
              </form>
            </div>

            {/* Notifications */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-card-icon">🔔</span>
                <div>
                  <h4>Notifications</h4>
                  <p>Manage what alerts you receive</p>
                </div>
              </div>
              <div className="settings-toggle-list">
                <label className="settings-toggle-row">
                  <div>
                    <span className="toggle-label">Push Notifications</span>
                    <span className="toggle-desc">Order updates and offers</span>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" name="notifications" checked={settings?.notifications || false} onChange={handleSettingsChange} id="notif-toggle" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
                <label className="settings-toggle-row">
                  <div>
                    <span className="toggle-label">Email Alerts</span>
                    <span className="toggle-desc">Promotions and newsletters</span>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" name="emailAlerts" checked={settings?.emailAlerts || false} onChange={handleSettingsChange} id="email-toggle" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-card-icon">🛡️</span>
                <div>
                  <h4>Privacy</h4>
                  <p>Control your data and privacy</p>
                </div>
              </div>
              <div className="settings-toggle-list">
                <label className="settings-toggle-row">
                  <div>
                    <span className="toggle-label">Private Profile</span>
                    <span className="toggle-desc">Hide your activity from others</span>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" name="privacy" checked={settings?.privacy || false} onChange={handleSettingsChange} id="privacy-toggle" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-card settings-card-danger">
              <div className="settings-card-header">
                <span className="settings-card-icon">⚠️</span>
                <div>
                  <h4>Danger Zone</h4>
                  <p>Irreversible account actions</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button className="danger-btn-outline" onClick={onLogout}>Sign Out</button>
                <button className="danger-btn-solid" onClick={() => alert('Account deletion is disabled in demo.')}>Delete Account</button>
              </div>
            </div>

          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && orders && (() => {
          return (
            <div className="my-orders-section">
              <h3>My Orders</h3>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <h4>No current orders</h4>
                  <p>You have no orders right now.</p>
                  <Link to="/" className="continue-btn" style={{marginTop: '1rem', display: 'inline-block', color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none'}}>
                    Browse Products →
                  </Link>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card-detailed">
                      <div className="order-header-main">
                        <div>
                          <span className="order-id">ORD #{order._id.slice(-8).toUpperCase()}</span>
                          <p className="order-date">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className={`status-pill status-${order.status?.toLowerCase().replace(/ /g, '-') || 'processing'}`}>
                          {order.status || 'Processing'}
                        </div>
                      </div>

                      <div className="tracking-timeline">
                        <div className={`timeline-dot ${['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) || !order.status ? 'completed' : ''}`}></div>
                        <div className={`timeline-line ${['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                        <div className={`timeline-dot ${['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                        <div className={`timeline-line ${['Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                        <div className={`timeline-dot ${['Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                        <div className={`timeline-line ${['Delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                        <div className={`timeline-dot ${['Delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                      </div>
                      <div className="timeline-labels">
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Out for Delivery</span>
                        <span>Delivered</span>
                      </div>

                      <div className="order-details-grid">
                        <div className="detail-col">
                          <h5>📦 Items</h5>
                          <ul>
                            {order.orderItems.map((item, idx) => (
                              <li key={idx}>{item.name} <span className="item-qty">x{item.quantity}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div className="detail-col">
                          <h5>📍 Shipping To</h5>
                          <p>{order.shippingAddress?.address || 'N/A'}</p>
                          <p>{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
                        </div>
                        <div className="detail-col">
                          <h5>💰 Payment</h5>
                          <p>{order.paymentMethod || 'COD'}</p>
                          <p className="order-total-price">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        <button className="logout-btn" onClick={onLogout} style={{marginTop: '2rem'}}>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Profile
