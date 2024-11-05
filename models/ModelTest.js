const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Test = new Schema(
  {
    account: String,
    code: [
      {
        redeemCode: { type: String, required: true },
        isActive: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TestCode", Test);
