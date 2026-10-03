import { Link } from "react-router-dom"
import { FiCheckCircle, FiTruck, FiHeadphones, FiShield, FiHeart } from "react-icons/fi"
import "./AboutPage.css"

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container about-hero__inner">
          <div className="about-hero__content">
            <span className="about-badge">About Shopery • Full-Stack E-Commerce</span>
            <h1>Fresh, Organic & Wholesome Groceries</h1>
            <p>
              Shopery is a modern full-stack organic grocery e-commerce platform built to demonstrate
              a seamless end-to-end shopping experience — from fresh farm product discovery and live cart calculations
              to secure customer checkout and administrative order management.
            </p>
            <div className="about-hero__features">
              <div className="feature-item">
                <FiCheckCircle className="icon" />
                <span>100% Organic & Farm Fresh Produce</span>
              </div>
              <div className="feature-item">
                <FiCheckCircle className="icon" />
                <span>Transparent Sourcing from Local Farms</span>
              </div>
              <div className="feature-item">
                <FiCheckCircle className="icon" />
                <span>Eco-friendly & Biodegradable Packaging</span>
              </div>
            </div>
            <Link to="/shop" className="about-cta-btn">
              Explore Our Store
            </Link>
          </div>
          <div className="about-hero__image">
            <img src="/images/banner/banner-lg-01.jpg" alt="Shopery Fresh Produce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container about-stats__grid">
          <div className="stat-box">
            <h3>100%</h3>
            <p>Organic Quality Guarantee</p>
          </div>
          <div className="stat-box">
            <h3>12+</h3>
            <p>Fresh Produce Categories</p>
          </div>
          <div className="stat-box">
            <h3>24-48h</h3>
            <p>Fast Doorstep Delivery</p>
          </div>
          <div className="stat-box">
            <h3>30 Days</h3>
            <p>Satisfaction Guarantee</p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-values">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-title">Why Choose Shopery</span>
            <h2>Our Core Commitments</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FiTruck size={28} /></div>
              <h3>Free Shipping</h3>
              <p>Enjoy free and speedy doorstep delivery on all orders over $50, handled with utmost care.</p>
            </div>

            <div className="value-card">
              <div className="value-icon"><FiHeadphones size={28} /></div>
              <h3>Great Support 24/7</h3>
              <p>Our dedicated customer success team is available round-the-clock to assist with your orders.</p>
            </div>

            <div className="value-card">
              <div className="value-icon"><FiShield size={28} /></div>
              <h3>100% Secure Checkout</h3>
              <p>Shop with total peace of mind with encrypted checkout and flexible cash-on-delivery options.</p>
            </div>

            <div className="value-card">
              <div className="value-icon"><FiHeart size={28} /></div>
              <h3>Money-Back Guarantee</h3>
              <p>Not 100% satisfied with freshness? Enjoy hassle-free refunds or replacements within 30 days.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
