const express = require("express");
const bodyParser = require("body-parser");
const Cors = require("cors");
const { readdirSync } = require("fs");
const app = express();

const port = 8000;

app.use(express.static("./"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

readdirSync("./routers").map((r) => app.use(require("./routers/" + r)));

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
