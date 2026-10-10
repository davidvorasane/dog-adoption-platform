const express = require("express");
const { createDog, getDogs } = require("../controllers/dogController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createDog);
router.get("/", getDogs);

module.exports = router;