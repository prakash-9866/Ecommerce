import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminStats } from '../services/api';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchStats = async () => {
      const data = await fetchAdminStats(user.token);
      if (data) setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, [user?.token]);

  if (loading) return <div className="admin-loading">Loading stats...</div>;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin" className="active">📊 Dashboard</Link>
          <Link to="/admin/products">📦 Products</Link>
          <Link to="/admin/orders">🧾 Orders</Link>
          <Link to="/admin/users">👥 Users</Link>
        </nav>
      </div>
      
      <div className="admin-main">
        <h2>Dashboard Overview</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <span className="stat-label">Total Sales</span>
              <span className="stat-value">₹{stats?.totalSales.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div className="stat-info">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{stats?.totalOrders || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🛍️</span>
            <div className="stat-info">
              <span className="stat-label">Products</span>
              <span className="stat-value">{stats?.totalProducts || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-info">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{stats?.totalUsers || 0}</span>
            </div>
          </div>
        </div>

        <div className="admin-welcome">
          <h3>Welcome back, Admin {user.name}!</h3>
          <p>Use the sidebar to manage your store's products, orders, and users.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
