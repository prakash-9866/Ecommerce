import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminOrders, updateAdminOrderStatus } from '../services/api';

const AdminOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrdersData = async () => {
      const data = await fetchAdminOrders(user.token);
      if (data) setOrders(data);
      setLoading(false);
    };

    fetchOrdersData();
  }, [user?.token]);

  const handleStatusUpdate = async (id, newStatus) => {
    const response = await updateAdminOrderStatus(id, { status: newStatus }, user.token);
    if (response.success) {
      const data = await fetchAdminOrders(user.token);
      if (data) setOrders(data);
    } else {
      alert(response.error);
    }
  };

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  const statusOptions = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin">📊 Dashboard</Link>
          <Link to="/admin/products">📦 Products</Link>
          <Link to="/admin/orders" className="active">🧾 Orders</Link>
          <Link to="/admin/users">👥 Users</Link>
        </nav>
      </div>

      <div className="admin-main">
        <h2>Manage Orders</h2>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Info</th>
                <th>Date</th>
                <th>Total</th>
                <th>Current Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>{order.shippingAddress?.address || 'N/A'}</strong>
                      <br />
                      <span style={{ color: '#666' }}>{order.user?.email || order.email || 'User'}</span>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-pill status-${(order.status || 'Processing').toLowerCase().replace(/ /g, '-')}`}>
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="admin-status-select"
                      value={order.status || 'Processing'}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
