import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { FiCheckCircle, FiShield, FiTruck, FiArrowLeft } from "react-icons/fi"
import { useCart } from "../context/useCart"
import { useAuth } from "../context/useAuth"
import { useToast } from "../context/ToastContext"
import api from "../api/axios"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./CheckoutPage.css"

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const couponCode = location.state?.couponCode || ""
  const discountPercent = location.state?.discountPercent || 0
  const discountAmount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2))

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Egypt",
    orderNotes: "",
    paymentMethod: "Cash on Delivery"
  })

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ")
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "Egypt"
      }))
    }
  }, [user])

  // Shipping calculation
  const shippingCost = cartSubtotal > 50 || cart.length === 0 ? 0 : 10
  const totalAmount = Number(Math.max(0, cartSubtotal - discountAmount + shippingCost).toFixed(2))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      showToast("Your cart is empty. Add products before checkout.", "error")
      navigate("/shop")
      return
    }

    if (!formData.firstName || !formData.email || !formData.phone || !formData.street || !formData.city) {
      showToast("Please fill in all required shipping details.", "error")
      return
    }

    setLoading(true)

    const orderPayload = {
      orderItems: cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image || item.thumbnail || "",
        price: item.on_sale && item.sale_price ? item.sale_price : item.regular_price || 0,
        quantity: item.quantity
      })),
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state || "N/A",
        postalCode: formData.zipCode || "12345",
        country: formData.country || "Egypt"
      },
      paymentMethod: formData.paymentMethod,
      couponCode,
      itemsPrice: cartSubtotal,
      shippingPrice: shippingCost,
      taxPrice: 0,
      totalPrice: totalAmount,
      orderNotes: formData.orderNotes
    }

    try {
      const response = await api.post("/orders", orderPayload)
      const createdOrder = response.data.order || response.data

      showToast("Order placed successfully!", "success")
      clearCart()
      navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } })
    } catch (err) {
      console.error("Order submission error:", err)
      const message = err.response?.data?.message || "Failed to place order. Please try again."
      showToast(message, "error")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty-state">
            <h2>Your cart is empty</h2>
            <p>Please add products to your cart before proceeding to checkout.</p>
            <Link to="/shop" className="checkout-btn-primary">
              <FiArrowLeft size={16} /> Return to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="checkout-title">Billing & Checkout</h1>
          <p className="checkout-subtitle">Complete your order details below</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Left: Billing Form */}
          <div className="checkout-form-card">
            <h2 className="form-section-title">Shipping Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="req">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number <span className="req">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+20 123 456 7890"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Street Address <span className="req">*</span></label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House number and street name"
                required
              />
            </div>

            <div className="form-group">
              <label>Apartment, suite, unit (optional)</label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc."
              />
            </div>

            <div className="form-row three-cols">
              <div className="form-group">
                <label>Town / City <span className="req">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label>State / Region</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State / Governorate"
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country / Region</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>

            <div className="form-group">
              <label>Order Notes (optional)</label>
              <textarea
                name="orderNotes"
                rows="3"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="Notes about your order, e.g. special delivery instructions."
              />
            </div>

            <h2 className="form-section-title" style={{ marginTop: "32px" }}>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${formData.paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === "Cash on Delivery"}
                  onChange={handleChange}
                />
                <div className="option-info">
                  <strong>Cash on Delivery (COD)</strong>
                  <span>Pay with cash upon arrival of your groceries.</span>
                </div>
              </label>

              <label className={`payment-option ${formData.paymentMethod === "Bank Transfer" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={formData.paymentMethod === "Bank Transfer"}
                  onChange={handleChange}
                />
                <div className="option-info">
                  <strong>Direct Bank Transfer (Demo)</strong>
                  <span>Make your payment directly into our bank account.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="checkout-items-list">
              {cart.map(item => {
                const price = item.on_sale && item.sale_price ? item.sale_price : item.regular_price || 0
                return (
                  <div key={item._id} className="checkout-item-row">
                    <img
                      src={getImageUrl(item.image || item.thumbnail, DEFAULT_PRODUCT_IMAGE)}
                      alt={item.name}
                      className="checkout-item-img"
                      onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
                    />
                    <div className="checkout-item-details">
                      <span className="checkout-item-title">{item.name}</span>
                      <span className="checkout-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Subtotal:</span>
              <strong>${cartSubtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? <strong className="free-shipping">Free</strong> : `$${shippingCost.toFixed(2)}`}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row discount" style={{ color: "#ea4b48" }}>
                <span>Discount ({discountPercent}%):</span>
                <strong style={{ color: "#ea4b48" }}>-${discountAmount.toFixed(2)}</strong>
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total:</span>
              <span className="total-val">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="checkout-submit-btn"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <div className="checkout-badges">
              <div className="badge-item">
                <FiShield size={16} />
                <span>Secure & Encrypted SSL Checkout</span>
              </div>
              <div className="badge-item">
                <FiTruck size={16} />
                <span>Fresh & Fast Doorstep Delivery</span>
              </div>
              <div className="badge-item">
                <FiCheckCircle size={16} />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
