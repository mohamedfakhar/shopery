const Category = require("../models/category.model")

// GET /api/categories
const getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    next(err)
  }
}

// GET /api/categories/:id
const getOne = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    res.json(category)
  } catch (err) {
    next(err)
  }
}

// POST /api/categories
const create = async (req, res, next) => {
  try {
    const slug = (req.body.slug || req.body.name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const category = await Category.create({
      ...req.body,
      slug,
      image: req.body.image || "/images/categories/image-fruits.png",
    })
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

// PUT /api/categories/:id
const update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!category) return res.status(404).json({ message: "Category not found" })
    res.json(category)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/categories/:id
const remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    res.json({ message: "Category deleted successfully" })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getOne, create, update, remove }
