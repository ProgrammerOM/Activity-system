const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RedeemCode = new Schema(
  {
    account: {
      type: String,
    },
    code: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Redeem = mongoose.model("RedeemCode", RedeemCode);
module.exports = Redeem;
