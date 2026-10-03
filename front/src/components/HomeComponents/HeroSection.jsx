import { useNavigate } from "react-router-dom";
import { handleImageError } from "../../utils/imageHelper";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero-grid">
      <div
        className="hero-main"
        style={{
          backgroundImage: "url(/images/banner/banner-lg-03.jpg)",
        }}
      >
        <div className="hero-main__overlay" />
        <div className="hero-main__content">
          <p className="hero-main__sub">
            Sale up to <span>30% OFF</span>
          </p>
          <h1>
            Fresh & Healthy
            <br />
            Organic Food
          </h1>
          <p className="hero-main__desc">Free shipping on all your order.</p>
          <button
            className="hero-main__btn"
            onClick={() => navigate("/shop")}
          >
            Shop Now →
          </button>
        </div>
      </div>
      <div className="hero-side">
        <div
          className="hero-side__card hero-side__card--1"
          onClick={() => navigate("/shop")}
          style={{ cursor: "pointer" }}
        >
          <div className="hero-side__text">
            <span>SUMMER SALE</span>
            <h2>75% OFF</h2>
            <p>Only Fruit & Vegetable</p>
            <button>Shop Now →</button>
          </div>
          <img
            src="/images/banner/banner-sm-05.png"
            alt="Summer Sale"
            onError={handleImageError()}
          />
        </div>
        <div
          className="hero-side__card hero-side__card--2"
          onClick={() => navigate("/shop")}
          style={{ cursor: "pointer" }}
        >
          <div className="hero-side__text">
            <span>BEST DEAL</span>
            <h2>
              Special Products
              <br />
              Deal Of The Month
            </h2>
            <button>Shop Now →</button>
          </div>
          <img
            src="/images/banner/banner-sm-04.png"
            alt="Best Deal"
            onError={handleImageError()}
          />
        </div>
      </div>
    </section>
  );
}
