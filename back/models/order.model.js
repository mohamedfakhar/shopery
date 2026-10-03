const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, default: "" },
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "Egypt" },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    orderNotes: {
      type: String,
      default: "",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// Pre-save to synchronize status and orderStatus, and names
orderSchema.pre("save", function (next) {
  if (this.orderStatus && !this.status) {
    this.status = this.orderStatus
  } else if (this.status && !this.orderStatus) {
    this.orderStatus = this.status
  } else if (this.isModified("orderStatus")) {
    this.status = this.orderStatus
  } else if (this.isModified("status")) {
    this.orderStatus = this.status
  }

  if (this.shippingAddress) {
    if (!this.shippingAddress.fullName && (this.shippingAddress.firstName || this.shippingAddress.lastName)) {
      this.shippingAddress.fullName = `${this.shippingAddress.firstName || ""} ${this.shippingAddress.lastName || ""}`.trim()
    }
  }
  next()
})

module.exports = mongoose.model("Order", orderSchema)
