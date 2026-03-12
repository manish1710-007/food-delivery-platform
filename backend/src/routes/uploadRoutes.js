const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");


// SECURE UPLOAD GATEWAY

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                message: "[SYS.ERR] No image data detected in the payload." 
            });
        }

        // Return the secure Cloudinary URL to the frontend
        res.status(200).json({
            imageUrl: req.file.path,
        });

    } catch (err) {
        console.error("[SYS.ERR] Image upload protocol failed:", err);
        res.status(500).json({ message: "Image upload failed due to a server error." });
    }
});

module.exports = router;