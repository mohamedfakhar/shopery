import { createContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { addToast } = useToast()
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("shopery_cart")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("shopery_cart", JSON.stringify(cart))
    } catch (err) {
      console.error("Failed to save cart to localStorage", err)
    }
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return

    const effectivePrice =
      product.on_sale && product.sale_price
        ? Number(product.sale_price)
        : Number(product.regular_price || product.price || 0)

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === product._id)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += Number(quantity)
        return updated
      } else {
        return [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            price: effectivePrice,
            regular_price: Number(product.regular_price || product.price || 0),
            image: product.image || product.thumbnail || "/images/products/img-01.png",
            slug: product.slug,
            category: product.categoryId?.name || product.category_id || "",
            quantity: Number(quantity),
          },
        ]
      }
    })

    addToast(`${product.name} added to cart!`, "success")
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId))
    addToast("Item removed from cart", "info")
  }

  const updateQuantity = (productId, quantity) => {
    const qty = Number(quantity)
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity: qty } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = Number(
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  )
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 10
  const total = Number((subtotal + shippingFee).toFixed(2))

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
