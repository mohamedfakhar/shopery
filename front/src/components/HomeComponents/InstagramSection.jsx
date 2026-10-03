import { FaInstagram } from "react-icons/fa";
import { handleImageError } from "../../utils/imageHelper";

const INSTAGRAM = [
  "/images/instagram/img-01.jpg",
  "/images/instagram/img-02.png",
  "/images/instagram/img-03.png",
  "/images/instagram/img-04.png",
  "/images/instagram/img-05.png",
  "/images/instagram/img-06.png",
];

export default function InstagramSection() {
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <h2
          className="section-title"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          Follow Us On Instagram
        </h2>
      </div>
      <div className="instagram-grid">
        {INSTAGRAM.map((img, i) => (
          <div key={i} className="instagram-item">
            <img src={img} alt="Instagram" onError={handleImageError()} />
            <div className="instagram-overlay">
              <FaInstagram size={24} color="#fff" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
