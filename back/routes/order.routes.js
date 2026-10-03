const express = require("express")
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/order.controller")
const { protect, adminOnly } = require("../middleware/auth.middleware")

// Customer routes
router.post("/", protect, createOrder)
router.get("/my-orders", protect, getMyOrders)

// Admin routes (static paths before dynamic /:id)
router.get("/admin/stats", protect, adminOnly, getOrderStats)
router.get("/admin/all", protect, adminOnly, getAllOrders)
router.get("/all", protect, adminOnly, getAllOrders)
router.put("/:id/status", protect, adminOnly, updateOrderStatus)

// Single order route
router.get("/:id", protect, getOrderById)

module.exports = router
