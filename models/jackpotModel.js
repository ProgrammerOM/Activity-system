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
  },
  {
    timestamps: true,
  }
);

const JackPotModel = model("Jackpot", jackpotSchema);

module.exports = JackPotModel