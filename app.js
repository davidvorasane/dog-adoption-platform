require("dotenv").config();

const express = require("express");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const authenticate = require("./middlewares/authMiddleware");


const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Dog Adoption Platform API",
  });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();