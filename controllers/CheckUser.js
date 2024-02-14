const axios = require("axios");
module.exports.CheckUser = async (req, res) => {
  try {
    username = { account, comment } = req.body;
    console.log("account :", account);
    console.log("comment :", comment);
    await axios
      .get("https://goatbet69.net/wp-json/site-reviews/v1/reviews/", {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic YWRtaW5nb2F0YmV0Njk6a1VrSSBPZDhrIEUwTjUgYzFRSCBDVWFnIE5LdUg=",
        },
      })
      .then((response) => response.data)
      .then((result) => {
        let isUserFound = false;
        setTimeout(function () {
          for (let i = 0; i < result.length; i++) {
            if (account === result[i].title && comment === result[i].content) {
              isUserFound = true;
              console.log(
                `id: ${result[i].id} ข้อมูล: ${result[i].title} มีในระบบ`
              );
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
        }, 10000);
      })
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.log(error);
  }
};
