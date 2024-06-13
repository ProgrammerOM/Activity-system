const express = require("express");
const bodyParser = require("body-parser");
const Cors = require("cors");
const { readdirSync } = require("fs");
const os = require("os");
const app = express();

const connectDB = require("./config/database");

const port = 8000;

app.use(express.static("./"));
app.use(Cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB();

readdirSync("./routers").map((r) => app.use(require("./routers/" + r)));

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
