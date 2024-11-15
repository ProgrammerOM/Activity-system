const fs = require("../models/FreeCredit");

const PageHome = async () => {
  let Result;
  Result = await fs.find({}).populate("code");

  for (let i = 0; i < Result.length; i++) {
    Result[i];
  }

  return Result;
};

module.exports = PageHome;
