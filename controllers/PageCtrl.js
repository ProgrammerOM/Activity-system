const PageSve = require("../services/PageSve");

const PageHome = async (req, res) => {
  const Result = await PageSve();
  res.render("index");
};

module.exports = PageHome;
