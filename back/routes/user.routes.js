const express = require("express")
const router = express.Router()
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} = require("../controllers/user.controller")
const { protect, adminOnly } = require("../middleware/auth.middleware")

router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)
router.put("/change-password", protect, changePassword)
router.get("/", protect, adminOnly, getAllUsers)

module.exports = router
