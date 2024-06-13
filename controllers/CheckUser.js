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

// Function to read and filter codes from the file
const getRemainingCodes = () => {
  const codes = fs
    .readFileSync("./code.text", "utf8")
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);
  return codes.filter((code) => !usedCodes.includes(code));
};

const CheckTime = (account) => {
  setInterval(async () => {
    let time = new Date().toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    console.log(time);
    if (time === "17:19:00" || time === "17:20:00") {
      const Update = await Redeem.findOneAndUpdate(
        { account: account },
        { isReceived: false, isComment: false }
      );
      console.log(Update);
    }
  }, 1000);
};

module.exports.RandomCode = async (req, res) => {
  try {
    const { account } = req.body;
    if (!account) {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
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
          return res.status(404).json({ error: "ไม่มี Code ที่ใช้ได้" });
        }

        const NewUpdate = await Redeem.findOne({ account: account });

        if (!NewUpdate) {
          await Redeem.create({
            account: account,
            isUserFound: isUserFound,
          });
        }

        const checkUser = await Redeem.findOne({ account: account });

        if (checkUser.isReceived === true && checkUser.isComment === true) {
          return res.status(403).json({
            error:
              "เสียใจด้วย คุณได้รับ Code ไปแล้วค่ะ สามารถรับได้อีกครั้งในวันถัดไป ขอบคุณค่ะ",
          });
        }

        const randomCode =
          remainingCodes[Math.floor(Math.random() * remainingCodes.length)];
        console.log(randomCode);
        usedCodes.push(randomCode);

        await Redeem.findOneAndUpdate(
          { account: account },
          { $addToSet: { codes: randomCode }, isReceived: true }
        );
        CheckTime(account);

        return res.status(200).json({ account, randomCode, isUserFound });
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
