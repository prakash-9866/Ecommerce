import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../services/api';

const AdminProducts = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    countInStock: 0
  });

  const getProducts = async () => {
    const data = await fetchProducts();
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      countInStock: product.countInStock || 0
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const response = await deleteAdminProduct(id, user.token);
      if (response.success) {
        getProducts();
      } else {
        alert(response.error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let response;
    if (editingProduct) {
      response = await updateAdminProduct(editingProduct._id, formData, user.token);
    } else {
      response = await createAdminProduct(formData, user.token);
    }

    if (response.success) {
      setIsAdding(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', description: '', category: '', imageUrl: '', countInStock: 0 });
      getProducts();
    } else {
      alert(response.error);
    }
  };

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin">📊 Dashboard</Link>
          <Link to="/admin/products" className="active">📦 Products</Link>
          <Link to="/admin/orders">🧾 Orders</Link>
          <Link to="/admin/users">👥 Users</Link>
        </nav>
      </div>

      <div className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Manage Products</h2>
          <button className="admin-add-btn" onClick={() => { setIsAdding(true); setEditingProduct(null); }}>+ Add Product</button>
        </div>

        {isAdding && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSave} className="admin-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="text" required value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" required value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="save-btn">Save Product</button>
                  <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td><img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price.toLocaleString('en-IN')}</td>
                  <td>{product.countInStock || 0}</td>
                  <td>
                    <button className="edit-action" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete-action" onClick={() => handleDelete(product._id)}>Delete</button>
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

export default AdminProducts;
