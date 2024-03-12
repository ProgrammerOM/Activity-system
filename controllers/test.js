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
