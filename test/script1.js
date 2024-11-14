let Codes = [];
let CodesIndex = 0;
let currentIndex = 0;
let totalCodes = 0;
let colorindex = 0;
let colortotal = 0;
let isSubmitting = false;

document.addEventListener("DOMContentLoaded", () => {
  const modal__free = document.querySelector("#modal__freecredit");
  const openModal = document.querySelector(".open-button__dialog");
  const closeModal = document.querySelector(".close-button__dialog");
  const closeModalFree = document.querySelector(".close-button__dialog-free");
  const stopModal = document.querySelector(".close-button__stop-free");

  // ModalAnnounce();

  stopModal.addEventListener("click", () => {
    modal__free.close();
    localStorage.setItem("modalClosed", "true");
  });

  closeModalFree.addEventListener("click", () => {
    modal__free.close();
  });

  openModal.addEventListener("click", CheckShowModal);

  closeModal.addEventListener("click", CloseModal);

  SetCodeSite();
});

async function handleStep() {
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

      ModalToast();
      isSubmitting = false;

      return;
    }

    const data = {
      account: account,
      codes: code,
    };

    const Result = await ApiPostForm(data);

    if (Result.status === "error") {
      message.innerHTML = RenderHtml(Result);

      form.reset();
      ModalToast();

      isSubmitting = false;
      CloseModal();

      return;
    } else {
      message.innerHTML = RenderHtml(Result);
      ModalToast();
    }

    ModalToast();

    localStorage.setItem("account", JSON.stringify(Result));

    const isStepOne = !localStorage.getItem("StepOne");
    const isStepTwo =
      localStorage.getItem("StepOne") === "true" &&
      localStorage.getItem("StepTwo") === "false";
    console.log(isStepTwo);

    if (isStepOne) {
      localStorage.setItem("StepOne", "true");
      localStorage.setItem("StepTwo", "false");
    } else if (isStepTwo) {
      localStorage.setItem("StepTwo", "true");
    }

    const lastActivityDate = !localStorage.getItem("lastActivityDate");
    if (lastActivityDate) {
      const currentDate = new Date();
      localStorage.setItem("lastActivityDate", currentDate.toISOString());
    }

    form.reset();

    setTimeout(() => {
      if (isStepOne) {
        window.location.replace("/promotions/");
      } else if (isStepTwo) {
        window.open("https://www.google.com/search?q=goatbet", "_blank");
      }
    }, 2000);

    isSubmitting = false;
    CloseModal();
  });
}

function RenderHtml(result) {
  return `
  <span class="text text-1">${result.status}</span>
  <span class="text text-2">${result.message}</span>
`;
}

async function ApiPostForm(data) {
  const response = await fetch("https://api.goat69.net/free-credit", {
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
  const response = await fetch("https://api.goat69.net/codes", {
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
  }, 5000);
}

function RandomColor() {
  let Colors = ["#ff0000", "#F75E25", "#ff00f1", "#f1ff00"];
  colortotal = Colors.length;

  colorindex = (colorindex + 1) % colortotal;
  return Colors[colorindex];
}

function CheckShowModal() {
  const announce = document.querySelector(".announce-freecredit");
  const message = document.querySelector(".message");
  const isStepOne = localStorage.getItem("StepOne");
  const isSteptwo = localStorage.getItem("StepTwo");

  const lastActivityDate = localStorage.getItem("lastActivityDate");
  const currentDate = new Date();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  const targetDate = new Date("2024-11-14T07:21:26.021Z");
  const timeDifferenceInMilliseconds = targetDate - currentDate;

  if (
    lastActivityDate &&
    currentDate - new Date(lastActivityDate) >= oneDayInMilliseconds
  ) {
    localStorage.clear();

    message.innerHTML = `
    <span class="text text-1">Success</span>
    <span class="text text-2">เริ่มกิจกรรม</span>`;

    ModalToast();
    OpenModal();
    handleStep();
    return;
  }

  if (isStepOne === "true" && isSteptwo === "true") {
    if (
      lastActivityDate &&
      currentDate - new Date(lastActivityDate) < oneDayInMilliseconds
    ) {
      const lastDate = new Date(lastActivityDate);
      const nextAvailableDate = new Date(
        lastDate.getTime() + oneDayInMilliseconds
      );

      // ฟอร์แมตวันที่เป็นรูปแบบที่อ่านง่าย
      const formattedDate = nextAvailableDate.toLocaleString("th-TH", {
        weekday: "long", // แสดงวัน (เช่น "วันจันทร์")
        year: "numeric", // แสดงปี
        month: "long", // แสดงเดือน (เช่น "มกราคม")
        day: "numeric", // แสดงวัน (เช่น 25)
        hour: "2-digit", // แสดงเวลา
        minute: "2-digit",
        second: "2-digit",
      });

      console.log(formattedDate);

      // announce.innerHTML = `<p>คุณสามารถทำกิจกรรมได้แค่วันละครั้ง</p>`;
      message.innerHTML = `
            <span class="text text-1">Error</span>
            <span class="text text-2">คุณสามารถทำกิจกรรมได้แค่วันละครั้ง</span>`;

      ModalToast();
      return;
    }
  }

  if (isStepOne === "true") {
    console.log("StepTwo");
    OpenModal();
    handleStep();
  } else {
    console.log("StepOne");
    OpenModal();
    handleStep();
  }
}

function OpenModal() {
  const modal = document.querySelector("#modal__dialog");
  modal.showModal();
}

function CloseModal() {
  const form = document.querySelector(".form");
  const modal = document.querySelector("#modal__dialog");
  form.reset();
  modal.close();
}

function ModalToast() {
  const toast = document.querySelector(".toast");

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

  //   setTimeout(() => {
  //     modal__free.close();
  //   }, 5000);
}
