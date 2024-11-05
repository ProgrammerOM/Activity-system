async function sendApi() {
  const form = document.querySelector(".form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const account = document.querySelector('input[name="account"]').value;
    const code = document.querySelector('input[name="codes"]').value;

    const Data = {
      account: account,
      code: code,
    };

    const response = await fetch("http://localhost:8000/free-credit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });
    const result = await response.json();
    localStorage.setItem("account", JSON.stringify(result));
    const resultotp = RandomCode();
    console.log(result);
    console.log(resultotp);
  });
}

sendApi();

function RandomCode() {
  let digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let codes = "";
  let len = digits.length;
  for (let i = 0; i < 6; i++) {
    codes += digits[Math.floor(Math.random() * len)];
  }
  return codes;
}

SetCodeSite();
function SetCodeSite() {
  setInterval(() => {
    document.querySelector("#code1").textContent = RandomCode();
    document.querySelector("#code2").textContent = RandomCode();
    document.querySelector("#code3").textContent = RandomCode();
  }, 2000);
}
