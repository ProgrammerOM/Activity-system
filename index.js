const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("@ngrok/ngrok");
const Layouts = require('express-ejs-layouts')
const Cors = require("cors");
const { readdirSync } = require("fs");
const SocketSve = require('./services/SockerSve')
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: "/socket.io",
  transports: ["websocket"],
  cors: {
    origin: ["https://goat69.net","https://api.goat69.net", "http://localhost:8000"], 
    methods: "*",
  },
});

global._io = io;

const connectDB = require("./config/database");
connectDB();
const port = 8000;

app.use(express.static("./"));
app.use(express.static(__dirname))
app.use(express.static('public'))

app.use(Layouts)
app.set()
app.set('layout','./layouts/main')
app.set('view engine','ejs')
app.use(
  Cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["https://goat69.net","https://api.goat69.net", "http://localhost:8000",'http://127.0.0.1:8000'];
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



readdirSync("./routers").map((r) => app.use(require("./routers/" + r)));

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

global._io.on('connection',SocketSve.connection)

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
