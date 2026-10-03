import { handleImageError } from "../../utils/imageHelper";

const BLOGS = [
  { date: "18", month: "NOV", cat: "Food", title: "Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.", img: "/images/blogs/blog-01.png" },
  { date: "18", month: "NOV", cat: "Food", title: "Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.", img: "/images/blogs/blog-02.png" },
  { date: "18", month: "NOV", cat: "Food", title: "Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.", img: "/images/blogs/blog-03.png" },
];

export default function BlogSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <h2 className="section-title">Latest News</h2>
          <button className="see-all">View All →</button>
        </div>
        <div className="blog-grid">
          {BLOGS.map((b, i) => (
            <div key={i} className="blog-card">
              <div className="blog-img">
                <img src={b.img} alt={b.title} onError={handleImageError()} />
                <div className="blog-date">
                  <span>{b.date}</span>
                  <span>{b.month}</span>
                </div>
              </div>
              <div className="blog-body">
                <div className="blog-meta">
                  <span>{b.cat}</span>
                  <span>By Admin</span>
                  <span>65 Comments</span>
                </div>
                <p>{b.title}</p>
                <button className="blog-read">Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
