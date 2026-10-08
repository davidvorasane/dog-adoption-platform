require("dotenv").config();

const express = require("express");
const connectDB = require("./db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Dog Adoption Platform API",
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