const axios = require("axios");
const fs = require("fs");
const Redeem = require("../models/Redeem");

module.exports.CheckUser = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่าง" });
  }
};

let usedCodes = [];

const getRemainingCodes = () => {
  const codes = fs
    .readFileSync("./code.text", "utf8")
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);
  return codes.filter((code) => !usedCodes.includes(code));
};
