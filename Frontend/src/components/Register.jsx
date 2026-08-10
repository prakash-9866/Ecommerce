import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'

const Register = ({ setUser }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const response = await registerUser({ name, email });
    
    if (response.success) {
      localStorage.setItem('token', response.token);
      setUser({ ...response.data, token: response.token });
      navigate('/');
    } else {
      setError(response.error || 'Failed to register.');
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Create Account</h2>
        <p className="login-subtitle">Join us today</p>
        
        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</div>}
        
        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="Enter your email"
            />
          </div>
          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="toggle-auth">
          Already have an account? <Link to="/login"><button>Sign In</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Register

