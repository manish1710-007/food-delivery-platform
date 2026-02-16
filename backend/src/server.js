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
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body;
    next();
  },
  require("./controllers/paymentController").handleWebhook  
);




// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/restaurant-owner", require("./routes/restaurantOwnerRoutes"));
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (req, res) =>
  res.json({ ok: true, ts: Date.now() })
);

app.get("/api/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

//ERROR HANDLER
app.use(errorHandler);


// SERVER + SOCKET.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

orderSocket(io);
app.set("io", io);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`✅ Backend running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connect failed", err);
    process.exit(1);
  });
