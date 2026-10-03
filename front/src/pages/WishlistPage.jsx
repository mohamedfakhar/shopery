import { Link } from "react-router-dom"
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi"
import { useWishlist } from "../context/useWishlist"
import { useCart } from "../context/useCart"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./WishlistPage.css"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist()
  const { addToCart } = useCart()

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty-state">
            <div className="wishlist-empty-icon">
              <FiHeart size={56} />
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you like in your wishlist to review or purchase later.</p>
            <Link to="/shop" className="wishlist-btn-primary">
              <FiArrowLeft size={16} /> Explore Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-title">My Wishlist</h1>
            <span className="wishlist-count">({wishlistCount} {wishlistCount === 1 ? "saved item" : "saved items"})</span>
          </div>
          <button type="button" className="wishlist-clear-btn" onClick={clearWishlist}>
            Clear All
          </button>
        </div>

        <div className="wishlist-card">
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Action</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => {
                const price = item.on_sale && item.sale_price ? item.sale_price : item.regular_price || 0
                const inStock = item.in_stock !== false

                return (
                  <tr key={item._id}>
                    <td className="wishlist-product-cell">
                      <Link to={`/product/${item._id}`} className="wishlist-product-link">
                        <img
                          src={getImageUrl(item.image || item.thumbnail, DEFAULT_PRODUCT_IMAGE)}
                          alt={item.name}
                          className="wishlist-thumb"
                          onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
                        />
                        <div className="wishlist-product-info">
                          <span className="wishlist-product-name">{item.name}</span>
                          {item.weight && <span className="wishlist-product-weight">{item.weight}</span>}
                        </div>
                      </Link>
                    </td>
                    <td className="wishlist-price-cell">
                      ${price.toFixed(2)}
                      {item.on_sale && item.regular_price && (
                        <span className="wishlist-old-price">${item.regular_price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="wishlist-stock-cell">
                      <span className={`wishlist-stock-badge ${inStock ? "in-stock" : "out-of-stock"}`}>
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="wishlist-action-cell">
                      <button
                        type="button"
                        className="wishlist-add-cart-btn"
                        disabled={!inStock}
                        onClick={() => addToCart(item, 1)}
                      >
                        <FiShoppingCart size={15} /> Add to Cart
                      </button>
                    </td>
                    <td className="wishlist-remove-cell">
                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        onClick={() => removeFromWishlist(item._id)}
                        title="Remove from wishlist"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
