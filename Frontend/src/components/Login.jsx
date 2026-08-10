import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { sendOtp, verifyOtp } from '../services/api'

const Login = ({ setUser }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Email, 2: OTP
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const response = await sendOtp(email, name)

    if (response.success) {
      setStep(2)
      // Since emails go to Ethereal sandbox, show the OTP in the UI for easy testing
      let msg = response.message || 'OTP sent to your email.'
      if (response.otp) {
        msg += `\n(Test Mode) Your OTP is: ${response.otp}`
      }
      setMessage(msg)
    } else {
      setError(response.error || 'Failed to send OTP. Do you have an account?')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const cleanOtp = otp.trim()
    const response = await verifyOtp(email, cleanOtp)

    if (response.success) {
      localStorage.setItem('token', response.token);
      setUser({ ...response.data, token: response.token });
      navigate('/');
    } else {
      setError(response.error || 'Invalid OTP.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in with OTP</p>

        {error && <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div style={{ color: '#16a34a', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{message}</div>}

        {step === 1 ? (
          <form className="login-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="6-digit code"
                maxLength="6"
              />
              <small style={{ color: '#64748b', marginTop: '0.5rem', display: 'block' }}>
                Sent to {email}
              </small>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button 
              type="button" 
              onClick={() => { setStep(1); setOtp(''); setMessage(''); setError(''); }} 
              className="login-btn" 
              style={{ marginTop: '0.8rem', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
            >
              Change Email
            </button>
          </form>
        )}

        <div className="toggle-auth">
          Don't have an account? <Link to="/register"><button>Sign Up</button></Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <Link to="/admin/login" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none' }}>
            🔒 Sign in as Administrator
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login

