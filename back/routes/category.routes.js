const express = require("express")
const router  = express.Router()
const { getAll, getOne, create, update, remove } = require("../controllers/category.controller")
const { protect, adminOnly } = require("../middleware/auth.middleware")
const { categorySchema, validate } = require("../middleware/validate.middleware")

router.get("/", getAll)
router.get("/:id", getOne)
router.post("/", protect, adminOnly, validate(categorySchema), create)
router.put("/:id", protect, adminOnly, update)
router.delete("/:id", protect, adminOnly, remove)

module.exports = router
