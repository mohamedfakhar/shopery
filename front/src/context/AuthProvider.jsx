import { useState } from "react"
import AuthContext from "./AuthContext"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null
    } catch {
      return null
    }
  })

  const login = (data) => {
    const userData = data?.user
      ? { ...data.user, token: data.token }
      : { ...data }
    if (data?.token) {
      localStorage.setItem("token", data.token)
    }
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
