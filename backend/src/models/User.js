// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Manish"],
    },
    email: {
      type: String,
      required: [true, "oogabooga@gmail.com"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "987654"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "driver", "customer", "restaurant"],
      default: "user",
    },
  },
  { timestamps: true }
);

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
