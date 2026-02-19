// =====================================================
// ClassMora Frontend — API Utility
// Base URL points to the Express backend on port 5000
// =====================================================

const API_BASE = 'http://localhost:5000/api';

// ── Helpers ──────────────────────────────────────────

async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;

  // Build headers — always JSON + attach stored JWT token if available
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const storedToken = localStorage.getItem('cm_token');
  if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

  const config = {
    credentials: 'include',   // send/receive httpOnly cookies too
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || (data.errors && data.errors[0]?.msg) || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    // Re-throw network errors with a clear message
    if (err instanceof TypeError) throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    throw err;
  }
}

// ── Auth ─────────────────────────────────────────────

const Auth = {
  /**
   * Register a new user
   * @param {Object} payload - { name, email, password, role? }
   */
  register(payload) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Login an existing user
   * @param {Object} payload - { email, password }
   */
  login(payload) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get currently logged-in user info
   */
  getMe() {
    return apiRequest('/auth/me');
  },

  /**
   * Logout
   */
  logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
  },
};

// ── Products ─────────────────────────────────────────

const Products = {
  /** Get all products (with optional query string filters) */
  getAll(query = '') {
    return apiRequest(`/products${query ? '?' + query : ''}`);
  },

  /** Get a single product by ID */
  getById(id) {
    return apiRequest(`/products/${id}`);
  },
};

// ── Categories ───────────────────────────────────────

const Categories = {
  getAll() {
    return apiRequest('/categories');
  },
};

// ── Orders ───────────────────────────────────────────

const Orders = {
  create(payload) {
    return apiRequest('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  getMyOrders() {
    return apiRequest('/orders/myorders');
  },
};

// ── Token / Session Helpers ──────────────────────────

const Session = {
  /** Save user info to localStorage */
  save(user, token) {
    localStorage.setItem('cm_user', JSON.stringify(user));
    if (token) localStorage.setItem('cm_token', token);
  },
  /** Get saved user info */
  get() {
    try { return JSON.parse(localStorage.getItem('cm_user')); } catch { return null; }
  },
  /** Get saved token */
  token() {
    return localStorage.getItem('cm_token') || null;
  },
  /** Clear session */
  clear() {
    localStorage.removeItem('cm_user');
    localStorage.removeItem('cm_token');
  },
  /** Is the user logged in? */
  isLoggedIn() {
    return !!Session.get();
  },
};

// Export for use in inline scripts
window.API = { Auth, Products, Categories, Orders, Session, apiRequest };
