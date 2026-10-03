import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";

export default function PopularProducts({loading, products}) {
    const navigate = useNavigate()
  return (
    <>
      <section className="section" style={{ background: "var(--gray-light)" }}>
        <div className="container">
          <div className="section__head">
            <h2 className="section-title">Popular Products</h2>
            <button className="see-all" onClick={() => navigate("/shop")}>
              View All →
            </button>
          </div>
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gray)" }}>Loading...</p>
          ) : (
            <div className="pop-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
