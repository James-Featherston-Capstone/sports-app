const express = require("express");
const router = express.Router();
const supabase = require("../supabase.js");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await supabase.auth.signUp({
      email,
      password,
    });
    if (!user.user) {
      res.status(400).json({ error: "User already exists" });
    }
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

module.exports = router;
