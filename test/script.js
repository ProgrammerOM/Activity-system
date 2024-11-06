document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("#modal__dialog");
  const openModal = document.querySelector(".open-button__dialog");
  const closeModal = document.querySelector(".close-button__dialog");

  openModal.addEventListener("click", () => {
    modal.showModal();
  });

  closeModal.addEventListener("click", () => {
    modal.close();
  });
});

async function sendApi() {
  const form = document.querySelector(".form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const account = document.querySelector('input[name="account"]').value;
    const code = document.querySelector('input[name="codes"]').value;

    const Data = {
      account: account,
      codes: code,
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

    console.log(result);

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

let Codes = [];
let CodesIndex = 0;
let currentIndex = 0;
let totalCodes = 0;

async function ApiGetCodes() {
  const response = await fetch("http://localhost:8000/codes", {
    method: "GET",
  });
  const Result = await response.json();
  if (!Result) return;
  Codes = Result;
  totalCodes = Result.length;
}

SetCodeSite();
async function SetCodeSite() {
  await ApiGetCodes();
  const codeElements = document.querySelectorAll(".code");
  let totalElements = codeElements.length;

  setInterval(async () => {
    codeElements.forEach((el) => {
      el.innerText = "";
    });

    while (Codes[CodesIndex].isActive && totalCodes > 0) {
      console.log(`CodesIndex after ${CodesIndex}`);
      CodesIndex = (CodesIndex + 1) % totalCodes;
      console.log(`CodesIndex before ${CodesIndex}`);
    }

    if (totalCodes > 0 && Codes[CodesIndex].isActive === false) {
      codeElements[currentIndex].innerText = Codes[CodesIndex].code;
    }

    CodesIndex = (CodesIndex + 1) % totalCodes;
    currentIndex = (currentIndex + 1) % totalElements;
    console.log(CodesIndex, currentIndex);
  }, 3000);
}


