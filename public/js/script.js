const socket = io(); // เชื่อมต่อกับ Socket.io server
let currentPage = 1;
let rowsPerPage = 15;
let displayedData = [];
let searchQuery = "";

const maxPageLinks = 3; // จำนวนลิงก์หน้าสูงสุดที่จะแสดง

let notificationsEnabled = false; // สถานะการเปิดใช้งานเสียงแจ้งเตือน

// ฟังก์ชันเปิดใช้งานการแจ้งเตือน (จากการโต้ตอบเริ่มต้น)
function enableNotifications() {
  if (!notificationsEnabled) {
    notificationsEnabled = true;
    const sound = document.getElementById("notificationSound");
    sound.play().catch((error) => {
      console.error("ไม่สามารถเล่นเสียงได้:", error);
    });
  }
}

// ฟังก์ชันที่ใช้ในการแสดงข้อมูลในตาราง
function renderTable(data) {
  const tableBody = document.getElementById("tableBody");
  const paginationInfo = document.getElementById("paginationInfo");
  const searchRegex = new RegExp(searchQuery, "i");

  // กรองข้อมูลตามการค้นหา
  const filteredData = data.filter(
    (item) =>
      item.account.match(searchRegex) ||
      item._id.match(searchRegex) ||
      item.firstCode.match(searchRegex) ||
      item.secondCode.match(searchRegex) ||
      item.status.match(searchRegex)
  );

  // เรียงข้อมูลจากใหม่ไปเก่า
  const sortedData = filteredData.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // คำนวณจำนวนหน้าที่มีข้อมูลจากข้อมูลที่กรองแล้ว
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = currentPage * rowsPerPage;
  const paginatedData = sortedData.slice(start, end);

  // แสดงข้อมูลในตาราง
  tableBody.innerHTML = paginatedData
    .map((item) => {
      const date = new Date(item.createdAt);
      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}/${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${date.getFullYear()} ${String(date.getHours()).padStart(
        2,
        "0"
      )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
        date.getSeconds()
      ).padStart(2, "0")}`;

      const fillTime = getFillTime(date);

      const buttonClass =
        item.status === "เติมแล้ว" ? "bg-green-500" : "bg-red-500";

      return `
      <tr>
        <td class="px-4 py-2 font-light text-center">${formattedDate}</td>
        <td class="px-4 py-2 font-light text-center">${item._id}</td>
        <td class="px-4 py-2 font-light text-center">${item.account}</td>
        <td class="px-4 py-2 font-light text-center">${item.firstCode}</td>
        <td class="px-4 py-2 font-light text-center">${item.secondCode}</td>
        <td class="px-4 py-2 font-light text-center">${fillTime}</td>
        <td class="px-4 py-2 font-light text-center">${item.status}</td>
        <td class="px-4 py-2 font-light text-center">
        <button class="text-white p-2 rounded-lg ${buttonClass}" data-id-action="${item._id}">เรียบร้อย</button>
        </td>
      </tr>
    `;
    })
    .join("");

  // อัปเดตข้อมูลการแบ่งหน้า
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  // สร้างปุ่มสำหรับแต่ละหน้า
  const pageNumbersContainer = document.getElementById("pageNumbers");
  pageNumbersContainer.innerHTML = "";

  // คำนวณหน้าเริ่มต้นและหน้าสิ้นสุดที่จะต้องแสดง
  const startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
  const endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

  // สร้างปุ่มหมายเลขหน้าที่จะแสดง
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add(
      "px-4",
      "py-2",
      "bg-gray-300",
      "text-gray-700",
      "rounded",
      "hover:bg-blue-500",
      "hover:text-white"
    );
    if (i === currentPage) {
      pageButton.classList.add("bg-blue-500", "text-white");
    }

    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderTable(displayedData); // Render again when the page is clicked
    });

    pageNumbersContainer.appendChild(pageButton);
  }

  // แสดงหรือซ่อนปุ่ม "Previous" และ "Next"
  document
    .getElementById("prevPageBtn")
    .classList.toggle("hidden", currentPage === 1);
  document
    .getElementById("nextPageBtn")
    .classList.toggle("hidden", currentPage === totalPages);
}

// การค้นหา
document.getElementById("searchInput").addEventListener("input", (event) => {
  searchQuery = event.target.value;
  currentPage = 1; // รีเซ็ตหน้าเป็น 1 เมื่อทำการค้นหาใหม่
  renderTable(displayedData); // Re-render when search query changes
});

// เพิ่มข้อมูลใหม่จากเซิร์ฟเวอร์
socket.on("Data", (data) => {
  console.log("Received Data:", data);

  if (!displayedData.some((item) => item._id === data._id)) {
    // ถ้าไม่มีก็เพิ่มข้อมูล
    displayedData.push(data);
    sessionStorage.setItem("displayedData", JSON.stringify(displayedData)); // เก็บข้อมูลใน sessionStorage
    renderTable(displayedData); // Re-render after data is received
  }
});
window.addEventListener("load", () => {
  const savedData = sessionStorage.getItem("displayedData");
  if (savedData) {
    displayedData = JSON.parse(savedData);
    renderTable(displayedData); // เรนเดอร์ข้อมูลจาก sessionStorage
  }
});

// การอัปเดตข้อมูลใหม่
socket.on("UpdateData", (newData) => {
  console.log("Received new update:", newData);
  displayedData.push(newData);
  renderTable(displayedData); // Re-render after update data is received
  sessionStorage.setItem("displayedData", JSON.stringify(displayedData)); // เก็บข้อมูลใน sessionStorage
  enableNotifications();
});

socket.on("UpdateStatus", (newData) => {
  console.log("Received new status:", newData);
  const updatedItemIndex = displayedData.findIndex(
    (item) => item._id === newData._id
  );
  console.log(updatedItemIndex);
  if (updatedItemIndex !== -1) {
    displayedData[updatedItemIndex].status = newData.status;
    renderTable(displayedData);
    sessionStorage.setItem("displayedData", JSON.stringify(displayedData)); // เก็บข้อมูลใน sessionStorage
  } else {
    console.log("Item not found for update.");
  }
});

// ปุ่ม Previous และ Next
document.getElementById("prevPageBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(displayedData); // Render when Previous is clicked
  }
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(displayedData.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable(displayedData); // Render when Next is clicked
  }
});

// ฟังก์ชันคำนวณเวลาที่ต้องเติม
function getFillTime(date) {
  const hour = date.getHours();

  if (hour >= 0 && hour < 6) {
    return "เติมก่อน 10:00";
  } else if (hour >= 6 && hour < 12) {
    return "เติมก่อน 14:00";
  } else if (hour >= 12 && hour < 18) {
    return "เติมก่อน 20:00";
  } else if (hour >= 18 && hour < 24) {
    return "เติมก่อน 02:00";
  }
}

document.getElementById("tableBody").addEventListener("click", (e) => {
  if (e.target && e.target.matches("button[data-id-action]")) {
    const idAction = e.target.getAttribute("data-id-action");
    console.log("ปุ่มที่ถูกคลิก:", idAction); // id ของปุ่มที่ถูกคลิก

    ApiUpdate(idAction);
  }
});

async function ApiUpdate(id) {
  try {
    const response = await axios.post(
      `${window.location.origin}/update-status`,
      {
        id: id,
        status: "เติมแล้ว",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}
