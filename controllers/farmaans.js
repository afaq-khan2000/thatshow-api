const mongoose = require("mongoose");
const Farmaan = require("../models/Farmaan");

exports.getFarmaans = async (req, res) => {
  try {
    const farmaans = await Farmaan.find().sort({ createdAt: -1 });
    res.status(200).json(farmaans);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getFarmaan = async (req, res) => {
  const id = req.params.id;
  try {
    const farmaan = await Farmaan.findById(id);
    res.status(200).json(farmaan);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createFarmaan = async (req, res) => {
  let { title, farmaan } = req.body;
  const newFarmaan = new Farmaan({
    title,
    farmaan,
  });
  try {
    const savedFarmaan = await Farmaan.create(newFarmaan);
    res.status(200).send(savedFarmaan);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.updateFarmaan = async (req, res) => {
  try {
    const id = req.params.id;
    const farmaan = { ...req.body };
    const updatedFarmaan = await Farmaan.findByIdAndUpdate(id, farmaan);
    await updatedFarmaan.save();
    res.status(200).send(updatedFarmaan);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.deleteFarmaan = async (req, res) => {
  try {
    const id = req.params.id;
    let farmaan = await Farmaan.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
