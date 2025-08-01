require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3000;
const { Prisma } = require("./generated/prisma");
const cors = require("cors");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");
const { MAX_AGE } = require("./config");

const { CustomError } = require("./middleware/Errors");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const friendRouter = require("./routes/friendRoutes");

const app = express();
app.use(express.json());

const corsObject = {
  origin: ["http://localhost:5173", "https://team-up-client.onrender.com"],
  credentials: true,
};
app.use(cors(corsObject));

let sessionConfig = {
  name: "sessionId",
  secret: process.env.SESSION_SECRET,
  rolling: true,
  cookie: {
    maxAge: MAX_AGE,
    secure: process.env.RENDER === "production" ? true : false,
    httpOnly: false,
    sameSite: process.env.RENDER === "production" ? "none" : "lax",
  },
  resave: false,
  saveUninitialized: false,
};

if (process.env.RENDER === "production") {
  const redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
    },
  });

  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({ client: redisClient });
  sessionConfig.store = redisStore;
}

app.use(session(sessionConfig));
app.set("trust proxy", 1);

app.use((req, res, next) => {
  const path = req.url;
  if (
    path === "/api/auth/login" ||
    path === "/api/auth/register" ||
    path === "/api/auth/register/email"
  ) {
    if (req.session && req.session.user) {
      res.status(401).json({ redirect: "/" });
    } else {
      next();
    }
  } else if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ redirect: "/login" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/friends", friendRouter);

app.get("/api/redis-test", (req, res) => {
  (req.session.test = "Testing Connection"),
    res.send("Redis working successfully.");
});

app.use((err, req, res, next) => {
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
