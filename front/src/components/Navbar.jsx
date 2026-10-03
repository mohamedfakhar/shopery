import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { useCart } from "../context/useCart"
import { useWishlist } from "../context/useWishlist"
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiChevronDown,
  FiMenu,
  FiX,
  FiMapPin,
  FiPhone,
  FiShield,
} from "react-icons/fi"
import { FaLeaf } from "react-icons/fa"
import "./Navbar.css"

function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount, total } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [mobileOpen, setMobile] = useState(false)
  const [pagesOpen, setPages] = useState(false)
  const pagesRef = useRef()

  // close pages dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (pagesRef.current && !pagesRef.current.contains(e.target)) {
        setPages(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
      setSearch("")
      setMobile(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="hdr">
      {/* ── Top Bar ── */}
      <div className="hdr-top">
        <div className="container hdr-top__inner">
          <div className="hdr-top__left">
            <FiMapPin size={13} />
            <span>Store Location: Lincoln- 344, Illinois, Chicago, USA</span>
          </div>
          <div className="hdr-top__right">
            <span className="hdr-top__lang">
              Eng <FiChevronDown size={12} />
            </span>
            <span className="hdr-top__sep">|</span>
            <span className="hdr-top__lang">
              USD <FiChevronDown size={12} />
            </span>
            <span className="hdr-top__sep">|</span>

            {user?.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  style={{
                    color: "var(--primary, #00b207)",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FiShield size={13} /> Admin Panel
                </Link>
                <span className="hdr-top__sep">|</span>
              </>
            )}

            {user ? (
              <>
                <Link to="/profile" style={{ fontWeight: 600 }}>
                  {user.name}
                </Link>
                <span className="hdr-top__sep">/</span>
                <button className="hdr-top__btn" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <span className="hdr-top__sep">/</span>
                <Link to="/register">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Bar ── */}
      <div className="hdr-main">
        <div className="container hdr-main__inner">
          {/* Logo */}
          <Link to="/" className="hdr-logo">
            <FaLeaf size={24} />
            <span>Shopery</span>
          </Link>

          {/* Search */}
          <form className="hdr-search" onSubmit={handleSearch}>
            <FiSearch size={16} className="hdr-search__icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {/* Icons */}
          <div className="hdr-icons">
            {/* Wishlist */}
            <button
              className="hdr-icon"
              onClick={() => navigate("/wishlist")}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <FiHeart size={22} />
              {wishlistCount > 0 && (
                <span className="hdr-wish-badge">{wishlistCount}</span>
              )}
            </button>

            {/* Cart */}
            <button
              className="hdr-icon hdr-icon--cart"
              onClick={() => navigate("/cart")}
              title="View Cart"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag size={22} />
              <span className="hdr-cart-badge">{cartCount}</span>
              <div className="hdr-cart-info">
                <span>Shopping cart:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="hdr-hamburger"
              onClick={() => setMobile((o) => !o)}
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Nav Bar ── */}
      <nav className={`hdr-nav ${mobileOpen ? "hdr-nav--open" : ""}`}>
        <div className="container hdr-nav__inner">
          {/* Links */}
          <div className="hdr-nav__links">
            <Link to="/" className="hdr-nav__link" onClick={() => setMobile(false)}>
              Home
            </Link>

            <Link to="/shop" className="hdr-nav__link" onClick={() => setMobile(false)}>
              Shop
            </Link>

            <Link to="/about" className="hdr-nav__link" onClick={() => setMobile(false)}>
              About Us
            </Link>

            <Link to="/contact" className="hdr-nav__link" onClick={() => setMobile(false)}>
              Contact Us
            </Link>

            {/* Pages dropdown */}
            <div className="hdr-nav__dropdown" ref={pagesRef}>
              <button
                className="hdr-nav__link hdr-nav__link--drop"
                onClick={() => setPages((o) => !o)}
                type="button"
              >
                Pages <FiChevronDown size={14} />
              </button>
              {pagesOpen && (
                <div className="hdr-dropdown__menu">
                  <Link to="/cart" onClick={() => { setPages(false); setMobile(false) }}>
                    Shopping Cart ({cartCount})
                  </Link>
                  <Link to="/wishlist" onClick={() => { setPages(false); setMobile(false) }}>
                    Wishlist ({wishlistCount})
                  </Link>
                  <Link to="/checkout" onClick={() => { setPages(false); setMobile(false) }}>
                    Checkout
                  </Link>
                  <Link to="/about" onClick={() => { setPages(false); setMobile(false) }}>
                    About Us
                  </Link>
                  <Link to="/contact" onClick={() => { setPages(false); setMobile(false) }}>
                    Contact Us
                  </Link>
                  {user ? (
                    <Link to="/profile" onClick={() => { setPages(false); setMobile(false) }}>
                      My Account
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => { setPages(false); setMobile(false) }}>
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => { setPages(false); setMobile(false) }}>
                        Sign Up
                      </Link>
                    </>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => { setPages(false); setMobile(false) }}
                      style={{ color: "#00b207", fontWeight: 700 }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="hdr-nav__phone">
            <FiPhone size={16} />
            <span>(219) 555-0114</span>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar