import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminUsers, deleteAdminUser } from '../services/api';

const AdminUsers = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    const data = await fetchAdminUsers(user.token);
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [user.token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const response = await deleteAdminUser(id, user.token);
      if (response.success) {
        getUsers();
      } else {
        alert(response.error);
      }
    }
  };

  if (loading) return <div className="admin-loading">Loading users...</div>;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin">📊 Dashboard</Link>
          <Link to="/admin/products">📦 Products</Link>
          <Link to="/admin/orders">🧾 Orders</Link>
          <Link to="/admin/users" className="active">👥 Users</Link>
        </nav>
      </div>

      <div className="admin-main">
        <h2>Manage Users</h2>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id.slice(-6).toUpperCase()}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`user-role ${u.isAdmin ? 'role-admin' : 'role-user'}`}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    {!u.isAdmin && (
                      <button 
                        className="delete-action" 
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    )}
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

export default AdminUsers;
