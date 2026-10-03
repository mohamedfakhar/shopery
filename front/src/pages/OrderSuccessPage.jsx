import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { FiCheckCircle, FiPackage, FiShoppingBag, FiTruck, FiMapPin } from "react-icons/fi"
import api from "../api/axios"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./OrderSuccessPage.css"

export default function OrderSuccessPage() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!order && id) {
      setLoading(true)
      api.get(`/orders/${id}`)
        .then(res => {
          setOrder(res.data.order)
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to load order:", err)
          setError("Could not load order details.")
          setLoading(false)
        })
    }
  }, [id, order])

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="order-success-loading">
            <div className="pd-spinner" />
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="order-success-card error-card">
            <h2>Order Not Found</h2>
            <p>{error || "We couldn't retrieve the details for this order."}</p>
            <Link to="/shop" className="order-btn-primary">
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="order-success-card">
          <div className="order-success-icon">
            <FiCheckCircle size={64} />
          </div>

          <h1 className="order-success-title">Thank You For Your Order!</h1>
          <p className="order-success-subtitle">
            Your order has been received and is currently being processed by our team.
          </p>

          <div className="order-summary-box">
            <div className="summary-item">
              <span className="label">Order Number</span>
              <span className="value">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="summary-item">
              <span className="label">Date</span>
              <span className="value">
                {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Total Amount</span>
              <span className="value highlight">${Number(order.totalPrice || 0).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Payment Method</span>
              <span className="value">{order.paymentMethod || "Cash on Delivery"}</span>
            </div>
            <div className="summary-item">
              <span className="label">Status</span>
              <span className={`status-pill status-${(order.orderStatus || "Processing").toLowerCase()}`}>
                {order.orderStatus || "Processing"}
              </span>
            </div>
          </div>

          {/* Delivery & Address */}
          <div className="order-delivery-info">
            <div className="delivery-col">
              <div className="col-heading">
                <FiMapPin size={18} />
                <h3>Delivery Address</h3>
              </div>
              <p><strong>{order.shippingAddress?.fullName}</strong></p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="contact">Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="delivery-col">
              <div className="col-heading">
                <FiTruck size={18} />
                <h3>Delivery Method</h3>
              </div>
              <p><strong>Standard Doorstep Delivery</strong></p>
              <p>Estimated delivery within 24-48 hours.</p>
              <p className="payment-note">Payment on delivery via {order.paymentMethod}.</p>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="order-items-wrapper">
            <h3 className="items-heading">Order Items ({order.orderItems?.length || 0})</h3>
            <div className="order-items-table">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <img
                    src={getImageUrl(item.image, DEFAULT_PRODUCT_IMAGE)}
                    alt={item.name}
                    className="order-item-thumb"
                    onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
                  />
                  <div className="order-item-info">
                    <span className="name">{item.name}</span>
                    <span className="unit-price">${Number(item.price).toFixed(2)} × {item.quantity}</span>
                  </div>
                  <span className="order-item-total">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-success-actions">
            <Link to="/profile" className="order-btn-outline">
              <FiPackage size={16} /> View All Orders
            </Link>
            <Link to="/shop" className="order-btn-primary">
              <FiShoppingBag size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
