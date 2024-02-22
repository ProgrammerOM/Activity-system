const axios = require("axios");
const fs = require("fs");
const Redeem = require("../models/Redeem");

module.exports.CheckUser = async (req, res) => {
  try {
    const { account, comment } = req.body;
    console.log("account :", account);
    console.log("comment :", comment);

    // ตรวจสอบว่า account และ comment ถูกส่งมาในรูปแบบที่ถูกต้องหรือไม่
    if (!account || !comment) {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
    }

    let update = await Redeem.findOneAndUpdate(
      { account: account },
      { account: account, content: comment },
      {
        new: true,
        upsert: true,
      }
    );
    console.log(update);
    // นับเวลาถอยหลัง 8 วินาที
    for (let i = 8; i > 0; i--) {
      console.log(`นับเวลา: ${i}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const response = await axios.get(
      "https://goatbet69.net/wp-json/site-reviews/v1/reviews/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic YWRtaW5nb2F0YmV0Njk6a1VrSSBPZDhrIEUwTjUgYzFRSCBDVWFnIE5LdUg=",
        },
      }
    );

    const result = response.data;

    let isUserFound = false;
    for (let i = 0; i < result.length; i++) {
      if (account === result[i].title && comment === result[i].content) {
        isUserFound = true;
        console.log(`id: ${result[i].id} ข้อมูล: ${result[i].title} มีในระบบ`);
        break;
      }
    }

    if (isUserFound) {
      res.json({
        succeed: account,
        isUserFound,
      });
      console.log(`มีข้อมูลในระบบ ${account}`);
    } else {
      res.json({
        unsuccessful: account,
        isUserFound,
      });
      console.log(`ไม่มีข้อมูลในระบบ ${account}`);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่าง" });
  }
};

let usedCodes = [];

// Function to read and filter codes from the file
const getRemainingCodes = () => {
  const codes = fs
    .readFileSync("./code.text", "utf8")
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);
  return codes.filter((code) => !usedCodes.includes(code));
};

module.exports.RandomCode = async (req, res) => {
  try {
    const { account } = req.body;
    if (!account) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const response = await axios.get(
      "https://goatbet69.net/wp-json/site-reviews/v1/reviews/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic YWRtaW5nb2F0YmV0Njk6a1VrSSBPZDhrIEUwTjUgYzFRSCBDVWFnIE5LdUg=",
        },
      }
    );

    const result = response.data;
    let isUserFound = false;

    for (let i = 0; i < result.length; i++) {
      if (account === result[i].title) {
        isUserFound = true;

        const remainingCodes = getRemainingCodes();

        if (remainingCodes.length === 0) {
          return res.status(404).json({ error: "No available codes" });
        }

        const randomCode =
          remainingCodes[Math.floor(Math.random() * remainingCodes.length)];

        usedCodes.push(randomCode);
        console.log(usedCodes);

        return res.json({ isUserFound, randomCode });
      }
    }

    // Handle the case where the user is not found
    return res.json({ isUserFound: false, randomCode: null });
  } catch (error) {
    console.error("Error:", error.message);

    // Handle specific errors
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Data not found" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
