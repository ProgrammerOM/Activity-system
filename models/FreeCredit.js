const { Schema, model } = require("mongoose");

const FreeCredit = new Schema(
  {
    account: String,
    firstCode: [
      {
        type: Schema.Types.ObjectId,
        ref: "RandomCode",
      },
    ],
    secondCode: [
      {
        type: Schema.Types.ObjectId,
        ref: "RandomCode",
      },
    ],
    status:{
      type: String,
      enum: ['ยังไม่ได้เติม', "เติมแล้ว"],
      default: "ยังไม่ได้เติม",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("FreeCredit", FreeCredit);
