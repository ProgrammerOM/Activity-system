const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FreeCredit = new Schema(
  {
    account: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("FreeCredit", FreeCredit);
