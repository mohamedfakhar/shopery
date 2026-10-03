import { useState } from "react"
import { FiMapPin, FiMail, FiPhone, FiClock, FiSend } from "react-icons/fi"
import { useToast } from "../context/ToastContext"
import "./ContactPage.css"

export default function ContactPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields.", "error")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      showToast("Thank you! Your demo message has been received.", "success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 600)
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header text-center">
          <span className="contact-badge">Get in Touch</span>
          <h1>We’d Love to Hear From You</h1>
          <p>Have questions about our fresh produce or need assistance with your order? Our team is here to help.</p>
        </div>

        <div className="contact-layout">
          {/* Left Cards: Contact Info */}
          <div className="contact-cards-col">
            <div className="contact-info-card">
              <div className="icon-wrap"><FiMapPin size={24} /></div>
              <h3>Visit Our Store</h3>
              <p>123 Organic Lane, Green Oasis District<br />Cairo, Egypt</p>
            </div>

            <div className="contact-info-card">
              <div className="icon-wrap"><FiPhone size={24} /></div>
              <h3>Call Us</h3>
              <p>Support: +20 (2) 2345 6789<br />Toll-Free: 1800-SHOPERY</p>
            </div>

            <div className="contact-info-card">
              <div className="icon-wrap"><FiMail size={24} /></div>
              <h3>Email Us</h3>
              <p>support@shopery.com<br />orders@shopery.com</p>
            </div>

            <div className="contact-info-card">
              <div className="icon-wrap"><FiClock size={24} /></div>
              <h3>Operating Hours</h3>
              <p>Monday – Saturday: 9:00 AM – 9:00 PM<br />Sunday: 10:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we will get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="req">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address <span className="req">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </div>

              <div className="form-group">
                <label>Message <span className="req">*</span></label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your questions or feedback here..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? "Sending Message..." : (
                  <>
                    <FiSend size={16} /> Send Message
                  </>
                )}
              </button>
              <p style={{ fontSize: "12px", color: "#888", margin: "8px 0 0" }}>
                ℹ️ Demo inquiry form — messages are handled client-side for portfolio demonstration.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
