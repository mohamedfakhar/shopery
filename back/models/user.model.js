const mongoose = require("mongoose")
const bcrypt   = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:{ type: String, required: true },
  avatar:{ type: String, default: "" },
  phone:{ type: String, default: "" },
  role:{ type: String, enum: ["user", "admin"], default: "user" },
  address: {
    street:{ type: String, default: "" },
    city:{ type: String, default: "" },
    state:{ type: String, default: "" },
    zip:{ type: String, default: "" },
    country:{ type: String, default: "" },
  },
}, { timestamps: true })

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// compare password helper
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model("User", userSchema)
