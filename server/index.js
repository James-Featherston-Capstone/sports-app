const express = require("express");
const cors = require("cors");
const session = require("express-session");
const PORT = 3000;

const authRouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

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
app.set("trust proxy", 1);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
