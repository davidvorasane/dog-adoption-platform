
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

const adoptDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({
        message: "Dog not found",
      });
    }

    if (dog.adoptedBy) {
      return res.status(400).json({
        message: "This dog has already been adopted",
      });
    }

    dog.adoptedBy = req.user.userId;
    dog.adoptedAt = new Date();

    await dog.save();

    return res.status(200).json({
      message: "Dog adopted successfully",
      dog,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid dog ID",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({
        message: "Dog not found",
      });
    }

    await Dog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Dog removed successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid dog ID",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getAdoptedDogs = async (req, res) => {
  try {
    const dogs = await Dog.find({
      adoptedBy: { $ne: null },
    });

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
  adoptDog,
  deleteDog,
  getAdoptedDogs,
};