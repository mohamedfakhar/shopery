const express = require("express")
const router  = express.Router()
const { getAll, getHotDeals, getOne, create, update, remove, uploadImage } = require("../controllers/product.controller")
const { protect, adminOnly } = require("../middleware/auth.middleware")
const { productSchema, validate } = require("../middleware/validate.middleware")
const upload  = require("../middleware/upload.middleware")

// Static routes FIRST (before /:id)
router.get("/hot-deals", getHotDeals)

router.get("/",getAll)
router.get("/:id", getOne)
router.post("/", protect, adminOnly, validate(productSchema), create)
router.put("/:id", protect, adminOnly, update)
router.delete("/:id", protect, adminOnly, remove)

// image upload
router.post("/:id/upload-image", protect, adminOnly, upload.single("image"), uploadImage)

module.exports = router
