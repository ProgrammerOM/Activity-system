const fcs = require("../services/FreeCreditSve");

const FreeCredit = async (req, res) => {
  const Result = await fcs.FreeCredit(req.body);
  res.json(Result);
};

const UpdateStatus = async (req, res) => {
  const Result = await fcs.UpdateStatus(req.body);
  res.json(Result);
};

const SendClient = async (req, res) => {
  const Result = await fcs.SendRandomClient();
  res.json(Result);
};

module.exports = { FreeCredit,UpdateStatus, SendClient };
