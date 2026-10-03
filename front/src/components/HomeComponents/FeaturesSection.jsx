const FEATURES = [
  { icon: "fa-solid fa-truck", title: "Free Shipping", desc: "On orders over $100" },
  { icon: "fa-solid fa-headset", title: "Customer Support 24/7", desc: "Instant access to support" },
  { icon: "fa-solid fa-lock", title: "100% Secure Payment", desc: "We ensure your money is safe" },
  { icon: "fa-solid fa-rotate-left", title: "Money-Back Guarantee", desc: "30 days money-back guarantee" },
]
export default function Features() {
  return (
    <>
      <section className="features">
        <div className="container features__grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature__item">
              <span className="feature__icon">
                <i className={f.icon}></i>
              </span>
              <div className="Features-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
