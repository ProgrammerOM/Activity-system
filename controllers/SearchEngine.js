exports.CheckEngines = async (req, res) => {
  const clientip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (clientip === "::1") {
    clientip = "127.0.0.1";
  }

  const searchEngines = [
    "google.com",
    "bing.com",
    "yahoo.com",
    "baidu.com",
    "yandex.com",
    "duckduckgo.com",
  ];
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
};
