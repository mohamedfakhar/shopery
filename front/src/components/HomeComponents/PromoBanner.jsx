import { useNavigate } from "react-router-dom";
import { handleImageError } from "../../utils/imageHelper";

export default function PromoBanner() {
  const navigate = useNavigate();
  return (
    <section className="promos3">
      <div className="container promos3__grid">
        <div
          className="promo3__card promo3__card--blue"
          onClick={() => navigate("/shop")}
          style={{ cursor: "pointer" }}
        >
          <div className="promo3__text">
            <span>BEST DEALS</span>
            <h3>Sale Of The Month</h3>
            <button>Shop Now →</button>
          </div>
          <img
            src="/images/banner/banner-sm-03.png"
            alt="Sale Of The Month"
            onError={handleImageError()}
          />
        </div>
        <div
          className="promo3__card promo3__card--dark"
          onClick={() => navigate("/shop")}
          style={{ cursor: "pointer" }}
        >
          <div className="promo3__text">
            <span>85% FAT FREE</span>
            <h3>Low-Fat Meat</h3>
            <p>
              Started at <b>$79.99</b>
            </p>
            <button>Shop Now →</button>
          </div>
          <img
            src="/images/banner/banner-sm-01.png"
            alt="Low-Fat Meat"
            onError={handleImageError()}
          />
        </div>
        <div
          className="promo3__card promo3__card--yellow"
          onClick={() => navigate("/shop")}
          style={{ cursor: "pointer" }}
        >
          <div className="promo3__text">
            <span>SUMMER SALE</span>
            <h3>100% Fresh Fruit</h3>
            <p>
              Up to <b className="badge">64% OFF</b>
            </p>
            <button>Shop Now →</button>
          </div>
          <img
            src="/images/banner/banner-sm-02.png"
            alt="Fresh Fruit"
            onError={handleImageError()}
          />
        </div>
      </div>
    </section>
  );
}
