const express = require("express");
const router = express.Router();

// const CheckUser = require("../controllers/CheckUser");
const Free = require("../controllers/FreeCreditCtrl");
const jack = require('../controllers/jackpotController')

// router.post("/redeem", CheckUser.CheckUser);
router.post("/free-credit", Free.FreeCredit);
router.post("/update-status", Free.UpdateStatus);
router.get("/codes", Free.SendClient);
router.post("/api/reviews/jackpot", jack.jackpot);
router.get("/api/jackpot", jack.Getjackpot);

module.exports = router;
