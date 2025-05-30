const jackpotDB = require("../models/jackpotModel");
const axios = require("axios");

const jackpot = async (data) => {
  try {
    const { acccount, amount , img} = data;

    if (!acccount || !amount) {
      return {
        success: false,
        status: 400,
      };
    }

    const count = await jackpotDB.countDocuments().lean();

    if (count < 4) {
      const Create = await jackpotDB.create({
        acccount: acccount,
        amount: amount,
        img: img
      });

      console.log("Created:", Create);
      return {
        success: true,
        status: 201,
        message: "Created new jackpot",
      };
    } else {
      const indexToUpdate = Math.floor(Math.random() * count); // สุ่ม index ระหว่าง 0-9

      // ดึงรายการอันดับที่ indexToUpdate
      const jackpots = await jackpotDB.find().sort({ crcreatedAt: 1 }) // เรียงตามเวลาเก่า → ใหม่
      const docToUpdate = jackpots[indexToUpdate];

      if (!docToUpdate) {
        return {
          success: false,
          status: 500,
          message: "No document to update",
        };
      }

      docToUpdate.acccount = acccount;
      docToUpdate.amount = amount;
      docToUpdate.img = img
      await docToUpdate.save();
      console.log("Updated:", docToUpdate);
    }

    const arrStr = [
      `ยินดีด้วยกับยูส ${acccount} Jackpot ที่ได้รับ ${amount}`,
      `ติดต่อขอรับสิทธิ์ได้ที่ แอดมินใบเตยยูส ${acccount} ยอด ${amount} JACKPOT`,
      `ยูสเซอร์ ${acccount} เฮงสุด! ถูกรางวัล Jackpot มูลค่า ${amount}`,
      `🎉 ยูส ${acccount} ได้รับแจ็กพอต ${amount} รีบติดต่อแอดมินรับของรางวัลเลย!`,
      `ยินดีด้วย! ${acccount} รับทรัพย์ก้อนโต ${amount} จาก Jackpot ไปเต็มๆ`,
      `💰 แจ็กพอตแตก! ยูส ${acccount} คว้าไปเลย ${amount} ติดต่อแอดมินรับสิทธิ์`,
      `ยูส ${acccount} ได้แจ็กพอต ${amount} แล้วจ้าา รีบแจ้งรับรางวัลด่วนเลย`,
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
