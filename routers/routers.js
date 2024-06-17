const express = require("express");
const router = express.Router();

const CheckUser = require('../controllers/CheckUser')


router.post('/redeem',CheckUser.CheckUser)


module.exports = router;
