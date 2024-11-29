const fc = require("../models/FreeCredit");
const rd = require("../models/Codes");

const FreeCredit = async (data) => {
  const { account, codes, starttime } = data;

  if (!account || !codes ) return false;

  let Result;
  let RutCode;

  try {
    const Checkat = await fc.findOne({ account: account }).sort({ _id: -1 });

    if (Checkat?.starttime) {
      let time = new Date(Checkat.starttime);
      let now = new Date();

      const timeDifference = now - time;

      const hoursDiffernce = timeDifference / (1000 * 60 * 60);
      if (hoursDiffernce < 24) {
        const remainingTimeMs = 24 * 60 * 60 * 1000 - timeDifference;
        const complete24HoursAt = new Date(now.getTime() + remainingTimeMs);
        console.log(`เวลาเริ่มต้น: ${time}`);
        console.log(`เวลาที่ครบ 24 ชั่วโมง: ${complete24HoursAt}`);
        console.log(
          `ครบ 24 ชั่วโมงในอีก: ${(remainingTimeMs / (1000 * 60 * 60)).toFixed(
            2
          )} ชั่วโมง`
        );
        return {
          status: "error",
          message: "วันนี้คุณได้ทำกิจกรรมไปแล้ว",
          complete24HoursAt: complete24HoursAt, // ส่งคืนเวลาเมื่อครบ 24 ชั่วโมง
        };
      }
    }

    const [Code_1, Code_2] = await Promise.all(
      codes.map((code) => rd.findOne({ code }).exec())
    );

    console.log(Code_1, Code_2);

    if (!Code_1 || !Code_2) {
      return { status: "error", message: "กรุณาตรวจสอบความถูกต้องของ Code" };
    } else if (Code_1.isActive === true || Code_2.isActive === true) {
      return { status: "error", message: "Code ไม่สามารถใช้งานได้" };
    }

    console.log(`RutCode found: ${Code_1} ${Code_2}`);

    Result = await fc.create({
      account: account,
      firstCode: [Code_1._id],
      secondCode: [Code_2._id],
      starttime: starttime,
    });

    console.log(`FreeCredit updated: ${Result}`);

    RutCode = await Promise.all([
      rd.findOneAndUpdate(
        { code: codes[0] },
        { isActive: true },
        { new: true }
      ),
      rd.findOneAndUpdate(
        { code: codes[1] },
        { isActive: true },
        { new: true }
      ),
    ]);

    console.log(`Update IsActive: ${RutCode}`);

    Result = await fc
      .findOne({ _id: Result._id })
      .populate("firstCode")
      .populate("secondCode");

    _io.emit("UpdateData", {
      _id: Result._id,
      account: Result.account,
      firstCode: Result.firstCode,
      secondCode: Result.secondCode,
      status: Result.status,
      createdAt: Result.createdAt,
      updatedAt: Result.updatedAt,
    });

    if (!Result) return { status: "error", message: "FreeCredit not found" };

    console.log(`Populated FreeCredit: ${Result}`);
    return { status: "success", message: "ยินดีด้วยคุณทำกิจรรมสำเสร็จแล้ว" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: error.message };
  }
};

const UpdateStatus = async (data) => {
  const { id, status } = data;

  const Result = await fc.findOneAndUpdate(
    { _id: id },
    { status: status },
    { upsert: true, new: true }
  );

  _io.emit("UpdateStatus", {
    _id: Result._id,
    account: Result.account,
    firstCode: Result.firstCode[0].code,
    secondCode: Result.secondCode[0].code,
    status: Result.status,
    createdAt: Result.createdAt,
    updatedAt: Result.updatedAt,
  });

  return Result;
};

const SendRandomClient = async (data) => {
  const { page, limit } = data;
  const skip = (page - 1) * limit;
  let Result;

  Result = await rd
    .find({ isActive: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalDocuments = await rd.countDocuments();

  Result = {
    data: Result,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments,
  };
  return Result;
};

const SaveRandomCode = async () => {
  const rdce = RandomCode();
  await rd.findOneAndUpdate(
    { code: rdce },
    {
      code: rdce,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

const RandomCode = () => {
  let digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let codes = "";
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    codes += digits[Math.floor(Math.random() * len)];
  }
  return codes;
};

const Times = (date = new Date()) => {
  let today = new Date(date);
  let day = String(today.getDate()).padStart(2, "0");
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let year = today.getFullYear();

  let todays = month + "/" + day + "/" + year;
  return todays;
};

// setInterval(async () => {
//   await SaveRandomCode();
// }, 2000);

module.exports = { FreeCredit, UpdateStatus, SendRandomClient };
