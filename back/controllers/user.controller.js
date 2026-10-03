const User = require("../models/user.model")

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar
    if (req.body.address) {
      user.address = {
        ...user.address?.toObject(),
        ...req.body.address,
      }
    }

    const updated = await user.save()

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      avatar: updated.avatar,
      address: updated.address,
      role: updated.role,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new password" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    next(err)
  }
}

// GET /api/users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json({ success: true, users, count: users.length })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile, updateProfile, changePassword, getAllUsers }
