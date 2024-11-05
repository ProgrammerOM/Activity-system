async function sendApi() {
  const form = document.querySelector(".form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const account = document.querySelector('input[name="account"]').value;
    const code = document.querySelector('input[name="codes"]').value;

    const Data = {
      account: account,
      codes: {
        redeemCode: code,
        isActive: true,
      },
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
const codes = document.querySelectorAll('.code')
let currentIndex = 0; // ตำแหน่งเริ่มต้นในการแสดงโค้ด
let totalElements = codes.length;
setInterval(() => {
  // ลบโค้ดจากทุก element
  codes.forEach(el => {
    el.innerText = "";
  });

  // แสดงโค้ดใหม่ใน element ปัจจุบัน
  codes[currentIndex].innerText = RandomCode();

  // ไปยัง element ถัดไป (ถ้าถึง element สุดท้ายแล้วก็วนกลับไปที่แรก)
  currentIndex = (currentIndex + 1) % totalElements;
}, 10000); // ทุกๆ 5 วินาที
}
