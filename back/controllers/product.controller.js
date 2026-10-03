const mongoose = require("mongoose")
const Product = require("../models/product.model")

// GET /api/products  
const getAll = async (req, res, next) => {
  try {
    const {
      category_id,
      search,
      on_sale,
      hot_deal,
      min_price,
      max_price,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query

    const filter = {}

    if (category_id && category_id !== "all") {
      if (mongoose.Types.ObjectId.isValid(category_id)) {
        filter.$or = [{ categoryId: category_id }, { category_id }]
      } else {
        filter.category_id = category_id
      }
    }

    if (on_sale) filter.on_sale = on_sale === "true"
    if (hot_deal) filter.is_hot_deal = hot_deal === "true"
    if (search) filter.name = { $regex: search, $options: "i" }

    if (min_price || max_price) {
      filter.regular_price = {}
      if (min_price) filter.regular_price.$gte = Number(min_price)
      if (max_price) filter.regular_price.$lte = Number(max_price)
    }

    let sortOption = { createdAt: -1 }
    if (sort === "price_asc") sortOption = { regular_price: 1 }
    else if (sort === "price_desc") sortOption = { regular_price: -1 }
    else if (sort === "rating") sortOption = { rating: -1 }
    else if (sort === "name_asc") sortOption = { name: 1 }

    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .populate("categoryId", "name slug")
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .sort(sortOption)

    res.json({ total, page: Number(page), pages: Math.ceil(total / limit) || 1, products })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/hot-deals
const getHotDeals = async (req, res, next) => {
  try {
    const products = await Product.find({ is_hot_deal: true })
      .populate("categoryId", "name slug")
    res.json(products)
  } catch (err) {
    next(err)
  }
}

// GET /api/products/:id
const getOne = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
    const product = isObjectId
      ? await Product.findById(req.params.id).populate("categoryId", "name slug")
      : await Product.findOne({ slug: req.params.id }).populate("categoryId", "name slug")

    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

// POST /api/products
const create = async (req, res, next) => {
  try {
    const rawPrice = Number(req.body.price || req.body.regular_price) || 0
    const regularPrice = Number(req.body.regular_price || req.body.price) || 0
    const generatedSlug = (req.body.slug || req.body.name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4)

    const product = await Product.create({
      ...req.body,
      slug: req.body.slug ? req.body.slug.toLowerCase().trim() : generatedSlug,
      price: rawPrice,
      regular_price: regularPrice,
      image: req.body.image || req.body.thumbnail || "/images/products/img-01.png",
      thumbnail: req.body.thumbnail || req.body.image || "/images/products/img-01.png",
      createdBy: req.user._id,
    })
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

// PUT /api/products/:id
const update = async (req, res, next) => {
  try {
    const updateData = { ...req.body }
    if (updateData.price && !updateData.regular_price) updateData.regular_price = updateData.price
    if (updateData.regular_price && !updateData.price) updateData.price = updateData.regular_price

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/products/:id
const remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    next(err)
  }
}

// POST /api/products/:id/upload-image
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    const imageUrl = `/uploads/${req.file.filename}`
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { image: imageUrl, thumbnail: imageUrl },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: "Product not found" })

    res.json({ message: "Image uploaded successfully", image: imageUrl, product })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getHotDeals, getOne, create, update, remove, uploadImage }
