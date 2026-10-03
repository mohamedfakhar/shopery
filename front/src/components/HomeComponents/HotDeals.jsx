import banner from "../../assets/images/banner.png"
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";
import { FaStar, FaRegStar } from "react-icons/fa";
export default function HotDeals({ hotDeals }) {
    const navigate = useNavigate()
  return (
    <>
      {hotDeals.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">
              Hot Deals
              <span onClick={() => navigate("/shop")}>View All →</span>
            </h2>
            <div className="hot-deals">
              <div className="hot-deals__banner">
                <img src={banner} alt="banner" />
                <div className="banner-content">
                  <div className="banner-tags">
                    <span className="tag tag-sale">Sale 50%</span>
                    <span className="tag tag-best">Best Sale</span>
                  </div>
                  <button className="add-to-cart">Add To Cart 🛒</button>
                  <h3>Chinese Cabbage</h3>
                  <p className="price">
                    $14.99 <span className="old-price">$24.00</span>
                  </p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < 4 ? (
                          <FaStar color="gold" />
                        ) : (
                          <FaRegStar color="gold" />
                        )}
                      </span>
                    ))}
                    <span className="feedback">(524 Feedback)</span>
                  </div>
                  <div className="countdown">The countdown is finished!</div>
                </div>
              </div>
              <div className="hot-deals__grid">
                {hotDeals.map((p) => (
                  <div key={p._id} className="grid-item">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
