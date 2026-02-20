const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const { verifyAccess } = require("../utils/jwt");


const authMiddleware = async (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    // Try access token first
    try {

      decoded = verifyAccess(token);

    } catch {

      try {

        decoded = jwt.verify(token, process.env.JWT_SECRET);

      } catch {

        return res.status(401).json({
          message: "Invalid or expired token",
        });

      }
    }

    const userId = decoded.id || decoded._id;

    if (!userId) {

      return res.status(401).json({
        message: "Invalid token payload",
      });

    }

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {

      return res.status(401).json({
        message: "User not found",
      });

    }

    req.user = user;

    next();

  } catch (err) {

    console.error("Auth Middleware Error:", err);

    return res.status(500).json({
      message: "Authentication failed",
    });

  }
};


const permit = (...roles) => {

  const allowed = roles.map(r => r.toLowerCase());

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({
        message: "Not authenticated",
      });

    }

    const userRole = req.user.role?.toLowerCase();

    if (!allowed.includes(userRole)) {

      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });

    }

    next();

  };

};

const requireApprovedRestaurant = async (req, res, next) => {

  try {

    if (req.user.role?.toLowerCase() !== "restaurant") {

      return next();

    }

    const restaurant = await Restaurant.findOne({
      owner: req.user._id,
    }).lean();

    if (!restaurant) {

      return res.status(404).json({
        message: "Restaurant not found",
      });

    }

    if (restaurant.status !== "approved") {

      return res.status(403).json({
        message: "Restaurant not approved yet",
      });

    }

    req.restaurant = restaurant;

    next();

  } catch (err) {

    console.error("Restaurant Approval Error:", err);

    return res.status(500).json({
      message: "Restaurant approval check failed",
    });

  }

};

module.exports = {
  authMiddleware,
  permit,
  requireApprovedRestaurant,
};