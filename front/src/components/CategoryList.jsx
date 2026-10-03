import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../api/axios"
import { getImageUrl, handleImageError } from "../utils/imageHelper"
import "./CategoryList.css"

function CategoryList() {
  const [categories, setCategories] = useState([])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentCategory = searchParams.get("category_id") || "all"

  useEffect(() => {
    let isMounted = true
    api.get("/categories")
      .then(res => {
        if (isMounted) setCategories(res.data)
      })
      .catch(err => console.error("Error fetching categories:", err))
    return () => { isMounted = false }
  }, [])

  const handleClick = (slug) => {
    if (slug === "all") {
      navigate("/shop")
    } else {
      navigate(`/shop?category_id=${slug}`)
    }
  }

  return (
    <div className="catlist">
      <button
        className={`catlist__pill ${currentCategory === "all" ? "catlist__pill--active" : ""}`}
        onClick={() => handleClick("all")}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat._id}
          className={`catlist__pill ${currentCategory === cat.slug ? "catlist__pill--active" : ""}`}
          onClick={() => handleClick(cat.slug)}
        >
          {cat.image && (
            <img 
              src={getImageUrl(cat.image)} 
              alt={cat.name} 
              className="catlist__icon" 
              onError={handleImageError("/images/categories/image-fruits.png")}
            />
          )}
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryList