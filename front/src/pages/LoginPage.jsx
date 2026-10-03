import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/useAuth"
import "./AuthPage.css"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/auth/login", { email, password })
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
        <h2>Welcome Back</h2>
        <p className="auth__sub">Sign in to your account</p>

        {error && <div className="auth__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth__form">
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
              placeholder="••••••••" required />
          </div>
          <button type="submit" className="auth__btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth__switch">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage