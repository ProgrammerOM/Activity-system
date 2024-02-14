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
      if (result.isUserFound) {
        setTimeout(function () {
          window.location.replace("http://www.google.com");
        }, 2000);
      }
    })
    .catch((error) => console.log("error", error));
}
