import { createContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const { addToast } = useToast()
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("shopery_wishlist")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("shopery_wishlist", JSON.stringify(wishlist))
    } catch (err) {
      console.error("Failed to save wishlist to localStorage", err)
    }
  }, [wishlist])

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId)
  }

  const addToWishlist = (product) => {
    if (!product || !product._id) return
    if (!isInWishlist(product._id)) {
      setWishlist((prev) => [...prev, product])
      addToast(`${product.name} added to wishlist!`, "success")
    }
  }

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId))
    addToast("Removed from wishlist", "info")
  }

  const toggleWishlist = (product) => {
    if (!product || !product._id) return
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistContext
