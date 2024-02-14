const axios = require("axios");

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
