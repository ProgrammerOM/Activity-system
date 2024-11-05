const fc = require("../models/FreeCredit");

const FreeCredit = async (data) => {
  const { account, codes } = data;

  if (!account || !codes) return false;

  let Result;
  try {
    Result = await fc.findOneAndUpdate(
      {
        account: account,
      },
      {
        $push: {
          code: {
            redeemCode: codes.redeemCode,
            isActive: codes.isActive,
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
    return false;
  }

  return Result;
};

module.exports = FreeCredit;
