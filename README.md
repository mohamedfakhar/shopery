# Shopery

A modern full-stack e-commerce web application.

Shopery is a portfolio demo e-commerce application designed and engineered to showcase a production-grade full-stack architecture. It features a responsive React storefront, a secure Node.js/Express REST API backend, and persistent MongoDB document storage, incorporating real-world authentication, cart and wishlist workflows, dynamic checkout, order lifecycle management, and a complete administrative control center.

---

## 🌐 Demo & Status

* **Status:** Portfolio Demo — Local Development
* **Environment:** Fully functional locally with automated database seeding, integrated REST API communication, and zero build errors.

---

## ✨ Features

### 🛒 Customer Features
* **User Authentication & Authorization:** Secure registration and login workflows issuing JSON Web Tokens (JWT).
* **Catalog Browsing:** Browse organic grocery and produce catalog with dynamic category navigation.
* **Category Filtering:** Filter products dynamically by category with instant catalog updates.
* **Search Functionality:** Real-time search query matching across product names and descriptions.
* **Product Sorting:** Multi-criteria sorting (Price: Low to High, Price: High to Low, Top Rated, Newest, Name).
* **Product Details:** Dedicated product view with detailed descriptions, localized high-res imagery, rating stars, and live stock indicators.
* **Shopping Cart:** Add-to-cart functionality, dynamic item quantity management, real-time subtotal calculation, coupon discounts (`SHOPERY10`), and free shipping thresholds.
* **Wishlist Management:** Persistent wishlist drawer and card toggles with direct migration to the shopping cart.
* **Streamlined Checkout:** Checkout workflow with billing address capture and Cash on Delivery (COD) order placement.
* **Order Creation & Success Screen:** Instant order generation with auto-generated order IDs and detailed confirmation breakdowns.
* **Order History & Tracking:** Customer order timeline with itemized receipts, delivery status badges (`Processing`, `Shipped`, `Delivered`, `Cancelled`), and order dates.
* **Customer Profile:** View and update personal profile details, contact information, and shipping address.
* **Password Management:** Secure in-app password update requiring verification of current credentials.
* **Responsive UI:** Fully responsive design crafted with clean, modern CSS ensuring seamless user experiences across mobile, tablet, and desktop screens.

### 🛡️ Admin Features
* **Admin Authentication & Guarding:** Role-based access control (RBAC) ensuring administrative routes and views are strictly restricted to administrators.
* **Analytics Dashboard:** Live business metrics calculating total gross revenue, overall order count, catalog inventory volume, and customer accounts.
* **Product Management (CRUD):** Add new catalog items with category bindings, pricing, and stock quotas, and remove discontinued products.
* **Category Management (CRUD):** Create and delete product categories with automatic slugification and image assignment.
* **Order Management & Lifecycle:** Complete order oversight allowing administrators to inspect order contents and transition statuses (`Processing` → `Shipped` → `Delivered` / `Cancelled`).
* **User Management:** Directory of registered customer accounts with contact details and assigned permission roles.

---

## 🔒 Security Architecture

The application enforces security-first design principles across both frontend and backend layers:

* **Stateless JWT Authentication:** Access tokens are signed using cryptographic secrets and verified on every protected API route via HTTP Bearer headers.
* **Role-Based Access Control (RBAC):** Backend route guards (`isAdmin`) intercept administrative endpoints (`/api/orders/all`, `/api/orders/admin/stats`, `/api/products` [POST/DELETE], `/api/categories` [POST/DELETE], `/api/users`), preventing unauthorized privilege escalation.
* **Server-Side Order Price Recalculation (Anti-Tampering):** To eliminate client-side price manipulation risks, order subtotals, item unit prices, and final grand totals are calculated authoritatively on the server by querying the verified database price for each product ID. Any client-sent price values are disregarded.
* **Cross-User Order Isolation:** Strict customer data isolation ensures users can query only their own orders (`/api/orders/my-orders`). Accessing individual orders by ID verifies ownership before returning data.
* **Password Hashing:** User passwords are encrypted using `bcryptjs` (10 salt rounds) with pre-save Mongoose middleware hooks to guard against plaintext leaks or double-hashing.
* **Input Validation & Sanitization:** Incoming request payloads for registration, authentication, and catalog mutations are validated using `Joi` schema validators before database interaction.
* **HTTP 401 & 403 Response Handling:** Strict standard error codes distinguish unauthenticated requests (401 Unauthorized) from forbidden administrative requests (403 Forbidden).
* **Protected Environment Variables:** Sensitive secrets (`JWT_SECRET`, `MONGO_URI`, `PORT`) are isolated in local `.env` files and strictly excluded from Git tracking via `.gitignore`.

