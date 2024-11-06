const { Schema, model } = require("mongoose");

const FreeCredit = new Schema(
  {
    account: String,
    code: [
      {
        type: Schema.Types.ObjectId,
        ref: "RandomCode",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("FreeCredit", FreeCredit);
