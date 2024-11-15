const fs = require("../models/FreeCredit");

const connection = async (socket) => {
  console.log(`User connect ${socket.id}`);
  SendData();
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
};

async function SendData() {
  try {
    const Result = await fs
      .find({})
      .populate("code")
      .populate("firstCode")
      .populate("secondCode");

    for (let i = 0; i < Result.length; i++) {
      const item = Result[i];

      _io.emit("Data", {
        _id: item._id,
        account: item.account,
        firstCode: item.firstCode[0].code,
        secondCode: item.secondCode[0].code,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connection };
