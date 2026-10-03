import discountBanner from "../../assets/images/discountBanner.png"
import { useNavigate } from "react-router-dom";


export default function DiscountBanner() {
    const navigate = useNavigate()
  return (
    <>
      <section className="section discount-banner-section">
        <div className="container">
          <div className="discount-banner">
            <img
              src={discountBanner}
              alt="Summer Sale - 37% OFF"
              className="discount-banner__img"
            />
            <div className="discount-banner__content">
              <p className="discount-banner__sub">SUMMER SALE</p>
              <h2 className="discount-banner__title">
                <span className="discount-banner__percent">37%</span> OFF
              </h2>
              <p className="discount-banner__desc">
                Free on all your order, Free Shipping and 30 days money-back
                guarantee
              </p>
              <button
                className="discount-banner__btn"
                onClick={() => navigate("/shop")}
              >
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
