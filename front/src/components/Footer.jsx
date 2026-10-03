import { Link } from "react-router-dom"
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi"
import { handleImageError } from "../utils/imageHelper"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">

        {/* Logo + desc */}
        <div className="footer__col">
          <h3 className="footer__logo">Shopery</h3>
          <p className="footer__desc">
            Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui,
            eget bibendum magna congue nec.
          </p>
          <p className="footer__contact">
            <b>(219) 555-0114</b>  or  <b>proxy@gmail.com</b>
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook"><FiFacebook size={18}/></a>
            <a href="#" aria-label="Twitter"><FiTwitter  size={18}/></a>
            <a href="#" aria-label="Instagram"><FiInstagram size={18}/></a>
            <a href="#" aria-label="YouTube"><FiYoutube  size={18}/></a>
          </div>
        </div>

        {/* My Account */}
        <div className="footer__col">
          <h4>My Account</h4>
          <ul>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/profile">Order History</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>

        {/* Helps */}
        <div className="footer__col">
          <h4>About & Support</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/about">FAQ & Policies</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer__col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/shop?category_id=fresh-fruit">Fruit & Vegetables</Link></li>
            <li><Link to="/shop?category_id=meat-fish">Meat & Fish</Link></li>
            <li><Link to="/shop?category_id=bread-bakery">Bread & Bakery</Link></li>
            <li><Link to="/shop?category_id=beauty-health">Beauty & Health</Link></li>
            <li><Link to="/shop?category_id=beverages">Beverages</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>Shopery eCommerce © {new Date().getFullYear()}. All Rights Reserved</p>
          <div className="footer__payments">
            <img src="/images/brand-icon/img-01.png" alt="Payment method" onError={handleImageError()}/>
            <img src="/images/brand-icon/img-02.png" alt="Payment method" onError={handleImageError()}/>
            <img src="/images/brand-icon/img-03.png" alt="Payment method" onError={handleImageError()}/>
            <img src="/images/brand-icon/img-04.png" alt="Payment method" onError={handleImageError()}/>
            <img src="/images/brand-icon/img-05.png" alt="Payment method" onError={handleImageError()}/>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer