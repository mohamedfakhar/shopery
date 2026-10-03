import { useNavigate } from "react-router-dom"
import { FiHeart, FiShoppingCart, FiEye, FiStar } from "react-icons/fi"
import { FaStar } from "react-icons/fa"
import { useCart } from "../context/useCart"
import { useWishlist } from "../context/useWishlist"
import { getImageUrl, handleImageError, DEFAULT_PRODUCT_IMAGE } from "../utils/imageHelper"
import "./ProductCard.css"

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (!product) return null

  const isWish = isInWishlist(product._id)
  const rawImg = product.image || product.thumbnail || product.images?.[0] || ""
  const img = getImageUrl(rawImg, DEFAULT_PRODUCT_IMAGE)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleToggleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    navigate(`/product/${product._id}`)
  }

  return (
    <div className="pcard" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="pcard__badges">
        {product.on_sale && product.sale_label && (
          <span className="pcard__badge pcard__badge--sale">-{product.sale_label}</span>
        )}
        {product.is_hot_deal && (
          <span className="pcard__badge pcard__badge--hot">Hot</span>
        )}
      </div>

      <div className="pcard__actions">
        <button
          onClick={handleToggleWishlist}
          title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
          style={{ color: isWish ? "#ea4b48" : "inherit" }}
        >
          <FiHeart size={16} fill={isWish ? "#ea4b48" : "none"} stroke={isWish ? "#ea4b48" : "currentColor"} />
        </button>

        <button onClick={handleQuickView} title="Quick View" aria-label="Quick View">
          <FiEye size={16} />
        </button>

        <button onClick={handleAddToCart} title="Add to Cart" aria-label="Add to Cart">
          <FiShoppingCart size={16} />
        </button>
      </div>

      <div className="pcard__img-wrap">
        <img
          src={img}
          alt={product.name}
          onError={handleImageError(DEFAULT_PRODUCT_IMAGE)}
          loading="lazy"
        />
      </div>

      <div className="pcard__info">
        <h4 className="pcard__name">{product.name}</h4>
        <div className="pcard__price">
          {product.on_sale && product.sale_price ? (
            <>
              <span className="pcard__price--old">${product.regular_price}</span>
              <span className="pcard__price--sale">${product.sale_price}</span>
            </>
          ) : (
            <span className="pcard__price--current">${product.regular_price || product.price || 0}</span>
          )}
        </div>
        <div className="pcard__stars">
          {[...Array(5)].map((_, i) =>
            i < Math.round(product.rating || 4) ? (
              <FaStar key={i} size={14} />
            ) : (
              <FiStar key={i} size={14} />
            )
          )}
          <span>({product.review_count || 0})</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard