import { useState, useEffect } from "react"
import {
  FiGrid, FiPackage, FiFolder, FiShoppingBag,
  FiUsers, FiPlus, FiTrash2, FiDollarSign,
  FiAlertCircle, FiRefreshCw
} from "react-icons/fi"
import api from "../api/axios"
import { useToast } from "../context/ToastContext"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./AdminPage.css"

export default function AdminPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)

  // Data states
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, statusCounts: {} })
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])

  // Modals state
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    regular_price: "",
    sale_price: "",
    on_sale: false,
    stock_quantity: 100,
    in_stock: true,
    description: "",
    image: "/images/products/apple.png"
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    image: "/images/categories/vegetables.png"
  })

  // Load Overview Data
  const loadStats = async () => {
    try {
      const res = await api.get("/orders/admin/stats")
      setStats(res.data)
    } catch (err) {
      console.error("Failed to load stats:", err)
    }
  }

  // Load Products
  const loadProducts = async () => {
    try {
      const res = await api.get("/products?limit=100")
      const list = res.data?.products || (Array.isArray(res.data) ? res.data : [])
      setProducts(list)
    } catch (err) {
      console.error("Failed to load products:", err)
    }
  }

  // Load Categories
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories")
      const list = Array.isArray(res.data) ? res.data : (res.data?.categories || [])
      setCategories(list)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }

  // Load Orders
  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/all")
      const list = res.data?.orders || (Array.isArray(res.data) ? res.data : [])
      setOrders(list)
    } catch (err) {
      console.error("Failed to load orders:", err)
    }
  }

  // Load Users
  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      const list = res.data?.users || (Array.isArray(res.data) ? res.data : [])
      setUsers(list)
    } catch (err) {
      console.error("Failed to load users:", err)
    }
  }

  const reloadAll = async () => {
    setLoading(true)
    await Promise.all([loadStats(), loadProducts(), loadCategories(), loadOrders(), loadUsers()])
    setLoading(false)
  }

  useEffect(() => {
    reloadAll()
  }, [])

  // Order status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus })
      showToast(`Order status updated to ${newStatus}`, "success")
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      loadStats()
    } catch (err) {
      console.error("Status update error:", err)
      showToast("Failed to update order status", "error")
    }
  }

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      showToast("Product deleted successfully", "success")
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error("Delete product error:", err)
      showToast("Failed to delete product", "error")
    }
  }

  // Delete category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return
    try {
      await api.delete(`/categories/${id}`)
      showToast("Category deleted successfully", "success")
      setCategories(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      console.error("Delete category error:", err)
      showToast("Failed to delete category", "error")
    }
  }

  // Add Product
  const handleAddProductSubmit = async (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.category_id || !newProduct.regular_price) {
      showToast("Please fill in required product fields.", "error")
      return
    }

    try {
      const payload = {
        ...newProduct,
        regular_price: Number(newProduct.regular_price),
        sale_price: newProduct.sale_price ? Number(newProduct.sale_price) : undefined,
        stock_quantity: Number(newProduct.stock_quantity) || 100
      }
      const res = await api.post("/products", payload)
      showToast("Product created successfully!", "success")
      setProducts(prev => [res.data, ...prev])
      setShowAddProduct(false)
      setNewProduct({
        name: "",
        category_id: "",
        regular_price: "",
        sale_price: "",
        on_sale: false,
        stock_quantity: 100,
        in_stock: true,
        description: "",
        image: "/images/products/apple.png"
      })
    } catch (err) {
      console.error("Add product error:", err)
      showToast(err.response?.data?.message || "Failed to create product", "error")
    }
  }

  // Add Category
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault()
    if (!newCategory.name) {
      showToast("Category name is required", "error")
      return
    }

    try {
      const res = await api.post("/categories", newCategory)
      showToast("Category created successfully!", "success")
      setCategories(prev => [res.data, ...prev])
      setShowAddCategory(false)
      setNewCategory({ name: "", image: "/images/categories/vegetables.png" })
    } catch (err) {
      console.error("Add category error:", err)
      showToast(err.response?.data?.message || "Failed to create category", "error")
    }
  }

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Management Portal</h1>
            <p className="admin-subtitle">Monitor shop operations, catalog, orders, and users</p>
          </div>
          <button type="button" className="admin-btn-refresh" onClick={reloadAll} disabled={loading}>
            <FiRefreshCw className={loading ? "spin" : ""} size={15} /> Refresh Data
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FiGrid size={16} /> Overview
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FiPackage size={16} /> Products ({products.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <FiFolder size={16} /> Categories ({categories.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FiShoppingBag size={16} /> Orders ({orders.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers size={16} /> Users ({users.length})
          </button>
        </div>

        {/* ── 1. OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="admin-tab-content">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon-box sales">
                  <FiDollarSign size={24} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Total Revenue</span>
                  <strong className="stat-value">${Number(stats.totalSales || 0).toFixed(2)}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-box orders">
                  <FiShoppingBag size={24} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Total Orders</span>
                  <strong className="stat-value">{stats.totalOrders || 0}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-box products">
                  <FiPackage size={24} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Active Products</span>
                  <strong className="stat-value">{products.length}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-box users">
                  <FiUsers size={24} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Registered Users</span>
                  <strong className="stat-value">{users.length}</strong>
                </div>
              </div>
            </div>

            {/* Quick Status Breakdown */}
            <div className="admin-breakdown-card">
              <h3>Order Status Breakdown</h3>
              <div className="status-chips-list">
                <div className="status-chip processing">
                  <span>Processing:</span>
                  <strong>{stats.statusCounts?.Processing || 0}</strong>
                </div>
                <div className="status-chip shipped">
                  <span>Shipped:</span>
                  <strong>{stats.statusCounts?.Shipped || 0}</strong>
                </div>
                <div className="status-chip delivered">
                  <span>Delivered:</span>
                  <strong>{stats.statusCounts?.Delivered || 0}</strong>
                </div>
                <div className="status-chip cancelled">
                  <span>Cancelled:</span>
                  <strong>{stats.statusCounts?.Cancelled || 0}</strong>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="admin-table-card" style={{ marginTop: "24px" }}>
              <div className="card-top-bar">
                <h3>Recent Orders</h3>
                <button className="text-link" onClick={() => setActiveTab("orders")}>
                  Manage All Orders →
                </button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o._id}>
                      <td className="ord-id">#{o._id.slice(-8).toUpperCase()}</td>
                      <td>
                        <strong>{o.shippingAddress?.fullName || o.user?.name || "Customer"}</strong>
                        <span className="sub-txt">{o.shippingAddress?.email || o.user?.email}</span>
                      </td>
                      <td><strong>${Number(o.totalPrice || 0).toFixed(2)}</strong></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill status-${(o.orderStatus || "Processing").toLowerCase()}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={o.orderStatus || "Processing"}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 2. PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div className="admin-tab-content">
            <div className="card-top-bar" style={{ marginBottom: "16px" }}>
              <h2>Catalog Products ({products.length})</h2>
              <button className="admin-btn-primary" onClick={() => setShowAddProduct(true)}>
                <FiPlus size={16} /> Add New Product
              </button>
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={getImageUrl(p.image || p.thumbnail, DEFAULT_PRODUCT_IMAGE)}
                          alt={p.name}
                          className="admin-table-thumb"
                          onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
                        />
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        {p.on_sale && <span className="admin-badge-sale">Sale</span>}
                      </td>
                      <td>{p.categoryId?.name || p.category_id}</td>
                      <td>
                        <strong>${p.sale_price || p.regular_price}</strong>
                        {p.on_sale && p.regular_price && (
                          <span className="old-price">${p.regular_price}</span>
                        )}
                      </td>
                      <td>
                        <span className={p.in_stock ? "stock-in" : "stock-out"}>
                          {p.in_stock ? `${p.stock_quantity || 100} in stock` : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-action-delete"
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          title="Delete Product"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 3. CATEGORIES TAB ── */}
        {activeTab === "categories" && (
          <div className="admin-tab-content">
            <div className="card-top-bar" style={{ marginBottom: "16px" }}>
              <h2>Categories ({categories.length})</h2>
              <button className="admin-btn-primary" onClick={() => setShowAddCategory(true)}>
                <FiPlus size={16} /> Add Category
              </button>
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c._id || c.id}>
                      <td>
                        <img
                          src={getImageUrl(c.image, "/images/categories/vegetables.png")}
                          alt={c.name}
                          className="admin-table-thumb"
                          onError={handleImageError("/images/categories/vegetables.png")}
                        />
                      </td>
                      <td><strong>{c.name}</strong></td>
                      <td><code>{c.slug || c.name.toLowerCase()}</code></td>
                      <td>
                        <button
                          type="button"
                          className="btn-action-delete"
                          onClick={() => handleDeleteCategory(c._id, c.name)}
                          title="Delete Category"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 4. ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div className="admin-tab-content">
            <div className="card-top-bar" style={{ marginBottom: "16px" }}>
              <h2>All Customer Orders ({orders.length})</h2>
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Current Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td className="ord-id">#{o._id.slice(-8).toUpperCase()}</td>
                      <td>
                        <strong>{o.shippingAddress?.fullName || o.user?.name || "Customer"}</strong>
                        <span className="sub-txt">{o.shippingAddress?.email || o.user?.email}</span>
                        <span className="sub-txt">{o.shippingAddress?.phone}</span>
                      </td>
                      <td>{o.orderItems?.length || 0} items</td>
                      <td><strong>${Number(o.totalPrice || 0).toFixed(2)}</strong></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill status-${(o.orderStatus || "Processing").toLowerCase()}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={o.orderStatus || "Processing"}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 5. USERS TAB ── */}
        {activeTab === "users" && (
          <div className="admin-tab-content">
            <div className="card-top-bar" style={{ marginBottom: "16px" }}>
              <h2>Registered Users ({users.length})</h2>
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.phone || "—"}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ADD PRODUCT MODAL ── */}
        {showAddProduct && (
          <div className="admin-modal-overlay" onClick={() => setShowAddProduct(false)}>
            <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Add New Product</h3>
                <button className="modal-close-btn" onClick={() => setShowAddProduct(false)}>✕</button>
              </div>
              <form onSubmit={handleAddProductSubmit} className="admin-modal-form">
                <div className="form-group">
                  <label>Product Name <span className="req">*</span></label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Organic Honey"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category <span className="req">*</span></label>
                  <select
                    value={newProduct.category_id}
                    onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Regular Price ($) <span className="req">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.regular_price}
                      onChange={e => setNewProduct({ ...newProduct, regular_price: e.target.value })}
                      placeholder="14.99"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sale Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.sale_price}
                      onChange={e => setNewProduct({ ...newProduct, sale_price: e.target.value, on_sale: !!e.target.value })}
                      placeholder="9.99"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image Path / URL</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="/images/products/apple.png"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddProduct(false)}>Cancel</button>
                  <button type="submit" className="admin-btn-primary">Create Product</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── ADD CATEGORY MODAL ── */}
        {showAddCategory && (
          <div className="admin-modal-overlay" onClick={() => setShowAddCategory(false)}>
            <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Add New Category</h3>
                <button className="modal-close-btn" onClick={() => setShowAddCategory(false)}>✕</button>
              </div>
              <form onSubmit={handleAddCategorySubmit} className="admin-modal-form">
                <div className="form-group">
                  <label>Category Name <span className="req">*</span></label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g. Fresh Fruits"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Icon / Image Path</label>
                  <input
                    type="text"
                    value={newCategory.image}
                    onChange={e => setNewCategory({ ...newCategory, image: e.target.value })}
                    placeholder="/images/categories/vegetables.png"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddCategory(false)}>Cancel</button>
                  <button type="submit" className="admin-btn-primary">Create Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
