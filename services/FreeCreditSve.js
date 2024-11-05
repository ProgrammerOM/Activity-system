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

// span-1755-14 span-1749-14 span-1752-14

module.exports = FreeCredit;
