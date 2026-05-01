const API_URL = 'http://localhost:5000/api';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const loginUser = async (name, email) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Network error' };
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in as admin:', error);
    return { success: false, error: 'Network error' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    return { success: false, error: 'Network error' };
  }
};

export const sendOtp = async (email, name = '') => {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Network error' };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Network error' };
  }
};
export const placeOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, error: 'Network error' };
  }
};

export const fetchOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/orders/myorders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Admin API calls
export const fetchAdminStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
};

export const fetchAdminOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
};

export const updateAdminOrderStatus = async (id, payload, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Network error' };
  }
};

export const fetchAdminUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
};

export const deleteAdminUser = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Network error' };
  }
};

export const createAdminProduct = async (productData, token) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Network error' };
  }
};

export const updateAdminProduct = async (id, productData, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Network error' };
  }
};

export const deleteAdminProduct = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Network error' };
  }
};

export const updateUserProfile = async (userData, token) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Network error' };
  }
};
