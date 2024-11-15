const fc = require("../models/FreeCredit");
const rd = require("../models/Codes");

const FreeCredit = async (data) => {
  const { account, codes } = data;

  console.log(codes);

  if (!account || !codes) return false;

  let Result;
  let RutCode;

  try {
    const [Code_1, Code_2] = await Promise.all(
      codes.map((code) => rd.findOne({ code }).exec())
    );

    console.log(Code_1, Code_2);

    if (!Code_1 || !Code_2) {
      return { status: "error", message: "Code not found" };
    } else if (Code_1.isActive === true || Code_2.isActive === true) {
      return { status: "error", message: "Code ไม่สามารถใช้งานได้" };
    }

    console.log(`RutCode found: ${Code_1} ${Code_2}`);

    Result = await fc.create({
      account: account,
      firstCode: [Code_1._id],
      secondCode: [Code_2._id],
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
      firstCode: Result.firstCode[0].code,
      secondCode: Result.secondCode[0].code,
      status: Result.status,
      createdAt: Result.createdAt,
      updatedAt: Result.updatedAt,
    });

    if (!Result) return { status: "error", message: "FreeCredit not found" };

    console.log(`Populated FreeCredit: ${Result}`);
  } catch (error) {
    console.log(error);
    return { status: "error", message: error.message };
  }

  return { status: "success", result: Result };
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

const SendRandomClient = async () => {
  const Result = await rd.find({ isActive: false });
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

// setInterval(async () => {
//   await SaveRandomCode();
// }, 2000);

module.exports = { FreeCredit, UpdateStatus, SendRandomClient };
