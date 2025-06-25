const express = require("express");
const cors = require("cors");
const session = require("express-session");
const PORT = 3000;
const { Prisma } = require("./generated/prisma");

const { CustomError } = require("./middleware/Errors");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());

const corsObject = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsObject));

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
app.use("/api/user", userRouter);

app.use((err, req, res) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle common Prisma errors (e.g., unique constraint violation)
    // Taken from Codepath lesson
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ error: "A unique constraint violation occurred." });
    }
  }
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
