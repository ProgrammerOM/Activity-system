const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("@ngrok/ngrok");
const Cors = require("cors");
const { readdirSync } = require("fs");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://goat69.net", "http://localhost:5500"], // คุณสามารถระบุ origin ที่อนุญาตได้ เช่น 'http://127.0.0.1:5500'
    methods: "*",
  },
});

const connectDB = require("./config/database");
connectDB();
const port = 8000;

app.use(express.static("./"));
app.use(
  Cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["https://goat69.net", "http://localhost:5500"];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

readdirSync("./routers").map((r) => app.use(require("./routers/" + r)));

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
