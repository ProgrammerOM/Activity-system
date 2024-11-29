const socket = io("", {
  path: "/socket.io",
  transports: ["websocket"],
  secure: true,
});

let displayedData = [];
let currentPage = 1; // หน้าแรก
let limit = 10; // จำนวนรายการต่อหน้า
let rowsPerPage = 10; // จำนวนรายการต่อหน้า
let totalPages = 1;
let totalSearchPages = 1;
let searchQuery = "";
let currentSearchPage = 1; // หน้าแรกของการค้นหา
let searchLimit = 10; // จำนวนรายการต่อหน้า
let maxPageLinks = 3; // จำนวนลิงก์หน้าสูงสุดที่จะแสดง
let notificationsEnabled = false; // สถานะการเปิดใช้งานเสียงแจ้งเตือน

window.addEventListener("load", () => {
  const savedData = sessionStorage.getItem("displayedData");
  if (savedData) {
    displayedData = JSON.parse(savedData);
    renderTable(displayedData); // เรนเดอร์ข้อมูลจาก sessionStorage
  }
});

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
  console.log(data);
  const tableBody = document.getElementById("tableBody");
  const paginationInfo = document.getElementById("paginationInfo");
  const Item = data.data;

  // แสดงข้อมูลในตาราง
  tableBody.innerHTML = Item.map((item) => {
    // กรองข้อมูลตามการค้นหา
    const date = new Date(item.createdAt);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;

    const fillTime = getFillTime(date);

    const buttonClass =
      item.status === "เติมแล้ว" ? "bg-green-500" : "bg-red-500";
    const TextClass =
      item.status === "เติมแล้ว" ? "เรียบร้อย" : "ยังไม่เรียบร้อย";

    return `
    <tr>
      <td class="px-4 py-2 font-light text-center">${formattedDate}</td>
      <td class="px-4 py-2 font-light text-center">${item._id}</td>
      <td class="px-4 py-2 font-light text-center">${item.account}</td>
      <td class="px-4 py-2 font-light text-center">${item.firstCode[0].code}</td>
      <td class="px-4 py-2 font-light text-center">${item.secondCode[0].code}</td>
      <td class="px-4 py-2 font-light text-center">${fillTime}</td>
      <td class="px-4 py-2 font-light text-center">${item.status}</td>
      <td class="px-4 py-2 font-light text-center">
      <button class="text-sm text-white p-2 rounded-lg ${buttonClass}" data-id-action="${item._id}">${TextClass}</button>
      </td>
    </tr>
  `;
  }).join("");

  // อัปเดตข้อมูลการแบ่งหน้า
  paginationInfo.textContent = `Page ${
    searchQuery ? currentSearchPage : currentPage
  } of ${searchQuery ? totalSearchPages : totalPages}`;

  // สร้างปุ่มสำหรับแต่ละหน้า
  const pageNumbersContainer = document.getElementById("pageNumbers");
  pageNumbersContainer.innerHTML = "";

  // คำนวณหน้าเริ่มต้นและหน้าสิ้นสุดที่จะต้องแสดง
  const startPage = Math.max(
    1,
    searchQuery ? currentSearchPage : currentPage - Math.floor(maxPageLinks / 2)
  );
  const endPage = Math.min(
    searchQuery ? totalSearchPages : totalPages,
    startPage + maxPageLinks - 1
  );

  // สร้างปุ่มหมายเลขหน้าที่จะแสดง
  for (let page = startPage; page <= endPage; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page;
    pageButton.classList.add(
      "px-4",
      "py-2",
      "bg-gray-300",
      "text-gray-700",
      "rounded-lg",
      "hover:bg-blue-500",
      "hover:text-white"
    );
    if (!searchQuery && page === currentPage) {
      console.log("currentPage", currentPage);
      pageButton.classList.remove("bg-gray-300");
      pageButton.classList.add("bg-blue-500", "text-white");
    } else if (searchQuery && page === currentSearchPage) {
      console.log("currentSearchPage", currentSearchPage);
      pageButton.classList.remove("bg-gray-300");
      pageButton.classList.add("bg-blue-500", "text-white");
    }

    pageButton.addEventListener("click", () => {
      if (searchQuery) {
        currentSearchPage = page;
        socket.emit(
          "searchQuery",
          searchQuery,
          currentSearchPage,
          searchLimit,
          (response) => {
            if (response.success) {
              displayedData = response;
              renderTable(displayedData);
            }
          }
        );
      } else {
        currentPage = page;
        socket.emit("Alldata", currentPage, limit);
        console.log(`Switched to page ${page}`);
        renderTable(displayedData);
      }
    });

    pageNumbersContainer.appendChild(pageButton);
  }

  // แสดงหรือซ่อนปุ่ม "Previous" และ "Next"
  document
    .getElementById("prevPageBtn")
    .classList.toggle(
      "hidden",
      (searchQuery && currentSearchPage === 1) ||
        (!searchQuery && currentPage === 1)
    );
  document
    .getElementById("nextPageBtn")
    .classList.toggle(
      "hidden",
      (searchQuery && currentSearchPage === totalSearchPages) ||
        (!searchQuery && currentPage === totalPages)
    );
}

// การค้นหา
document.getElementById("searchInput").addEventListener("input", (event) => {
  searchQuery = event.target.value.trim();

  if (searchQuery === "") {
    currentPage = 1;
    socket.emit("Alldata", currentPage, limit);
  } else {
    currentSearchPage = 1;
    console.log(currentSearchPage);
    socket.emit(
      "searchQuery",
      searchQuery,
      currentSearchPage,
      searchLimit,
      (response) => {
        if (response.success) {
          displayedData = response;
          totalSearchPages = response.totalPages;
          renderTable(displayedData);
        } else {
          console.log(response.message);
        }
      }
    );
  }
});

document.getElementById("prevPageBtn").addEventListener("click", () => {
  if (searchQuery && currentSearchPage > 1) {
    currentSearchPage--;
    socket.emit(
      "searchQuery",
      searchQuery,
      currentSearchPage,
      searchLimit,
      (response) => {
        if (response.success) {
          displayedData = response;
          renderTable(displayedData);
        }
      }
    );
    console.log(`Previous page clicked, currentPage: ${currentSearchPage}`);
  } else if (!searchQuery && currentPage > 1) {
    currentPage--;
    socket.emit("Alldata", currentPage, limit);
    console.log(`Previous page clicked, currentPage: ${currentPage}`);
    renderTable(displayedData); // Render when Previous is clicked
  }
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
  if (searchQuery && currentSearchPage < totalSearchPages) {
    currentSearchPage++;
    socket.emit(
      "searchQuery",
      searchQuery,
      currentSearchPage,
      searchLimit,
      (response) => {
        if (response.success) {
          displayedData = response;
          renderTable(displayedData);
        }
      }
    );
    console.log(`Next page clicked, currentPage: ${currentSearchPage}`);
  } else if (!searchQuery && currentPage < totalPages) {
    currentPage++;
    socket.emit("Alldata", currentPage, limit);
    console.log(`Next page clicked, currentPage: ${currentPage}`);
    renderTable(displayedData);
  }
});

document.getElementById("tableBody").addEventListener("click", (e) => {
  if (e.target && e.target.matches("button[data-id-action]")) {
    const idAction = e.target.getAttribute("data-id-action");

    Modal(idAction);
  }
});

// เพิ่มข้อมูลใหม่จากเซิร์ฟเวอร์
socket.on("Data", (data) => {
  const { totalPages: total } = data;
  totalPages = total;
  // console.log("Received Data:", data);

  // if (!displayedData.some((item) => item._id === data._id)) {
  // ถ้าไม่มีก็เพิ่มข้อมูล
  displayedData = data;
  sessionStorage.setItem("displayedData", JSON.stringify(displayedData)); // เก็บข้อมูลใน sessionStorage
  renderTable(displayedData); // Re-render after data is received
  // }
});

// การอัปเดตข้อมูลใหม่
socket.on("UpdateData", (newData) => {
  console.log(newData);
  const data = displayedData.data;

  const pushs = data.unshift(newData);
  console.log(pushs);

  totalPages = Math.ceil(displayedData.data.length / rowsPerPage);

  // จำกัดข้อมูลที่จะแสดงเฉพาะหน้าแรก
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = {
    data: displayedData.data.slice(startIndex, endIndex),
    totalPages: totalPages,
  };
  console.log(paginatedData);

  renderTable(paginatedData);
  sessionStorage.setItem("displayedData", JSON.stringify(displayedData));
  enableNotifications();
});

socket.on("UpdateStatus", (newData) => {
  const data = displayedData.data;
  if (!data) return;
  console.log(newData);
  // console.log("Received new status:", newData);

  console.log("displayedData", displayedData);
  const updatedItemIndex = data.findIndex((item) => item._id === newData._id);
  console.log(updatedItemIndex);
  console.log(data[updatedItemIndex]);
  if (updatedItemIndex !== -1) {
    data[updatedItemIndex].status = newData.status;
    renderTable(displayedData);
    sessionStorage.setItem("displayedData", JSON.stringify(displayedData)); // เก็บข้อมูลใน sessionStorage
  } else {
    console.log("Item not found for update.");
  }
});

socket.emit("Alldata", currentPage, limit);

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

async function Modal(id) {
  const modal = document.querySelector(".modal--tip");
  const cancel = document.querySelector("#cancel");
  const confirm = document.querySelector("#confirm");

  modal.showModal();

  cancel.addEventListener("click", () => {
    modal.close();
  });
  confirm.addEventListener("click", async () => {
    await ApiUpdate(id);
    modal.close();
  });
}
