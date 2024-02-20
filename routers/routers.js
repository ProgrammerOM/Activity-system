const express = require("express");
const router = express.Router();

const { CheckUser, RandomCode } = require("../controllers/CheckUser");

router.get("/", (req, res) => {
  res.render("index.html");
});

router.post("/user", CheckUser);
router.post('/codes', RandomCode)

module.exports = router;
