export default function NewsLetterSection() {
  return (
    <>
      <section className="newsletter">
        <div className="container newsletter__inner">
          <div>
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get weekly updates on new products and deals.</p>
          </div>
          <div className="newsletter__form">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}
