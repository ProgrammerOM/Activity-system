const mongoose = require("mongoose");
const fs = require("../models/FreeCredit");

const connection = async (socket) => {
  console.log(`User connect ${socket.id}`);

  socket.on("Alldata", async (page, limit) => {
    try {
      const skip = (page - 1) * limit;
      const Result = await fs
        .find({})
        .populate("firstCode")
        .populate("secondCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalDocuments = await fs.countDocuments();

      let show = {
        data: Result,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalDocuments,
      };


      if (!Result) return;

      socket.emit("Data", show);
    } catch (error) {
      console.log(error);
    }
  }); 

  socket.on("searchQuery", async (query, page, limit, callback) => {
    try {
      const skip = (page - 1) * limit; // คำนวณรายการที่ต้องข้าม
      const regex = new RegExp(query, "i");
      const queryConditions = [
        { account: regex },
        { "firstCode.code": regex },
        { "secondCode.code": regex },
        { status: regex },
      ];

      if (mongoose.Types.ObjectId.isValid(query)) {
        queryConditions.push({ _id: query });
      }

      const [results, totalDocuments] = await Promise.all([
        fs
          .find({
            $or: queryConditions,
          })
          .skip(skip)
          .limit(limit)
          .populate("firstCode")
          .populate("secondCode"),
        fs.countDocuments({
          $or: queryConditions,
        }),
      ]);

      const totalPages = Math.ceil(totalDocuments / limit); // จำนวนหน้าทั้งหมด

      callback({
        success: true,
        data: results,
        currentPage: page,
        totalPages,
        totalDocuments,
      });
    } catch (error) {
      console.error("Error during search:", error);
      callback({ success: false, message: "Search failed. Please try again." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
};

async function SendData(page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const Result = await fs
      .find({})
      .populate("firstCode")
      .populate("secondCode")
      .skip(skip)
      .limit(limit);

    const totalDocuments = await fs.countDocuments();

    let show = {
      Result,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments,
    };

    if (!Result) return;

    for (let i = 0; i < Result.length; i++) {
      const item = Result[i];

      if (item.firstCode?.[0]?.code && item.secondCode?.[0]?.code) {
        _io.emit("Data", {
          _id: item._id,
          account: item.account,
          firstCode: item.firstCode[0].code,
          secondCode: item.secondCode[0].code,
          status: item.status,
          startTime: item.starttime,
          currentPage: page,
          totalPages: Math.ceil(totalDocuments / limit),
          totalDocuments,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connection };
