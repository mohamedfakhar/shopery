const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const Product = require("./models/product.model")
const Category = require("./models/category.model")
const User = require("./models/user.model")
const Order = require("./models/order.model")
const data = require("./shopery-clean-db-fixed.json")

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" DB Connected")

    await Product.deleteMany()
    await Category.deleteMany()
    await User.deleteMany()
    await Order.deleteMany()
    console.log(" Old data cleared (Products, Categories, Users, Orders)")

    // 1. Insert categories
    const insertedCategories = await Category.insertMany(
      data.categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        image: c.image,
        description: c.description || "",
      }))
    )
    console.log(` ${insertedCategories.length} categories inserted`)

    const catMap = {}
    insertedCategories.forEach((c) => {
      catMap[c.slug] = c._id
    })

    // 2. Create Admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@shopery.com",
      password: "admin123",
      role: "admin",
      avatar: "/images/user/img-01.png",
      phone: "(219) 555-0114",
      address: {
        street: "4140 Parker Rd.",
        city: "Allentown",
        state: "New Mexico",
        zip: "31134",
        country: "USA",
      },
    })
    console.log(" Admin created  →  admin@shopery.com / admin123")

    // 3. Create Demo Customer
    const customer = await User.create({
      name: "Dianne Russell",
      email: "user@shopery.com",
      password: "user123",
      role: "user",
      avatar: "/images/user/img-02.png",
      phone: "(219) 555-0199",
      address: {
        street: "123 Green Market St.",
        city: "Chicago",
        state: "Illinois",
        zip: "60601",
        country: "USA",
      },
    })
    console.log(" Demo Customer created  →  user@shopery.com / user123")

    // 4. Insert Products
    const insertedProducts = await Product.insertMany(
      data.products.map((p) => ({
        ...p,
        price: p.regular_price,
        image: p.thumbnail,
        categoryId: catMap[p.category_id] || null,
        createdBy: admin._id,
      }))
    )
    console.log(` ${insertedProducts.length} products inserted`)

    // 5. Create a sample initial order for the customer
    if (insertedProducts.length >= 2) {
      const p1 = insertedProducts[0]
      const p2 = insertedProducts[1]
      await Order.create({
        user: customer._id,
        orderItems: [
          {
            product: p1._id,
            name: p1.name,
            quantity: 2,
            price: p1.sale_price || p1.regular_price,
            image: p1.image,
          },
          {
            product: p2._id,
            name: p2.name,
            quantity: 1,
            price: p2.sale_price || p2.regular_price,
            image: p2.image,
          },
        ],
        shippingAddress: {
          firstName: "Dianne",
          lastName: "Russell",
          street: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          zip: customer.address.zip,
          country: customer.address.country,
          phone: customer.phone,
          email: customer.email,
        },
        paymentMethod: "Cash on Delivery",
        itemsPrice: (p1.sale_price || p1.regular_price) * 2 + (p2.sale_price || p2.regular_price),
        shippingPrice: 0,
        totalPrice: (p1.sale_price || p1.regular_price) * 2 + (p2.sale_price || p2.regular_price),
        status: "Processing",
      })
      console.log(" Sample demo order created for customer")
    }

    console.log(" Seeding complete successfully!")
    process.exit(0)
  })
  .catch((err) => {
    console.error(" Seed Error:", err)
    process.exit(1)
  })
