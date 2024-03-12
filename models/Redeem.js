const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RedeemCode = new Schema(
  {
    account: String,
    comment: String,
    codes: [String],
    isUserFound: {
      type: Boolean,
      default: false,
    },
    isComment: {
      type: Boolean,
      default: false, 
    },
    isReceived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Redeem = mongoose.model("RedeemCode", RedeemCode);
module.exports = Redeem;
