import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiArrowRight } from "react-icons/fi"
import { useCart } from "../context/useCart"
import { useToast } from "../context/ToastContext"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./CartPage.css"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartCount } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [couponCode, setCouponCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState("")

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    if (code === "SHOPERY10") {
      setDiscountPercent(10)
      setAppliedCoupon(code)
      showToast("Coupon SHOPERY10 applied: 10% OFF!", "success")
    } else if (code === "FREESHIP") {
      setDiscountPercent(5)
      setAppliedCoupon(code)
      showToast("Coupon FREESHIP applied: $5 OFF!", "success")
    } else {
      showToast("Invalid coupon code. Try 'SHOPERY10'", "error")
    }
    setCouponCode("")
  }

  const shippingCost = cartSubtotal > 50 || cart.length === 0 ? 0 : 10
  const discountAmount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2))
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost).toFixed(2)

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-state">
            <div className="cart-empty-icon">
              <FiShoppingBag size={56} />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet. Explore our fresh organic goods!</p>
            <Link to="/shop" className="cart-btn-primary">
              <FiArrowLeft size={16} /> Return to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Breadcrumb / Title */}
        <div className="cart-header">
          <h1 className="cart-title">My Shopping Cart</h1>
          <span className="cart-items-count">({cartCount} {cartCount === 1 ? "item" : "items"})</span>
        </div>

        <div className="cart-layout">
          {/* Main items table */}
          <div className="cart-main">
            <div className="cart-table-card">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const price = item.on_sale && item.sale_price ? item.sale_price : item.regular_price || 0
                    const lineTotal = (price * item.quantity).toFixed(2)
                    return (
                      <tr key={item._id}>
                        <td className="cart-product-cell">
                          <Link to={`/product/${item._id}`} className="cart-product-link">
                            <img
                              src={getImageUrl(item.image || item.thumbnail, DEFAULT_PRODUCT_IMAGE)}
                              alt={item.name}
                              className="cart-thumb"
                              onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
                            />
                            <div className="cart-product-info">
                              <span className="cart-product-name">{item.name}</span>
                              {item.weight && <span className="cart-product-weight">{item.weight}</span>}
                            </div>
                          </Link>
                        </td>
                        <td className="cart-price-cell">${price.toFixed(2)}</td>
                        <td className="cart-qty-cell">
                          <div className="cart-qty-stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="cart-subtotal-cell">${lineTotal}</td>
                        <td className="cart-action-cell">
                          <button
                            type="button"
                            className="cart-remove-btn"
                            onClick={() => removeFromCart(item._id)}
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="cart-actions-bar">
                <Link to="/shop" className="cart-btn-outline">
                  <FiArrowLeft size={16} /> Continue Shopping
                </Link>
                <button
                  type="button"
                  className="cart-btn-clear"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Coupon Card */}
            <div className="cart-coupon-card">
              <h3>Coupon Code</h3>
              <p>Have a promo coupon? Enter it below (e.g. <code>SHOPERY10</code> for 10% off).</p>
              <form onSubmit={handleApplyCoupon} className="cart-coupon-form">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="submit" className="cart-btn-apply">
                  Apply Coupon
                </button>
              </form>
              {appliedCoupon && (
                <div className="cart-applied-badge">
                  <span>Active coupon: <strong>{appliedCoupon}</strong> ({discountPercent}% OFF)</span>
                  <button type="button" onClick={() => { setDiscountPercent(0); setAppliedCoupon(""); }}>Remove</button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Totals */}
          <div className="cart-sidebar">
            <div className="cart-summary-card">
              <h2 className="summary-title">Cart Total</h2>

              <div className="summary-row">
                <span>Subtotal:</span>
                <strong>${cartSubtotal.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? <strong className="free-shipping">Free</strong> : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span className="discount-val">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total:</span>
                <span className="total-val">${finalTotal}</span>
              </div>

              <button
                type="button"
                className="cart-btn-checkout"
                onClick={() => navigate("/checkout", { state: { couponCode: appliedCoupon, discountPercent } })}
              >
                Proceed to Checkout <FiArrowRight size={18} />
              </button>

              <div className="summary-guarantee">
                <span>🔒 100% Safe & Secure Checkout</span>
                <span>🚚 Free delivery on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
