const axios = require("axios");
const fs = require("fs");
const Redeem = require("../models/Redeem");

let arr = [];
let currentIndex = 0;
exports.CheckUser = async (req, res) => {
  try {
    const {username} = req.body
    console.log(username)
    let data = fs.readFileSync("code.text", "utf-8").toString().split("\n");
    for (i in data) {
      let cleanedValue = data[i].replace(/\r$/, "").trim();
      if (!arr.includes(cleanedValue)) {
        arr.push(cleanedValue);
        currentIndex++;
        res.json({account:username, code: cleanedValue });
        await Redeem.create({account:username,code:cleanedValue})
        return;
      }
    }
    if (currentIndex >= arr.length) {
      res.status(404).json({ message: "ไม่สามารถรับ code ได้แล้ว" }); 
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่าง" });
  }
};
