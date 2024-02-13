const express = require("express");
const app = express();

const port = 5500;

app.use(express.static('./'));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
