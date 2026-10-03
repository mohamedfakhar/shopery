import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  FiGrid, FiClock, FiHeart, FiShoppingCart,
  FiSettings, FiLogOut, FiEye, FiEyeOff, FiPackage,
  FiCheckCircle, FiChevronRight, FiMapPin, FiUser
} from "react-icons/fi"
import { useAuth } from "../context/useAuth"
import { useCart } from "../context/useCart"
import { useWishlist } from "../context/useWishlist"
import { useToast } from "../context/ToastContext"
import api from "../api/axios"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./ProfilePage.css"

const NAV_ITEMS = [
  { icon: <FiGrid size={16}/>, label: "Dashboard", key: "dashboard" },
  { icon: <FiClock size={16}/>, label: "Order History", key: "orders" },
  { icon: <FiHeart size={16}/>, label: "Wishlist", key: "wishlist" },
  { icon: <FiShoppingCart size={16}/>, label: "Shopping Cart", key: "cart" },
  { icon: <FiSettings size={16}/>, label: "Settings", key: "settings" },
]

export default function ProfilePage() {
  const { user, login, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("dashboard")

  // Orders State
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Account Settings
  const nameParts = (user?.name || "").split(" ")
  const [firstName, setFirstName] = useState(nameParts[0] || "")
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [accMsg, setAccMsg] = useState("")
  const [accErr, setAccErr] = useState("")
  const [accLoading, setAccLoading] = useState(false)

  // Billing Address
  const [addr, setAddr] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "Egypt"
  })
  const [addrMsg, setAddrMsg] = useState("")
  const [addrLoading, setAddrLoading] = useState(false)

  // Change Password
  const [curPass, setCurPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confPass, setConfPass] = useState("")
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [passMsg, setPassMsg] = useState("")
  const [passErr, setPassErr] = useState("")
  const [passLoad, setPassLoad] = useState(false)

  // Fetch orders when entering orders or dashboard tab
  useEffect(() => {
    if (activeTab === "orders" || activeTab === "dashboard") {
      setOrdersLoading(true)
      api.get("/orders/my-orders")
        .then(res => {
          const list = res.data?.orders || (Array.isArray(res.data) ? res.data : [])
          setOrders(list)
        })
        .catch(err => {
          console.error("Failed to load user orders:", err)
        })
        .finally(() => setOrdersLoading(false))
    }
  }, [activeTab])

  // Sync state if user updates
  useEffect(() => {
    if (user) {
      const parts = (user.name || "").split(" ")
      setFirstName(parts[0] || "")
      setLastName(parts.slice(1).join(" ") || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      if (user.address) {
        setAddr({
          street: user.address.street || "",
          city: user.address.city || "",
          state: user.address.state || "",
          zipCode: user.address.zipCode || "",
          country: user.address.country || "Egypt"
        })
      }
    }
  }, [user])

  const handleAccountSave = async (e) => {
    e.preventDefault()
    setAccLoading(true); setAccMsg(""); setAccErr("")
    try {
      const res = await api.put("/users/profile", {
        name: `${firstName} ${lastName}`.trim(),
        email, phone
      })
      login({ ...res.data, token: localStorage.getItem("token") })
      setAccMsg("Account settings saved successfully!")
      showToast("Profile updated successfully!", "success")
    } catch (err) {
      const errTxt = err.response?.data?.message || "Something went wrong"
      setAccErr(errTxt)
      showToast(errTxt, "error")
    } finally {
      setAccLoading(false)
    }
  }

  const handleAddrSave = async (e) => {
    e.preventDefault()
    setAddrLoading(true); setAddrMsg("")
    try {
      const res = await api.put("/users/profile", { address: addr })
      login({ ...res.data, token: localStorage.getItem("token") })
      setAddrMsg("Billing address saved successfully!")
      showToast("Address updated successfully!", "success")
    } catch {
      setAddrMsg("Failed to save address.")
      showToast("Failed to save address.", "error")
    } finally {
      setAddrLoading(false)
    }
  }

  const handlePassChange = async (e) => {
    e.preventDefault()
    setPassMsg(""); setPassErr("")
    if (newPass !== confPass) { 
      setPassErr("Passwords do not match")
      showToast("Passwords do not match", "error")
      return 
    }
    if (newPass.length < 6) { 
      setPassErr("Minimum 6 characters")
      showToast("Password must be at least 6 characters", "error")
      return 
    }
    setPassLoad(true)
    try {
      await api.put("/users/change-password", {
        currentPassword: curPass, newPassword: newPass
      })
      setPassMsg("Password changed successfully!")
      showToast("Password changed successfully!", "success")
      setCurPass(""); setNewPass(""); setConfPass("")
    } catch (err) {
      const errTxt = err.response?.data?.message || "Failed to change password"
      setPassErr(errTxt)
      showToast(errTxt, "error")
    } finally {
      setPassLoad(false)
    }
  }

  const handleLogout = () => { 
    logout()
    showToast("Logged out successfully.", "info")
    navigate("/login") 
  }

  return (
    <div className="prof-page">
      {/* Banner */}
      <div className="prof-banner">
        <div className="container prof-banner__inner">
          <Link to="/">Home</Link> <span>/</span>
          <span>Account</span> <span>/</span>
          <span className="prof-banner__cur">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </span>
        </div>
      </div>

      <div className="container prof-body">
        {/* ── Sidebar ── */}
        <aside className="prof-sidebar">
          <div className="prof-user-card">
            <div className="prof-avatar">
              <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div className="prof-user-meta">
              <h4>{user?.name || "Customer"}</h4>
              <p>{user?.email}</p>
              {user?.role === "admin" && <span className="prof-admin-badge">Admin</span>}
            </div>
          </div>

          <p className="prof-sidebar__label">Navigation</p>
          <nav>
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`prof-nav-item ${activeTab === item.key ? "prof-nav-item--active" : ""}`}
                onClick={() => {
                  if (item.key === "cart") {
                    navigate("/cart")
                  } else if (item.key === "wishlist") {
                    navigate("/wishlist")
                  } else {
                    setActiveTab(item.key)
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.key === "cart" && cartCount > 0 && <span className="sidebar-badge">{cartCount}</span>}
                {item.key === "wishlist" && wishlistCount > 0 && <span className="sidebar-badge">{wishlistCount}</span>}
              </button>
            ))}

            {user?.role === "admin" && (
              <button
                className="prof-nav-item prof-nav-item--admin"
                onClick={() => navigate("/admin")}
              >
                <FiPackage size={16}/>
                <span>Admin Dashboard</span>
              </button>
            )}

            <button className="prof-nav-item prof-nav-item--logout" onClick={handleLogout}>
              <FiLogOut size={16}/>
              <span>Log out</span>
            </button>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="prof-main">
          
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="prof-tab-content">
              <div className="dashboard-welcome">
                <h2>Hello, {user?.name || "Customer"}!</h2>
                <p>From your account dashboard, you can view your recent orders, manage shipping addresses, and edit your profile settings.</p>
              </div>

              {/* Stats Cards */}
              <div className="dashboard-stats-grid">
                <div className="dash-stat-card" onClick={() => setActiveTab("orders")}>
                  <div className="stat-icon stat-icon--orders">
                    <FiClock size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-num">{orders.length}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>

                <div className="dash-stat-card" onClick={() => navigate("/wishlist")}>
                  <div className="stat-icon stat-icon--wishlist">
                    <FiHeart size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-num">{wishlistCount}</span>
                    <span className="stat-label">Wishlist Items</span>
                  </div>
                </div>

                <div className="dash-stat-card" onClick={() => navigate("/cart")}>
                  <div className="stat-icon stat-icon--cart">
                    <FiShoppingCart size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-num">{cartCount}</span>
                    <span className="stat-label">Cart Items</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="prof-card" style={{ marginTop: "24px" }}>
                <div className="prof-card-head">
                  <h3 className="prof-card__title">Recent Orders</h3>
                  <button className="text-btn" onClick={() => setActiveTab("orders")}>
                    View All Orders <FiChevronRight size={14} />
                  </button>
                </div>

                {ordersLoading ? (
                  <p className="loading-text">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="empty-orders-note">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="prof-btn-small">Shop Now</Link>
                  </div>
                ) : (
                  <div className="recent-orders-list">
                    {orders.slice(0, 3).map(ord => (
                      <div key={ord._id} className="recent-order-item">
                        <div>
                          <strong>#{ord._id.slice(-8).toUpperCase()}</strong>
                          <span className="order-date">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className={`status-pill status-${(ord.orderStatus || "Processing").toLowerCase()}`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                        <div>
                          <strong className="order-price">${Number(ord.totalPrice || 0).toFixed(2)}</strong>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn-details"
                            onClick={() => setSelectedOrder(ord)}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Quick Details */}
              <div className="dashboard-details-grid" style={{ marginTop: "24px" }}>
                <div className="prof-card">
                  <h3 className="prof-card__title">Account Information</h3>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Phone:</strong> {user?.phone || "Not set"}</p>
                  <button className="prof-btn-small" style={{ marginTop: "12px" }} onClick={() => setActiveTab("settings")}>
                    Edit Profile
                  </button>
                </div>

                <div className="prof-card">
                  <h3 className="prof-card__title">Billing Address</h3>
                  {addr.street ? (
                    <>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p>{addr.country}</p>
                    </>
                  ) : (
                    <p style={{ color: "#777" }}>No billing address saved yet.</p>
                  )}
                  <button className="prof-btn-small" style={{ marginTop: "12px" }} onClick={() => setActiveTab("settings")}>
                    Edit Address
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDER HISTORY TAB */}
          {activeTab === "orders" && (
            <div className="prof-tab-content">
              <div className="prof-card">
                <h3 className="prof-card__title">Order History ({orders.length})</h3>

                {ordersLoading ? (
                  <p className="loading-text">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="empty-orders-note" style={{ padding: "40px 0" }}>
                    <FiPackage size={48} color="#999" />
                    <h4>No Orders Found</h4>
                    <p>You haven't made any purchases with Shopery yet.</p>
                    <Link to="/shop" className="prof-btn" style={{ display: "inline-block", marginTop: "14px", textDecoration: "none" }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="orders-table-wrapper">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(ord => (
                          <tr key={ord._id}>
                            <td className="ord-id">#{ord._id.slice(-8).toUpperCase()}</td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                            <td>{ord.orderItems?.length || 0} items</td>
                            <td><strong>${Number(ord.totalPrice || 0).toFixed(2)}</strong></td>
                            <td>
                              <span className={`status-pill status-${(ord.orderStatus || "Processing").toLowerCase()}`}>
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-view-order"
                                onClick={() => setSelectedOrder(ord)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="prof-tab-content">
              {/* Account Settings */}
              <div className="prof-card">
                <h3 className="prof-card__title">Account Settings</h3>
                {accMsg && <div className="prof-msg prof-msg--success">{accMsg}</div>}
                {accErr && <div className="prof-msg prof-msg--error">{accErr}</div>}
                <form onSubmit={handleAccountSave}>
                  <div className="prof-form-fields">
                    <div className="prof-field-row">
                      <div className="prof-field">
                        <label>First Name</label>
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"/>
                      </div>
                      <div className="prof-field">
                        <label>Last Name</label>
                        <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"/>
                      </div>
                    </div>
                    <div className="prof-field">
                      <label>Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"/>
                    </div>
                    <div className="prof-field">
                      <label>Phone Number</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(000) 000-0000"/>
                    </div>
                    <button type="submit" className="prof-btn" disabled={accLoading}>
                      {accLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Billing Address */}
              <div className="prof-card">
                <h3 className="prof-card__title">Billing & Shipping Address</h3>
                {addrMsg && <div className="prof-msg prof-msg--success">{addrMsg}</div>}
                <form onSubmit={handleAddrSave}>
                  <div className="prof-field">
                    <label>Street Address</label>
                    <input value={addr.street} onChange={e => setAddr({...addr, street: e.target.value})} placeholder="Your address"/>
                  </div>
                  <div className="prof-field-row">
                    <div className="prof-field">
                      <label>City</label>
                      <input value={addr.city} onChange={e => setAddr({...addr, city: e.target.value})} placeholder="City"/>
                    </div>
                    <div className="prof-field">
                      <label>State / Region</label>
                      <input value={addr.state} onChange={e => setAddr({...addr, state: e.target.value})} placeholder="State"/>
                    </div>
                    <div className="prof-field">
                      <label>Zip / Postal Code</label>
                      <input value={addr.zipCode} onChange={e => setAddr({...addr, zipCode: e.target.value})} placeholder="Zip Code"/>
                    </div>
                  </div>
                  <div className="prof-field">
                    <label>Country</label>
                    <input value={addr.country} onChange={e => setAddr({...addr, country: e.target.value})} placeholder="Country"/>
                  </div>
                  <button type="submit" className="prof-btn" disabled={addrLoading}>
                    {addrLoading ? "Saving..." : "Save Address"}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="prof-card">
                <h3 className="prof-card__title">Change Password</h3>
                {passMsg && <div className="prof-msg prof-msg--success">{passMsg}</div>}
                {passErr && <div className="prof-msg prof-msg--error">{passErr}</div>}
                <form onSubmit={handlePassChange}>
                  <div className="prof-field">
                    <label>Current Password</label>
                    <div className="prof-pass-wrap">
                      <input
                        type={showCur ? "text" : "password"}
                        value={curPass} onChange={e => setCurPass(e.target.value)}
                        placeholder="Current password"
                        required
                      />
                      <button type="button" onClick={() => setShowCur(s => !s)}>
                        {showCur ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                      </button>
                    </div>
                  </div>
                  <div className="prof-field-row">
                    <div className="prof-field">
                      <label>New Password</label>
                      <div className="prof-pass-wrap">
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPass} onChange={e => setNewPass(e.target.value)}
                          placeholder="New password"
                          required
                        />
                        <button type="button" onClick={() => setShowNew(s => !s)}>
                          {showNew ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                        </button>
                      </div>
                    </div>
                    <div className="prof-field">
                      <label>Confirm Password</label>
                      <div className="prof-pass-wrap">
                        <input
                          type={showConf ? "text" : "password"}
                          value={confPass} onChange={e => setConfPass(e.target.value)}
                          placeholder="Confirm password"
                          required
                        />
                        <button type="button" onClick={() => setShowConf(s => !s)}>
                          {showConf ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="prof-btn" disabled={passLoad}>
                    {passLoad ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-card" onClick={e => e.stopPropagation()}>
            <div className="order-modal-head">
              <h3>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="order-modal-body">
              <div className="modal-meta-grid">
                <div>
                  <span>Date:</span>
                  <strong>{new Date(selectedOrder.createdAt).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span>Status:</span>
                  <span className={`status-pill status-${(selectedOrder.orderStatus || "Processing").toLowerCase()}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div>
                  <span>Total:</span>
                  <strong className="highlight">${Number(selectedOrder.totalPrice || 0).toFixed(2)}</strong>
                </div>
                <div>
                  <span>Payment:</span>
                  <strong>{selectedOrder.paymentMethod}</strong>
                </div>
              </div>

              <div className="modal-section">
                <h4>Shipping Address</h4>
                <p><strong>{selectedOrder.shippingAddress?.fullName}</strong> ({selectedOrder.shippingAddress?.phone})</p>
                <p>{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
              </div>

              <div className="modal-section">
                <h4>Ordered Items ({selectedOrder.orderItems?.length})</h4>
                <div className="modal-items-list">
                  {selectedOrder.orderItems?.map((it, i) => (
                    <div key={i} className="modal-item-row">
                      <img
                        src={getImageUrl(it.image, DEFAULT_PRODUCT_IMAGE)}
                        alt={it.name}
                        onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
                      />
                      <div className="modal-item-info">
                        <span className="item-name">{it.name}</span>
                        <span className="item-qty">${Number(it.price).toFixed(2)} × {it.quantity}</span>
                      </div>
                      <span className="item-total">${(Number(it.price) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-modal-foot">
              <button className="prof-btn" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}