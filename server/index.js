const express = require("express");
const PORT = 3000;
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());

// Codepaths example config, will likely need to change
let sessionConfig = {
  name: "sessionId",
  secret: "keep it secret, keep it safe",
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: process.env.RENDER ? true : false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