---

## 🛠️ Tech Stack

### Frontend
* **React 18** — Component-driven declarative UI library
* **JavaScript (ES6+)** — Modern clientside logic and state handling
* **Vite** — Next-generation frontend build tool and development server
* **React Router DOM (v7)** — Clientside single-page application routing and route guards
* **Axios** — Promise-based HTTP client with automatic Bearer token injection
* **Context API** — Global state management for authentication, shopping cart, wishlist, and toast alerts
* **Vanilla CSS** — Custom responsive design system with CSS custom properties and zero third-party UI framework bloat

### Backend
* **Node.js** — Asynchronous event-driven JavaScript runtime
* **Express.js** — RESTful web API framework
* **MongoDB** — NoSQL document database
* **Mongoose** — Object Data Modeling (ODM) library for MongoDB
* **JSON Web Tokens (`jsonwebtoken`)** — Stateless authentication and access tokens
* **bcryptjs** — Cryptographic password hashing
* **Joi** — Schema description language and data validator
* **Multer** — Multipart/form-data middleware for image handling

---

## 📐 System Architecture

```text
React Frontend (Vite)
      │
      │ REST API / HTTP Requests (Axios)
      │ [Bearer JWT in Authorization Header]
      ▼
Node.js + Express Backend
      ├── Security & CORS Middleware
      ├── JWT Authentication & RBAC Guards
      ├── Joi Payload Validation
      ├── Server-Side Price Recalculation Engine
      └── Controller & Route Handlers
      │
      │ Mongoose ODM
      ▼
MongoDB Database
      ├── Users Collection (Hashed Credentials & Roles)
      ├── Products Collection (Catalog & Inventory)
      ├── Categories Collection (Taxonomy)
      └── Orders Collection (Authoritative Financial Data)
```

The frontend application issues asynchronous REST API calls via a configured Axios instance. When authenticated, requests automatically inject the stored JWT token. The Express server validates credentials, enforces role authorization, verifies business rules (such as server-side price lookups), and communicates with MongoDB via Mongoose models before returning JSON responses.

---

## 📂 Project Structure

```text
shopery/
│
├── front/                          # React + Vite Frontend
│   ├── public/
│   │   ├── images/                 # Localized product, category, and banner images
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios client with interceptors
│   │   ├── components/             # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/                # React Context state providers (Auth, Cart, Wishlist, Toast)
│   │   ├── pages/                  # Route views (Home, Shop, Product, Cart, Checkout, Admin, etc.)
│   │   ├── utils/                  # Helper utilities (image helpers, formatters)
│   │   ├── App.jsx                 # Route configurations and layout wrapper
│   │   ├── index.css               # Design tokens and global CSS
│   │   └── main.jsx                # Application root entry point
│   ├── .env.example                # Frontend environment template
│   ├── package.json
│   └── vite.config.js
│
├── back/                           # Node.js + Express + MongoDB Backend
│   ├── config/
│   │   └── db.js                   # Mongoose connection configuration
│   ├── controllers/                # Business logic controllers
│   │   ├── auth.controller.js      # Register, login, token generation
│   │   ├── category.controller.js  # Category retrieval and management
│   │   ├── order.controller.js     # Order placement, price verification, stats
│   │   ├── product.controller.js   # Catalog queries, filters, sorting, CRUD
│   │   └── user.controller.js      # User profile, password update, admin list
│   ├── middleware/                 # JWT authentication, role guards, Joi validation
│   ├── models/                     # Mongoose schemas (User, Product, Category, Order)
│   ├── routes/                     # API route declarations
│   ├── uploads/                    # Directory for user-uploaded product images
│   ├── seed.js                     # Automated database seeding utility
│   ├── index.js                    # Express application entry point
│   ├── .env.example                # Backend environment template
│   └── package.json
│
├── .gitignore                      # Comprehensive repository ignore rules
└── README.md                       # Master project documentation
```

