const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RedeemCode = new Schema(
  {
    account: String,
    codes: [String],
    isreceived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Redeem = mongoose.model("RedeemCode", RedeemCode);
module.exports = Redeem;
