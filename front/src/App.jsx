import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import { ToastProvider } from "./context/ToastContext"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

import HomePage from "./pages/HomePage"
import ShopPage from "./pages/ShopPage"
import ProductPage from "./pages/ProductPage"
import CartPage from "./pages/CartPage"
import WishlistPage from "./pages/WishlistPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderSuccessPage from "./pages/OrderSuccessPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Protected User Route */}
                    <Route path="/profile" element={
                      <ProtectedRoute><ProfilePage /></ProtectedRoute>
                    } />

                    {/* Protected Admin Route */}
                    <Route path="/admin" element={
                      <AdminRoute><AdminPage /></AdminRoute>
                    } />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App