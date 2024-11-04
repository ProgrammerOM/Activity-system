const fcs = require("../services/FreeCreditSve");

const FreeCredit = async (req, res) => {
  // const { account, code } = req.body;

  const Result = await fcs(req.body);
  console.log(Result);
  res.json(Result);
};

module.exports = FreeCredit;
