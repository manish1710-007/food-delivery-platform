const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// CLOUDINARY STORAGE CONFIG
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "food-delivery",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    },
});


// MULTER FILTER PROTOCOL
const fileFilter = (req, file, cb) => {
    // Only allow specific image types to pass the firewall
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("[SYS.ERR] Invalid file type. Only image uploads are permitted."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB limit to protect your server bandwidth
    },
});

module.exports = upload;