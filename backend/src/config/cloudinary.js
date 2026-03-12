const cloudinary = require("cloudinary").v2;

// CLOUDINARY UPLINK CONFIGURATION

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn("[SYS.WARN] Cloudinary credentials missing. Image uploads will fail!");
} else {
    console.log("[SYS.NET] Cloudinary media server uplink configured.");
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

module.exports = cloudinary;