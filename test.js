const referrer = document.referrer;
document.getElementById("referrer").innerText = referrer
  ? "User came from: " + referrer
  : "No referrer";

const searchEngines = [
  "google.com",
  "bing.com",
  "yahoo.com",
  "baidu.com",
  "yandex.com",
  "duckduckgo.com",
];

let isFromSearchEngine = false;
if (referrer) {
  for (let i = 0; i < searchEngines.length; i++) {
    if (referrer.includes(searchEngines[i])) {
      isFromSearchEngine = true;
      break;
    }
  }
}

document.getElementById("source").innerText = isFromSearchEngine
  ? "User came from a search engine"
  : "User did not come from a search engine";

// ส่งข้อมูลไปยัง server
fetch("http://yourserver.com/log-referrer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    referrer: referrer,
    isFromSearchEngine: isFromSearchEngine,
  }),
});
document.getElementById("get-mac-btn").addEventListener("click", () => {
  fetch("https://activity-system-fete.onrender.com/get-mac")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // document.getElementById("mac-address").innerText =
      //   "MAC Address: " + data.mac_address;
    })
    .catch((error) => {
      console.log(error);
      console.error("Error fetching MAC address:", error);
    });
});

function submitComment() {
  // let username = document.getElementById("username").value;
  var username = document.querySelector(
    'input[name="site-reviews[username]"]'
  ).value;

  // let comment = document.getElementById("comment").value;
  var comment = document.querySelector('[name="site-reviews[comment]"]').value;

  console.log("Username:", username);
  console.log("Comment:", comment);

  fetch("http://localhost:8000/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account: username, comment: comment }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.isUserFound === false && result.isComment === false) {
        setTimeout(function () {
          window.location.replace("http://www.google.com");
        }, 2000);
      }
    })
    .catch((error) => console.log("error", error));
}

document.getElementById("submitBtn").addEventListener("click", function () {
  let inputData = document.getElementById("inputData").value;
  let popupData = document.getElementById("popupData");

  fetch("http://localhost:8000/codes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account: inputData }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isUserFound) {
        popupData.innerHTML = "Code: " + result.randomCode;
      } else {
        popupData.innerHTML = result.error;
      }
    })
    .catch((error) => console.log("error", error));

  document.getElementById("popup").style.display = "block";
});

document.getElementById("closeBtn").addEventListener("click", function () {
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});
