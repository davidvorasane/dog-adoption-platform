const express = require("express");
const { createDog, getDogs, adoptDog, deleteDog, getAdoptedDogs } = require("../controllers/dogController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createDog);
router.get("/", getDogs);
router.get("/adopted", getAdoptedDogs);
router.post("/:id/adopt", authenticate, adoptDog);
router.delete("/:id", authenticate, deleteDog);

module.exports = router;