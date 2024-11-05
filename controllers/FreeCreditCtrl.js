const fcs = require("../services/FreeCreditSve");

const FreeCredit = async (req, res) => {
  const Result = await fcs(req.body);
  res.json(Result);
};

module.exports = FreeCredit;
