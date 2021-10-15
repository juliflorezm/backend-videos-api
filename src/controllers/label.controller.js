const Label = require("../models/label");

const saveLabel = async (req, res) => {
  const label = new Label(req.body);

  const found = await Label.findOne({ name: req.body.name });

  if (found) {
    return res.status(400).send({
      variant: "error",
      message: "unique_name",
    });
  }

  try {
    const saved = await label.save();
    res.status(201).send({ variant: "success", label: saved });
  } catch (e) {
    res.status(400).send({ variant: "error", message: e.message });
  }
};

const getAllLabels = async (req, res) => {
  try {
    const labels = await Label.find().sort({ createdAt: -1 });
    res.status(200).send({ variant: "success", labels });
  } catch (e) {
    res.status(500).send({ variant: "error", message: e.message });
  }
};

module.exports = {
  saveLabel,
  getAllLabels,
};
