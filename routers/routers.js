const express = require("express");
const network = require("network");
const router = express.Router();

const { CheckUser, RandomCode } = require("../controllers/CheckUser");

router.get("/", (req, res) => {
  res.render("index.html");
});

router.get("/get-mac", (req, res) => {
  network.get_active_interface((err, obj) => {
    if (err) {
      res.status(500).send("Error getting MAC address");
    } else {
      res.json({ mac_address: obj.mac_address });
    }
  });
});

router.post("/user", CheckUser);
router.post("/codes", RandomCode);

module.exports = router;
