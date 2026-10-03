import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../api/axios"
import ProductCard  from "../components/ProductCard"
import CategoryList from "../components/CategoryList"
import "./ShopPage.css"

function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  const category_id = searchParams.get("category_id") || ""
  const search  = searchParams.get("search") || ""

  useEffect(() => {
    setLoading(true)
    api.get("/products", { params: { category_id, search, page, limit: 12 } })
      .then(res => {
        setProducts(res.data.products || [])
        setTotal(res.data.total || 0)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load products:", err)
        setProducts([])
        setTotal(0)
        setLoading(false)
      })
  }, [category_id, search, page])

  return (
    <div className="shop">

      {/* Header Banner */}
      <div className="shop__banner">
        <div className="container">
          <h1>Our Shop</h1>
          <p>Home / Shop</p>
        </div>
      </div>

      <div className="container shop__body">

        {/* Sidebar */}
        <aside className="shop__sidebar">
          <div className="sidebar__section">
            <h4>Categories</h4>
            <CategoryList />
          </div>

          <div className="sidebar__section">
            <h4>Filter by Price</h4>
            <div className="sidebar__price">
              <input type="range" min="0" max="500" defaultValue="500" />
              <p>Max: $500</p>
            </div>
          </div>
        </aside>

        {/* Products */}
        <main className="shop__main">

          {/* Toolbar */}
          <div className="shop__toolbar">
            <p className="shop__count">{total} Results found</p>
            <div className="shop__search">
              <input
                placeholder="Search..."
                value={search}
                onChange={e => {
                  const val = e.target.value;
                  const newParams = {};
                  if (category_id) newParams.category_id = category_id;
                  if (val) newParams.search = val;
                  setSearchParams(newParams);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="shop__loading">Loading...</div>
          ) : products.length === 0 ? (
            <div className="shop__empty">No products found</div>
          ) : (
            <div className="shop__grid">
              {products.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="shop__pagination">
            <button
              className="page__btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Prev
            </button>
            <span className="page__current">Page {page}</span>
            <button
              className="page__btn"
              disabled={products.length < 12}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}

export default ShopPage