const jackpotSev = require("../services/jackpotService");

const jackpot = async (req, res) => {
  try {
    const Result = await jackpotSev.jackpot(req.body);
    if (!Result.success) {
      return res.status(Result.status).json(Result);
    }
    res.status(Result.status).json(Result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { jackpot };
