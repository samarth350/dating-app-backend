const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Step 1: Google login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // JWT generate
    const token = jwt.sign(
      { id: req.user._id },
      "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: req.user,
    });
  }
);

module.exports = router;