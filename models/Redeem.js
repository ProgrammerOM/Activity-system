const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RedeemCode = new Schema(
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

const Redeem = mongoose.model("RedeemCode", RedeemCode);
module.exports = Redeem;
