require("dotenv").config()
const express = require("express")
const cors= require("cors")
const morgan = require("morgan")

const path = require("path")

const connectDB = require("./config/db")
const logger = require("./middleware/logger.middleware")
const errorHandler = require("./middleware/error.middleware")

const app = express()

// Middleware 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/images", express.static(path.join(__dirname, "uploads")))

// Morgan + custom logger
app.use(morgan("dev"))
app.use(logger)

//  Routes 
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/categories", require("./routes/category.routes"))
app.use("/api/products", require("./routes/product.routes"))
app.use("/api/users", require("./routes/user.routes"))
app.use("/api/orders", require("./routes/order.routes"))

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// Global Error Handler 
app.use(errorHandler)

//  DB + Server 
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(` Server running on http://localhost:${process.env.PORT || 5000}`)
  )
})
