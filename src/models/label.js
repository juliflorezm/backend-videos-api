const mongoose = require("mongoose");

const labelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

labelSchema.virtual("videos", {
  ref: "Video",
  localField: "_id",
  foreignField: "label_id",
});

const Label = mongoose.model("Label", labelSchema);

module.exports = Label;
