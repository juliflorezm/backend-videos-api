const express = require("express");
const { saveLabel, getAllLabels } = require("../controllers/label.controller");
const router = express.Router();

router.post("/label", saveLabel);

router.get("/labels", getAllLabels);

module.exports = router;
