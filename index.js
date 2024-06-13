// const express = require("express");
// const bodyParser = require("body-parser");
// const Cors = require("cors");
// const { readdirSync } = require("fs");
// const os = require("os");
// const http = require("http");
// const socketIo = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const connectDB = require("./config/database");
// connectDB();
// const port = 8000;

// app.use(express.static("./"));
// app.use(Cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("checkEngines", (data) => {
//     const referrer = data.referrer;
//     let clientip = socket.handshake.address;

//     if (clientip === "::1") {
//       clientip = "127.0.0.1";
//     }

//     let isFromSearchEngine = false;
//     let searchEngineName = "";

//     if (referrer) {
//       for (let i = 0; i < searchEngines.length; i++) {
//         if (referrer.includes(searchEngines[i])) {
//           isFromSearchEngine = true;
//           searchEngineName = searchEngines[i].split(".")[0]; // ดึงชื่อ search engine
//           break;
//         }
//       }
//     }

//     console.log(`Client IP Address: ${clientip}`);
//     console.log("User came from:", referrer);
//     console.log("Is from search engine:", isFromSearchEngine);
//     console.log("Search engine name:", searchEngineName);

//     socket.emit("checkEnginesResult", {
//       clientip,
//       referrer,
//       isFromSearchEngine,
//       searchEngineName,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// readdirSync("./routers").map((r) => app.use(require("./routers/" + r)));

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });

const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // คุณสามารถระบุ origin ที่อนุญาตได้ เช่น 'http://127.0.0.1:5500'
    methods: ["GET", "POST"],
  },
});

const port = 8000;

app.use(cors());
app.use(bodyParser.json());

const searchEngines = [
  "google.com",
  "bing.com",
  "yahoo.com",
  "baidu.com",
  "yandex.com",
  "duckduckgo.com",
];

const CheckEngines = async (req, res) => {
  let clientip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (clientip === "::1") {
    clientip = "127.0.0.1";
  }

  const referrer = req.body.referrer || req.get("Referer");
  let isFromSearchEngine = false;
  let searchEngineName = "";

  if (referrer) {
    for (let i = 0; i < searchEngines.length; i++) {
      if (referrer.includes(searchEngines[i])) {
        isFromSearchEngine = true;
        searchEngineName = searchEngines[i].split(".")[0]; // ดึงชื่อ search engine
        break;
      }
    }
  }

  console.log(`Client IP Address: ${clientip}`);
  console.log("User came from:", referrer);
  console.log("Is from search engine:", isFromSearchEngine);
  console.log("Search engine name:", searchEngineName);

  res.json({
    clientip,
    referrer,
    isFromSearchEngine,
    searchEngineName,
  });
};

app.post("/check-engines", CheckEngines);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("checkEngines", (data) => {
    const referrer = data.referrer;
    let clientip = socket.handshake.address;

    if (clientip === "::1") {
      clientip = "127.0.0.1";
    }

    let isFromSearchEngine = false;
    let searchEngineName = "";

    if (referrer) {
      for (let i = 0; i < searchEngines.length; i++) {
        if (referrer.includes(searchEngines[i])) {
          isFromSearchEngine = true;
          searchEngineName = searchEngines[i].split(".")[0]; // ดึงชื่อ search engine
          break;
        }
      }
    }

    console.log(`Client IP Address: ${clientip}`);
    console.log("User came from:", referrer);
    console.log("Is from search engine:", isFromSearchEngine);
    console.log("Search engine name:", searchEngineName);

    socket.emit("checkEnginesResult", {
      clientip,
      referrer,
      isFromSearchEngine,
      searchEngineName,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
