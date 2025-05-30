const { Schema, model } = require("mongoose");

const jackpotSchema = new Schema(
  {
    acccount: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      default: "https://example.com/default-image.jpg", // URL ของรูปภาพเริ่มต้น
    },
  },
  {
    timestamps: true,
  }
);

const JackPotModel = model("Jackpot", jackpotSchema);

module.exports = JackPotModel