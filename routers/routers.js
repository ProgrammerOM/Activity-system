const express = require("express");
const router = express.Router();

const CheckUser = require("../controllers/CheckUser");
const Free = require("../controllers/FreeCreditCtrl");

router.post("/redeem", CheckUser.CheckUser);
router.post("/free-credit", Free);

module.exports = router;
