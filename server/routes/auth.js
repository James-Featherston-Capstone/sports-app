const express = require("express");
const router = express.Router();
const supabase = require("../supabase.js");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    res.status(201).json({ user: data.user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    res.status(200).json({ session: data.session, user: data.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

module.exports = router;
