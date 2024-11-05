const fc = require("../models/FreeCredit");

const FreeCredit = async (data) => {
  const { account, codes } = data;

  if (!account || !codes) return false;

  console.log(codes.redeemCode);
  console.log(typeof codes); // should be 'string'
  console.log(typeof codes.isActive); // should be 'boolean'

  let Result;
  try {
    Result = new fc({
      account: account,
      code: [
        {
          redeemCode: codes.redeemCode,
          isActive: codes.isActive,
        },
      ],
    });
    await Result.save();
  } catch (error) {
    console.log(error);
    return false;
  }

  return Result;
};

module.exports = FreeCredit;
