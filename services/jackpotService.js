const jackpotDB = require("../models/jackpotModel");
const axios = require("axios");

const jackpot = async (data) => {
  try {
    const { title, content } = data;

    if (!title || !content) {
      return {
        success: false,
        status: 400,
      };
    }

    const count = await jackpotDB.countDocuments().lean();

    if (count < 5) {
      const Create = await jackpotDB.create({
        acccount: title,
        amount: content,
      });

      console.log("Created:", Create);
      return {
        success: true,
        status: 201,
        message: "Created new jackpot",
      };
    } else {
      const indexToUpdate = Math.floor(Math.random() * 3); // สุ่ม index ระหว่าง 0-9

      // ดึงรายการอันดับที่ indexToUpdate
      const jackpots = await jackpotDB.find().sort({ createdAt: 1 }); // เรียงตามเวลาเก่า → ใหม่
      const docToUpdate = jackpots[indexToUpdate];

      if (!docToUpdate) {
        return {
          success: false,
          status: 500,
          message: "No document to update",
        };
      }

      docToUpdate.acccount = title;
      docToUpdate.amount = content;
      await docToUpdate.save();
      console.log("Updated:", docToUpdate);
    }

    const arrStr = [
      `ยินดีด้วยกับยูส ${title} Jackpot ที่ได้รับ ${content}`,
      `ติดต่อขอรับสิทธิ์ได้ที่ แอดมินใบเตยยูส ${title} ยอด ${content} JACKPOT`,
      `ยูสเซอร์ ${title} เฮงสุด! ถูกรางวัล Jackpot มูลค่า ${content}`,
      `🎉 ยูส ${title} ได้รับแจ็กพอต ${content} รีบติดต่อแอดมินรับของรางวัลเลย!`,
      `ยินดีด้วย! ${title} รับทรัพย์ก้อนโต ${content} จาก Jackpot ไปเต็มๆ`,
      `💰 แจ็กพอตแตก! ยูส ${title} คว้าไปเลย ${content} ติดต่อแอดมินรับสิทธิ์`,
      `ยูส ${title} ได้แจ็กพอต ${content} แล้วจ้าา รีบแจ้งรับรางวัลด่วนเลย`,
    ];
    const arrAdmin = [
      "แอดมินส้ม",
      "แอดน้ำหวาน",
      "แอดใบเตย",
      "แอดมินแคนดี้",
      "แอดพั้นช์",
      "แอดมีมี่",
      "แอดลูกพีช",
      "แอดเชอรี่",
    ];

    const randomMsg = arrStr[Math.floor(Math.random() * arrStr.length)];
    const randomAn = arrAdmin[Math.floor(Math.random() * arrAdmin.length)];

    const response = await axios.post(
      "https://goatbetx69.com/wp-json/site-reviews/v1/reviews",
      {
        title: randomAn,
        content: randomMsg,
        rating: "5",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.WP_AUTH}`,
        },
      }
    );

    if (response.status !== 201) {
      return {
        success: false,
        status: 400,
      };
    }

    return {
      success: true,
      status: 200,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
    };
  }
};

const Getjackpot = async () => {
  try {
    const jackpot = await jackpotDB
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (!jackpot) {
      return {
        success: false,
        status: 404,
        message: "No jackpot found",
      };
    }

    return {
      success: true,
      status: 200,
      data: jackpot,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
    };
  }
};

module.exports = { jackpot, Getjackpot };
