require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const orderSocket = require("./sockets/orderSocket");

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

//  CORS CONFIG (FIXED)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// WEBHOOK 
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body;
    next();
  },
  require("./controllers/paymentController").handleWebhook
);

//  GLOBAL MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/restaurant-owner", require("./routes/restaurantOwnerRoutes"));
app.use("/api/payment", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);

// TEST ROUTES
app.get("/api/health", (req, res) =>
  res.json({ ok: true, ts: Date.now() })
);

app.get("/api/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

//  ERROR HANDLER
app.use(errorHandler);

//  SERVER + SOCKET.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

orderSocket(io);
app.set("io", io);

// START SERVER
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("🌐 CLIENT_URL:", process.env.CLIENT_URL);

    server.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  });