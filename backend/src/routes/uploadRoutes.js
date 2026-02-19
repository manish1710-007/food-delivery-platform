const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), (req, res) => {
    try {
        res.json({
            imageUrl: req.file.path,
        });
    } catch (err){
        console.error(err);
        res.status(500).json({ error: "Image upload failed" });
    }
});

module.exports = router;