import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./HomePage.css";
import HeroSection from "../components/HomeComponents/HeroSection";
import Features from "../components/HomeComponents/FeaturesSection";
import CategoriesSection from "../components/HomeComponents/CategoriesSection";
import PopularProducts from "../components/HomeComponents/PopularProducts";
import PromoBanner from "../components/HomeComponents/PromoBanner";
import HotDeals from "../components/HomeComponents/HotDeals";
import DiscountBanner from "../components/HomeComponents/DiscountBanner";
import BlogSection from "../components/HomeComponents/BlogSection";
import InstagramSection from "../components/HomeComponents/InstagramSection";
import NewsLetterSection from "../components/HomeComponents/NewsLetterSection";
import { handleImageError, DEFAULT_AVATAR } from "../utils/imageHelper";

const TESTIMONIALS = [
  {
    name: "Robert Fox",
    role: "Customer",
    avatar: "/images/user/img-01.png",
    text: "Pellentesque eu nibh eget mauris congue mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
  },
  {
    name: "Dianne Russell",
    role: "Customer",
    avatar: "/images/user/img-02.png",
    text: "Pellentesque eu nibh eget mauris congue mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
  },
  {
    name: "Jane Cooper",
    role: "Customer",
    avatar: "/images/user/img-03.png",
    text: "Pellentesque eu nibh eget mauris congue mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
  },
  {
    name: "Robert Fox",
    role: "Customer",
    avatar: "/images/user/img-01.png",
    text: "Pellentesque eu nibh eget mauris congue mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
  },
  {
    name: "Dianne Russell",
    role: "Customer",
    avatar: "/images/user/img-02.png",
    text: "Pellentesque eu nibh eget mauris congue mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
  },
  {
    name: "Jane Cooper",
    role: "Customer",
    avatar: "/images/user/img-03.png",
    text: "Pellentesque eu nibh eget mauris congue mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
  },
];

//  Drag Carousel 
function DragCarousel({ children, title, onViewAll, auto = false }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (!auto || !ref.current) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(id);
  }, [auto]);

  const onDown = (e) => {
    setDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = "grabbing";
  };
  const onUp = () => {
    setDragging(false);
    if (ref.current) ref.current.style.cursor = "grab";
  };
  const onMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };

  return (
    <div className="carousel-wrap">
      <div className="carousel-head">
        <h2 className="section-title">{title}</h2>
        {onViewAll && (
          <button className="see-all" onClick={onViewAll}>
            View All →
          </button>
        )}
      </div>
      <div
        className="carousel-track"
        ref={ref}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onMouseMove={onMove}
      >
        {children}
      </div>
    </div>
  );
}

// ── HomePage 
function HomePage() {
  const [products, setProducts] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // testimonials drag
  const testiRef = useRef();
  const [tDrag, setTDrag] = useState(false);
  const [tStartX, setTStartX] = useState(0);
  const [tScroll, setTScroll] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    api.get("/products?limit=10")
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    api
      .get("/products/hot-deals")
      .then((res) => setHotDeals(res.data))
      .catch(() => {});

    const t = setTimeout(() => setShowPopup(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="home">
      {/* popup  */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="popup__close"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <img
              src="/images/banner/banner-sm-18.png"
              alt="Newsletter discount"
              className="popup__img"
              onError={handleImageError()}
            />
            <div className="popup__body">
              <h3>Subscribe to Our Newsletter</h3>
              <p>Save 20% on your first order with discount code today.</p>
              <div className="popup__form">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
              <span className="popup__skip" onClick={() => setShowPopup(false)}>
                Do not show this window
              </span>
            </div>
          </div>
        </div>
      )}
      <HeroSection />
      <Features />
      <CategoriesSection />
      <PopularProducts products={products} loading={loading} />
      <PromoBanner />
      <HotDeals hotDeals={hotDeals} />
      <DiscountBanner />

      {/*  Featured Products  */}
      <section className="section" style={{ background: "var(--gray-light)" }}>
        <div className="container">
          <DragCarousel
            title="Featured Products"
            onViewAll={() => navigate("/shop")}
            auto={true}
          >
            {[...products, ...products].map((p, i) => (
              <div key={`feat-${i}`} className="carousel-item">
                <ProductCard product={p} />
              </div>
            ))}
          </DragCarousel>
        </div>
      </section>

      <BlogSection />

      {/*  Testimonials  */}
      <section className="section testi-section">
        <div className="container">
          <div className="section__head">
            <h2 className="section-title">Client Testimonials</h2>
          </div>
          <div
            className="carousel-track"
            ref={testiRef}
            onMouseDown={(e) => {
              setTDrag(true);
              setTStartX(e.pageX - testiRef.current.offsetLeft);
              setTScroll(testiRef.current.scrollLeft);
              testiRef.current.style.cursor = "grabbing";
            }}
            onMouseUp={() => {
              setTDrag(false);
              if (testiRef.current) testiRef.current.style.cursor = "grab";
            }}
            onMouseLeave={() => {
              setTDrag(false);
              if (testiRef.current) testiRef.current.style.cursor = "grab";
            }}
            onMouseMove={(e) => {
              if (!tDrag) return;
              e.preventDefault();
              const x = e.pageX - testiRef.current.offsetLeft;
              testiRef.current.scrollLeft = tScroll - (x - tStartX) * 1.5;
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="carousel-item testi-item">
                <div className="testi-card">
                  <div className="testi-quote">"</div>
                  <p>{t.text}</p>
                  <div className="testi-user">
                    <img src={t.avatar} alt={t.name} onError={handleImageError(DEFAULT_AVATAR)} />
                    <div>
                      <h4>{t.name}</h4>
                      <span>{t.role}</span>
                    </div>
                    <div className="testi-stars">★★★★★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <InstagramSection />
      <NewsLetterSection />
    </div>
  );
}

export default HomePage;
