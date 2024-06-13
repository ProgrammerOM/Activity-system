const searchEngines = [
  "google.com",
  "bing.com",
  "yahoo.com",
  "baidu.com",
  "yandex.com",
  "duckduckgo.com",
];
exports.CheckEngines = async (req, res) => {
  const referrer = req.body.referrer || req.get("Referer");
  let isFromSearchEngine = false;

  if (referrer) {
    for (let i = 0; i < searchEngines.length; i++) {
      if (referrer.includes(searchEngines[i])) {
        isFromSearchEngine = true;
        break;
      }
    }
  }

  console.log("User came from:", referrer);
  console.log("Is from search engine:", isFromSearchEngine);
};
