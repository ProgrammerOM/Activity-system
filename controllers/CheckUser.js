const axios = require("axios");
const fs = require('fs');

module.exports.CheckUser = async (req, res) => {
  try {
    const { account, comment } = req.body;
    console.log("account :", account);
    console.log("comment :", comment);

    // ตรวจสอบว่า account และ comment ถูกส่งมาในรูปแบบที่ถูกต้องหรือไม่
    if (!account || !comment) {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
    }

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

module.exports.RandomCode = async (req, res) => {
  try {
    // อ่านข้อมูลจากไฟล์ code.text
    const codes = fs.readFileSync('./code.text', 'utf8').replace(/\r/g, '').split('\n').filter(Boolean);

    // กรอง code ที่ยังไม่ถูก random ไป
    const remainingCodes = codes.filter(code => !usedCodes.includes(code));

    // ตรวจสอบว่ายังมี code ที่ไม่ถูก random ไปหรือไม่
    if (remainingCodes.length === 0) {
      res.status(404).json({ error: 'No available codes' });
      return;
    }

    // Random เลือก code หนึ่ง
    const randomCode = remainingCodes[Math.floor(Math.random() * remainingCodes.length)];

    // เก็บ code ที่ถูก random เพื่อให้ไม่ซ้ำกันในครั้งถัดไป
    usedCodes.push(randomCode);
    console.log(usedCodes)

    res.json({randomCode});
  } catch (e) {
    console.log('Error:', e.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};