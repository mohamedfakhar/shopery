const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },           
    regular_price:{ type: Number, required: true },
    sale_price:{ type: Number, default: null },
    on_sale:{ type: Boolean, default: false },
    sale_label:{ type: String, default: null },
    image: { type: String, default: "" },              
    thumbnail: { type: String, default: "" },
    images: [{ type: String }],
    categoryId:{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }, 
    category_id:{ type: String, default: "" },             
    in_stock:{ type: Boolean, default: true },
    stock_quantity:{ type: Number, default: null },
    rating: { type: Number, default: 0 },
    review_count:{ type: Number, default: 0 },
    is_hot_deal: { type: Boolean, default: false },
    hot_deal_ends_at:{ type: Date, default: null },
    brand:{ type: String, default: null },
    sku:{ type: String, default: null },
    tags:[{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
