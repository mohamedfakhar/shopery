const jwt  = require("jsonwebtoken")
const User = require("../models/user.model")

const protect = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized, no token" })

  try {
    const token = auth.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shopery_super_secret_jwt_key")
    req.user = await User.findById(decoded.id).select("-password")
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" })
    }
    next()
  } catch {
    res.status(401).json({ message: "Token invalid or expired" })
  }
}
  
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next()
  res.status(403).json({ message: "Admin access only" })
}

module.exports = { protect, adminOnly }
