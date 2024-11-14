const express = require("express");
const router = express.Router();

const PageHome = require("../controllers/PageCtrl");

router.get("/", PageHome);

module.exports = router;
