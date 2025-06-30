require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3000;
const { Prisma } = require("./generated/prisma");
const cors = require("cors");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const { CustomError } = require("./middleware/Errors");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");

const app = express();
app.use(express.json());

const corsObject = {
  origin: ["http://localhost:5173", "https://team-up-client.onrender.com"],
  credentials: true,
};
app.use(cors(corsObject));

const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
  },
});

redisClient.connect().catch(console.error);
const redisStore = new RedisStore({ client: redisClient });

let sessionConfig = {
  name: "sessionId",
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: process.env.RENDER === "production" ? true : false,
    sameSite: "none",
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));
app.set("trust proxy", 1);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/events", eventRouter);

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
