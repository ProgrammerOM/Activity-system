const { Schema, model } = require("mongoose");

const RandomCode = new Schema(
  {
    code: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("RandomCode", RandomCode);
