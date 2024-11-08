document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("#modal__dialog");
  const openModal = document.querySelector(".open-button__dialog");
  const closeModal = document.querySelector(".close-button__dialog");
  const toast = document.querySelector(".toast");

  openModal.addEventListener("click", () => {
    toast.classList.add("active");
    modal.showModal();

    setTimeout(() => {
      toast.classList.remove("active");
    }, 2000);
  });

  closeModal.addEventListener("click", () => {
    modal.close();
  });
  sendApi();
  SetCodeSite();
});

let Codes = [];
let CodesIndex = 0;
let currentIndex = 0;
let totalCodes = 0;
let colorindex = 0;
let colortotal = 0;

async function sendApi() {
  const form = document.querySelector(".form");
  const toast = document.querySelector(".toast");
  const message = document.querySelector(".message");
  const account = document.querySelector('input[name="account"]').value;
  const code = document.querySelector('input[name="codes"]').value;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (account.length <= 0 || code.length <= 0) {
      message.innerHTML = `
          <span class="text text-1">Error</span>
  <span class="text text-2">กรุณากรอกยูสเซอร์ และ โค้ด</span>`;

      toast.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
      }, 5000);
      return;
    }

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

    if (result.status === "error") {
      message.innerHTML += RenderHtml(result);
      toast.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
      }, 5000);

      return;
    }
    toast.classList.add("active");
    setTimeout(() => {
      window.location.replace("http://www.w3schools.com");
    }, 3000);
  });
}

function RenderHtml(result) {
  return `
  <span class="text text-1">${result.status}</span>
  <span class="text text-2">${result.message}</span>
`;
}



async function ApiGetCodes() {
  const response = await fetch("http://localhost:8000/codes", {
    method: "GET",
  });
  const Result = await response.json();
  if (!Result) return;
  Codes = Result;
  totalCodes = Result.length;
}

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
      codeElements[currentIndex].style.color = RandomColor();
      codeElements[currentIndex].innerText = Codes[CodesIndex].code;
    }

    CodesIndex = (CodesIndex + 1) % totalCodes;
    currentIndex = (currentIndex + 1) % totalElements;
    console.log(CodesIndex, currentIndex);
  }, 3000);
}


function RandomColor() {
  let Colors = ["#ff0000", "#F75E25", "#ff00f1","#f1ff00"];
  colortotal = Colors.length;

  colorindex = (colorindex + 1) % colortotal;
  return Colors[colorindex];
}
