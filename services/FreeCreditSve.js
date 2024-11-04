const fc = require("../models/FreeCredit");

const FreeCredit = async (data) => {
  const { account, code } = data;
  if (!account || !code) return false;
  let Result;
  Result = await fc.findOneAndUpdate(
    { account: account },
    { account: account, code: code },
    { upsert: true, new: true }
  );

  return Result;
};

module.exports = FreeCredit;
