import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginAdmin } from '../services/api'

const AdminLogin = ({ setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const response = await loginAdmin(email, password);

    if (response.success) {
      localStorage.setItem('token', response.token);
      setUser({ ...response.data, token: response.token });
      navigate('/admin'); // Redirect to admin dashboard
    } else {
      setError(response.error || 'Invalid admin credentials.');
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '3rem' }}>🛡️</span>
          <h2>Admin Access</h2>
          <p className="login-subtitle">Secure Login for Administrators</p>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter admin email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            style={{ background: '#1e293b' }} // Darker color for admin
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="toggle-auth">
          Regular user? <Link to="/login" style={{ color: 'var(--primary-color)' }}>User Login</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
