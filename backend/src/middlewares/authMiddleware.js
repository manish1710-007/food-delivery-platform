const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const { verifyAccess } = require("../utils/jwt");

// MAIN AUTHENTICATION FIREWALL
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "ACCESS DENIED: No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    // Try access token first
    try {
      decoded = verifyAccess(token);
    } catch {
      // Fallback for legacy/basic tokens
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(401).json({ message: "ACCESS DENIED: Invalid or expired token signature" });
      }
    }

    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({ message: "ACCESS DENIED: Corrupted token payload" });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(401).json({ message: "ACCESS DENIED: User not found in databank" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("[SYS.ERR] Auth Firewall Error:", err);
    return res.status(500).json({ message: "Authentication protocol failed" });
  }
};


// ROLE-BASED CLEARANCE (RBAC)
const permit = (...roles) => {
  const allowed = roles.map(r => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "ACCESS DENIED: Not authenticated" });
    }

    const userRole = req.user.role?.toLowerCase();

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: "FORBIDDEN: Insufficient security clearance" });
    }

    next();
  };
};

// RESTAURANT APPROVAL GATEWAY

const requireApprovedRestaurant = async (req, res, next) => {
  try {
    if (req.user.role?.toLowerCase() !== "restaurant") {
      return next();
    }

    const restaurant = await Restaurant.findOne({ owner: req.user._id }).lean();

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant node not found for this user" });
    }

    if (restaurant.status !== "approved") {
      return res.status(403).json({ message: "FORBIDDEN: Restaurant node is pending admin approval" });
    }

  
    req.user.restaurant = restaurant._id; 
    
    // Keeping this for backward compatibility with any other routes
    req.restaurant = restaurant; 

    next();

  } catch (err) {
    console.error("[SYS.ERR] Restaurant Verification Error:", err);
    return res.status(500).json({ message: "Restaurant approval check failed" });
  }
};

module.exports = {
  authMiddleware,
  permit,
  requireApprovedRestaurant,
};