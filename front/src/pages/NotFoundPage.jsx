import { Link } from "react-router-dom"
import { FiHome, FiShoppingBag, FiAlertTriangle } from "react-icons/fi"
import "./NotFoundPage.css"

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <div className="container">
        <div className="notfound-card">
          <div className="notfound-icon">
            <FiAlertTriangle size={64} />
          </div>
          <h1 className="notfound-code">404</h1>
          <h2 className="notfound-title">Oops! Page not found</h2>
          <p className="notfound-desc">
            The page you are looking for doesn't exist or has been moved. 
            Don't worry, you can easily find your way back to our fresh store!
          </p>
          <div className="notfound-actions">
            <Link to="/" className="notfound-btn-primary">
              <FiHome size={16} /> Back to Home
            </Link>
            <Link to="/shop" className="notfound-btn-outline">
              <FiShoppingBag size={16} /> Browse Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