---

## 🚀 Installation & Local Setup

### Prerequisites
* **Node.js** (v18.x or v20.x recommended)
* **npm** (v9.x or newer)
* **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### 1. Clone the Repository
```bash
git clone https://github.com/mohamedfakhar/shopery.git
cd shopery
```

---

### 2. Backend Setup
1. Navigate to the `back/` folder:
   ```bash
   cd back
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to create `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt use `copy .env.example .env`)*

   Default configuration in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/shopery
   JWT_SECRET=shopery_super_secret_jwt_key
   ```

3. Seed the database:
   Populate MongoDB with default categories, organic products, test customer, and demo administrator:
   ```bash
   node seed.js
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will start on `http://localhost:5000`.*

---

### 3. Frontend Setup
1. Open a new terminal window and navigate to `front/`:
   ```bash
   cd front
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to create `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt use `copy .env.example .env`)*

   Default configuration in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The storefront will launch on `http://localhost:5173`.*

---

## 🔑 Demo Accounts

The automated database seeder provides two verified local testing accounts:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@shopery.com` | `admin123` | Full access to Admin Dashboard (`/admin`), product CRUD, category CRUD, order management, and revenue analytics. |
| **Customer** | `user@shopery.com` | `user123` | Storefront browsing, wishlist, shopping cart, checkout, and order history (`/profile`). |

> [!NOTE]
> The credentials above are provided solely for local demonstration and evaluation purposes.

---

## 📡 API Overview

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate credentials and return JWT token | Public |

### 🥦 Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve list of all categories | Public |
| `POST` | `/api/categories` | Create a new category | Admin only |
| `DELETE` | `/api/categories/:id` | Remove a category | Admin only |

### 🍎 Products (`/api/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve catalog with pagination, search, category filter, price range, and sorting | Public |
| `GET` | `/api/products/hot-deals` | Retrieve promotional products with discounts | Public |
| `GET` | `/api/products/:id` | Retrieve single product details | Public |
| `POST` | `/api/products` | Create a new catalog product | Admin only |
| `DELETE` | `/api/products/:id` | Delete a product | Admin only |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order with server-side price recalculation | Authenticated User |
| `GET` | `/api/orders/my-orders` | Retrieve authenticated user's order history | Authenticated User |
| `GET` | `/api/orders/:id` | Retrieve specific order details | Order Owner or Admin |
| `GET` | `/api/orders/all` | List all system orders | Admin only |
| `PUT` | `/api/orders/:id/status` | Update order fulfillment status | Admin only |
| `GET` | `/api/orders/admin/stats` | Retrieve revenue and order summary analytics | Admin only |

### 👤 Users (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Retrieve profile of authenticated user | Authenticated User |
| `PUT` | `/api/users/profile` | Update profile information and address | Authenticated User |
| `PUT` | `/api/users/change-password` | Update account password with current verification | Authenticated User |
| `GET` | `/api/users` | List all registered user accounts | Admin only |

---

## 🧪 Testing & Verification

* **Integration Testing:** 36 automated integration tests passed (0 failed), covering authentication, category filtering, catalog search and sorting, order creation, server-side price recalculation, customer order isolation, admin guards (403 Forbidden verification), and status transitions.
* **Frontend Production Build:** Verified with Vite `npm run build` — completed with 0 compilation errors and 0 warnings.
* **Backend Verification:** Verified Express server startup, clean MongoDB connection, and static media serving.

---

## 👤 Author

**Mohamed Elshahat Ibrahim**
* **GitHub:** [@mohamedfakhar](https://github.com/mohamedfakhar)
* **LinkedIn:** [Mohamed Fakhr](https://www.linkedin.com/in/mohamed-fakhr)

---

## 📄 License

This project is licensed under the MIT License — feel free to explore, learn from, and adapt for personal or educational use.
