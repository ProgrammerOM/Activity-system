const express = require("express");
const router = express.Router();

const { CheckUser } = require("../controllers/CheckUser");

router.get("/", (req, res) => {
  res.render("index.html");
});

router.post("/user", CheckUser);

module.exports = router;
