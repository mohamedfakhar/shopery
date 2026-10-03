import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getImageUrl, handleImageError } from "../../utils/imageHelper";

const DEFAULT_CATEGORIES = [
  { name: "Fresh Fruit", slug: "fresh-fruit", image: "/images/categories/image-fruits.png" },
  { name: "Fresh Vegetables", slug: "fresh-vegetables", image: "/images/categories/image-icon-vegitables.png" },
  { name: "Meat & Fish", slug: "meat-fish", image: "/images/categories/image-meat.png" },
  { name: "Snacks", slug: "snacks", image: "/images/categories/image-icon-snaks.png" },
  { name: "Beverages", slug: "beverages", image: "/images/categories/img-12.png" },
  { name: "Beauty & Health", slug: "beauty-health", image: "/images/categories/image-icon-beauty.png" },
  { name: "Bread & Bakery", slug: "bread-bakery", image: "/images/categories/image-icon-snaks2.png" },
  { name: "Baking Needs", slug: "baking-needs", image: "/images/categories/img-06.png" },
  { name: "Cooking", slug: "cooking", image: "/images/categories/img-07.png" },
  { name: "Diabetic Food", slug: "diabetic-food", image: "/images/categories/img-08.png" },
  { name: "Dish Detergents", slug: "dish-detergents", image: "/images/categories/image-soda.png" },
  { name: "Oil", slug: "oil", image: "/images/categories/image-oil.png" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    api.get("/categories")
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <h2 className="section-title">Popular Categories</h2>
          <button className="see-all" onClick={() => navigate("/shop")}>
            View All →
          </button>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <div
              key={cat.slug || cat._id}
              className="cat-card"
              onClick={() => navigate(`/shop?category_id=${cat.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="cat-card__img">
                <img 
                  src={getImageUrl(cat.image || cat.img, "/images/categories/image-fruits.png")} 
                  alt={cat.name} 
                  onError={handleImageError("/images/categories/image-fruits.png")}
                />
              </div>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
