const mongoose = require("mongoose");
const Video = require("../../src/models/video");
const Label = require("../../src/models/label");

const labelOneId = new mongoose.Types.ObjectId();
const labelOne = {
  _id: labelOneId,
  name: "General",
};

const labelTwoId = new mongoose.Types.ObjectId();
const labelTwo = {
  _id: labelTwoId,
  name: "Tecnología",
};

// const videofileOneId = new mongoose.Types.ObjectId();

// const videoOneId = new mongoose.Types.ObjectId();
// const videoOne = {
//   _id: videoOneId,
//   likes: 0,
//   title: "Sunset",
//   description: "Hermoso atardecer",
//   label_id: labelOneId,
//   author: "Juliana",
//   video_id: videofileOneId,
// };

const setupDatabase = async () => {
  await Label.deleteMany();
  // await Video.deleteMany();
  await new Label(labelOne).save();
  await new Label(labelTwo).save();
};

module.exports = {
  labelOne,
  labelTwo,
  // videoOne,
  labelOneId,
  labelTwoId,
  // videoOneId,
  // videofileOneId,
  setupDatabase,
};
