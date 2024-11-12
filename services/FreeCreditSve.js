const fc = require("../models/FreeCredit");
const rd = require("../models/Codes");

const FreeCredit = async (data) => {
  const { account, codes } = data;

  if (!account || !codes) return false;

  let Result;
  let RutCode;

  try {
    RutCode = await rd.findOne({ code: codes });

    if (!RutCode) {
      return { status: "error", message: "Code not found" };
    } else if (RutCode.isActive === true) {
      return { status: "error", message: "Code ไม่สามารถใช้งานได้" };
    }

    console.log(`RutCode found: ${RutCode}`);

    Result = await fc.findOneAndUpdate(
      {
        account: account,
      },
      {
        $addToSet: {
          code: RutCode._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    console.log(`FreeCredit updated: ${Result}`);

    RutCode = await rd.findOneAndUpdate(
      { code: codes },
      { isActive: true },
      { new: true }
    );

    console.log(`Update IsActive: ${RutCode}`);

    Result = await fc.findOne({ account: account }).populate("code");

    if (!Result) return { status: "error", message: "FreeCredit not found" };

    console.log(`Populated FreeCredit: ${Result}`);
  } catch (error) {
    console.log(error);
    return { status: "error", message: error.message };
  }

  return { status: "success", result: Result };
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
// }, 5000);

module.exports = { FreeCredit, SendRandomClient };
