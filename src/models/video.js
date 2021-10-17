const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 400,
    },
    author: {
      type: String,
      trim: true,
      required: true,
    },
    label_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Label",
    },
    likes: {
      type: Number,
      default: 0,
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
