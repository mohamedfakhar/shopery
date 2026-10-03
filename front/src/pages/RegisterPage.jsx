import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/useAuth"
import "./AuthPage.css"

function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading]= useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/auth/register", { name, email, password })
      login(res.data)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth__card">
        <div className="auth__logo">Shopery</div>
        <h2>Create Account</h2>
        <p className="auth__sub">Join us and start shopping</p>

        {error && <div className="auth__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth__form">
          <div className="auth__field">
            <label>Full Name</label>
            <input type="text" value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name" required />
          </div>
          <div className="auth__field">
            <label>Email Address</label>
            <input type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com" required />
          </div>
          <div className="auth__field">
            <label>Password</label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters" required />
          </div>
          <button type="submit" className="auth__btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth__switch">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage