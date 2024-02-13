
function submitComment() {
    var username = document.getElementById("username").value;
    var comment = document.getElementById("comment").value;
  
    console.log("Username:", username);
    console.log("Comment:", comment);
  
    // Note: Adjust the API endpoint and method based on your server-side implementation
    fetch("https://goatbet69.com/wp-json/site-reviews/v1/reviews/", {
      method: "GET", // Change to POST if you're submitting data
      headers: {
        "Content-Type": "application/json",
        // Authorization should be handled on the server side for security reasons
        "Authorization": "Basic YWRtaW5nb2F0YmV0Njk6ZGlTUCB3VjA1IElrUnQgd2o3RCBpcWx4IE13REI=",
      },
      // Add a 'body' property if you are sending data in the request
      body: JSON.stringify({ username, comment }),
    })
      .then((response) => response.json())
      .then((result) => {
        let isUserFound = false;
  
        for (let i = 0; i < result.length; i++) {
          if (username === result[i].title) {
            isUserFound = true;
            console.log(
              `id: ${result[i].id} ข้อมูล: ${result[i].title} เจอตามเงื่อนไข`
            );
            break;
          }
        }
  
        if (isUserFound) {
          setTimeout(function () {
            window.location.replace("http://www.example.com"); // Change the URL
          }, 2000);
        } else {
          console.log(`ไม่พบข้อมูลที่ตรงกับ ${username}`);
        }
      })
      .catch((error) => console.log("error", error));
  }
  