const Order = require("../models/order.model")
const Product = require("../models/product.model")

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = "Cash on Delivery",
      couponCode = "",
      orderNotes = "",
    } = req.body

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" })
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: "Complete shipping address is required" })
    }

    // Verify each product against DB to prevent price tampering
    const verifiedOrderItems = []
    let calculatedItemsPrice = 0

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product)
      if (!dbProduct) {
        return res.status(400).json({ message: `Product not found: ${item.name || item.product}` })
      }

      const unitPrice = dbProduct.on_sale && dbProduct.sale_price ? dbProduct.sale_price : dbProduct.regular_price
      const quantity = Math.max(1, parseInt(item.quantity) || 1)
      calculatedItemsPrice += unitPrice * quantity

      verifiedOrderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.image || dbProduct.thumbnail || item.image || "",
        price: unitPrice,
        quantity,
      })
    }

    calculatedItemsPrice = Number(calculatedItemsPrice.toFixed(2))

    // Handle coupon verification on backend
    let discountAmount = 0
    if (couponCode && couponCode.trim().toUpperCase() === "SHOPERY10") {
      discountAmount = Number(((calculatedItemsPrice * 10) / 100).toFixed(2))
    }

    const calculatedShippingPrice = calculatedItemsPrice > 50 ? 0 : 10
    const calculatedTotalPrice = Number(Math.max(0, calculatedItemsPrice - discountAmount + calculatedShippingPrice).toFixed(2))

    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: calculatedItemsPrice,
      shippingPrice: calculatedShippingPrice,
      taxPrice: 0,
      totalPrice: calculatedTotalPrice,
      orderStatus: "Processing",
      status: "Processing",
      orderNotes,
    })

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      _id: order._id,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({
      success: true,
      orders,
      count: orders.length,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check authorization: must be the owner or an admin
    const isOwner = order.user && order.user._id.equals(req.user._id)
    const isAdmin = req.user.role === "admin"

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" })
    }

    res.json({
      success: true,
      order,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/all (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      orders,
      count: orders.length,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, status } = req.body
    const newStatus = orderStatus || status

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"]
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({
        message: `Invalid status. Valid values: ${validStatuses.join(", ")}`,
      })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.orderStatus = newStatus
    order.status = newStatus

    if (newStatus === "Delivered") {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    const updated = await order.save()

    res.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
      order: updated,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/admin/stats (Admin)
const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments()
    const processingOrders = await Order.countDocuments({ status: "Processing" })
    const shippedOrders = await Order.countDocuments({ status: "Shipped" })
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" })
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" })

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ])
    const totalRevenue = revenueResult[0]?.totalRevenue || 0

    res.json({
      totalOrders,
      totalSales: Number(totalRevenue.toFixed(2)),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      statusCounts: {
        Processing: processingOrders,
        Shipped: shippedOrders,
        Delivered: deliveredOrders,
        Cancelled: cancelledOrders,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
}
