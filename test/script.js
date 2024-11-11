let Codes = [];
let CodesIndex = 0;
let currentIndex = 0;
let totalCodes = 0;
let colorindex = 0;
let colortotal = 0;
let isSubmitting = false;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("#modal__dialog");
  const openModal = document.querySelector(".open-button__dialog");
  const closeModal = document.querySelector(".close-button__dialog");
  const toast = document.querySelector(".toast");
  const form = document.querySelector(".form");

  openModal.addEventListener("click", () => {
    toast.classList.add("active");
    const Steptwo = localStorage.getItem("StepOne");
    if (Steptwo) {
      console.log("steptwo");
      StepTwo();
    }
    modal.showModal();
    StepOne();

    setTimeout(() => {
      toast.classList.remove("active");
    }, 2000);
  });

  closeModal.addEventListener("click", () => {
    form.reset();
    modal.close();
  });

  SetCodeSite();
});

async function StepOne() {
  const form = document.querySelector(".form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const modal = document.querySelector("#modal__dialog");
     account = document.querySelector('input[name="account"]').value;
     code = document.querySelector('input[name="codes"]').value;
     toast = document.querySelector(".toast");
     message = document.querySelector(".message");

    if (isSubmitting) return; // ถ้ามีการส่งคำขออยู่แล้ว ให้หยุดการส่งคำขอใหม่

    isSubmitting = true; // กำหนด flag ว่ากำลังส่งคำขอ
 

    if (account.length <= 0 || code.length <= 0) {
      message.innerHTML = `
            <span class="text text-1">Error</span>
    <span class="text text-2">กรุณากรอกยูสเซอร์ และ โค้ด</span>`;

      toast.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
      }, 5000);
      isSubmitting = false; // รีเซ็ต flag เมื่อเสร็จสิ้น

      return;
    }

    const data = {
      account: account,
      codes: code,
    };

    const response = await fetch("http://localhost:8000/free-credit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      isSubmitting = false; // รีเซ็ต flag เมื่อเกิดข้อผิดพลาด
      return console.log("Failed to fetch:", response.status);
    }

    const Result = await response.json();

    // const Result = await ApiPostForm(Data);

    if (Result.status === "error") {
      message.innerHTML = RenderHtml(Result);
      toast.classList.add("active");

      form.reset();

      setTimeout(() => {
        toast.classList.remove("active");
      }, 5000);

      isSubmitting = false;
      modal.close();

      return;
    }

    localStorage.setItem("account", JSON.stringify(Result));
    localStorage.setItem("StepOne", "true");
    localStorage.setItem("StepTwo", "false");

    form.reset();

    toast.classList.add("active");
    // setTimeout(() => {
    //   window.location.replace("http://localhost:5500/test/");
    // }, 3000);
    isSubmitting = false;
    modal.close();
  });
}
async function StepTwo() {
  const form = document.querySelector(".form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const modal = document.querySelector("#modal__dialog");
     account = document.querySelector('input[name="account"]').value;
     code = document.querySelector('input[name="codes"]').value;
     toast = document.querySelector(".toast");
     message = document.querySelector(".message");

    if (isSubmitting) return; // ถ้ามีการส่งคำขออยู่แล้ว ให้หยุดการส่งคำขอใหม่

    isSubmitting = true; // กำหนด flag ว่ากำลังส่งคำขอ
  

    if (account.length <= 0 || code.length <= 0) {
      message.innerHTML = `
            <span class="text text-1">Error</span>
    <span class="text text-2">กรุณากรอกยูสเซอร์ และ โค้ด</span>`;

      toast.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
      }, 5000);
      isSubmitting = false;
      return;
    }

    const data = {
      account: account,
      codes: code,
    };
    const response = await fetch("http://localhost:8000/free-credit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      isSubmitting = false;
      return console.log("Failed to fetch:", response.status);
    }

    const Result = await response.json();
    // const Result = await ApiPostForm(Data);

    if (Result.status === "error") {
      message.innerHTML += RenderHtml(Result);
      toast.classList.add("active");

      form.reset();

      setTimeout(() => {
        toast.classList.remove("active");
      }, 5000);
      isSubmitting = false;
      modal.close();
      return;
    }

    localStorage.setItem("account", JSON.stringify(Result));
    localStorage.setItem("StepTwo", "true");

    form.reset();

    toast.classList.add("active");
    // setTimeout(() => {
    //   window.location.replace("http://www.google.com");
    // }, 3000);
    isSubmitting = false;
    modal.close();
  });
}

function RenderHtml(result) {
  return `
  <span class="text text-1">${result.status}</span>
  <span class="text text-2">${result.message}</span>
`;
}

async function ApiPostForm(data) {
  const response = await fetch("http://localhost:8000/free-credit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) return console.log("Failed to fetch:", response.status);

  const result = await response.json();
  return result;
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
  let Colors = ["#ff0000", "#F75E25", "#ff00f1", "#f1ff00"];
  colortotal = Colors.length;

  colorindex = (colorindex + 1) % colortotal;
  return Colors[colorindex];
}
