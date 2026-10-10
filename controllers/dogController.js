const Dog = require("../models/Dog");

const createDog = async (req, res) => {
  try {
    const { name, breed, age, description } = req.body;

    if (!name || !breed || age === undefined) {
      return res.status(400).json({
        message: "Name, breed, and age are required",
      });
    }

    const dog = await Dog.create({
      name,
      breed,
      age,
      description,
      owner: req.user.userId,
    });

    return res.status(201).json({
      message: "Dog registered successfully",
      dog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getDogs = async (req, res) => {
  try {
    const dogs = await Dog.find();

    return res.status(200).json({
      dogs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createDog,
  getDogs,
};