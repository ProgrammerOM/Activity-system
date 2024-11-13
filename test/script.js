let Codes = [];
let CodesIndex = 0;
let currentIndex = 0;
let totalCodes = 0;
let colorindex = 0;
let colortotal = 0;
let isSubmitting = false;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("#modal__dialog");
  modal__free = document.querySelector("#modal__freecredit");
  announce = document.querySelector(".announce-freecredit");
  openModal = document.querySelector(".open-button__dialog");
  closeModal = document.querySelector(".close-button__dialog");
  closeModalFree = document.querySelector(".close-button__dialog-free");
  stopModal = document.querySelector(".close-button__stop-free");
  toast = document.querySelector(".toast");
  message = document.querySelector(".message");
  form = document.querySelector(".form");
  Stepone = localStorage.getItem("StepOne");
  Steptwo = localStorage.getItem("StepTwo");

  const lastActivityDate = localStorage.getItem("lastActivityDate");
  const currentDate = new Date();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  ModalAnnounce();

  stopModal.addEventListener("click", () => {
    modal__free.close();
    localStorage.setItem("modalClosed", "true");
  });

  closeModalFree.addEventListener("click", () => {
    modal__free.close();
  });

  if (Stepone === "true" && Steptwo === "true") {
    message.innerHTML = `
            <span class="text text-1">Error</span>
    <span class="text text-2">ไม่สามารถทำกิจกรรมนี้ได้</span>`;

    ModalToast();

    if (
      lastActivityDate &&
      currentDate - new Date(lastActivityDate) < oneDayInMilliseconds
    ) {
      announce.innerHTML = `<p>คุณสามารถทำกิจกรรมได้แค่วันละครั้ง</p>`;
      message.innerHTML = `
      <span class="text text-1">Error</span>
      <span class="text text-2">คุณสามารถทำกิจกรรมได้แค่วันละครั้ง</span>`;

      ModalToast();
      return;
    }
  }

  openModal.addEventListener("click", () => {
    toast.classList.add("active");
    const Stepone = localStorage.getItem("StepOne");
    if (Stepone) {
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
    modal__free.close();
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

    if (isSubmitting) return;

    isSubmitting = true;

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

    const Result = await ApiPostForm(data);

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

    const currentDate = new Date();
    localStorage.setItem("lastActivityDate", currentDate.toISOString());

    form.reset();

    toast.classList.add("active");
    setTimeout(() => {
      window.location.replace("/promotions/");
    }, 3000);
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

    if (isSubmitting) return;

    isSubmitting = true;

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

    const Result = await ApiPostForm(data);

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
    setTimeout(() => {
      window.location.replace("https://www.google.com/search?q=goatbet");
    }, 3000);
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

  if (!response.ok) {
    return console.log("Failed to fetch:", response.status);
  }

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
  console.log(codeElements);
  let totalElements = codeElements.length;

  setInterval(async () => {
    let Total = 0;

    for (let i = 0; i < totalElements; i++) {
      codeElements[i].innerHTML = "";
    }

    while (Total < totalCodes) {
      if (Codes[CodesIndex].isActive === false) {
        codeElements[currentIndex].style.color = RandomColor();
        codeElements[currentIndex].innerHTML = Codes[CodesIndex].code;
      }
      Total++;
    }
    CodesIndex = (CodesIndex + 1) % totalCodes;
    currentIndex = (currentIndex + 1) % totalElements;

    console.log(
      `ตำแหน่งที่แสดง : ${currentIndex}  ข้อมูล : ${Codes[CodesIndex].code}`
    );
  }, 2000);
}

function RandomColor() {
  let Colors = ["#ff0000", "#F75E25", "#ff00f1", "#f1ff00"];
  colortotal = Colors.length;

  colorindex = (colorindex + 1) % colortotal;
  return Colors[colorindex];
}

function ModalToast() {
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 5000);
}

function ModalAnnounce() {
  const isModalClosed = localStorage.getItem("modalClosed");

  if (isModalClosed === "true") {
    return;
  }

  const modal__free = document.querySelector("#modal__freecredit");
  modal__free.showModal();

  setTimeout(() => {
    modal__free.close();
  }, 5000);
}
