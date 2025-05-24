const API_BASE = "https://ezibee.io/api/Intelio";
const API_AUTH = "Basic " + btoa("intelio:test#api");

async function fetchAPI(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: API_AUTH,
    },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}/${endpoint}`, options);
  return res.json();
}

document.addEventListener("DOMContentLoaded", function () {
  let guestData = null;
  window.cart = [];
  let currentService = null;
  let currentCategory = null;
  let discount = 0;
  let isSidebarCollapsed = false;

  // Elements
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeMobileMenuBtn = document.getElementById("closeMobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const sidebarItemTexts = document.querySelectorAll(".sidebar-item-text");
  const serviceScreen = document.getElementById("serviceScreen");
  const categoryScreen = document.getElementById("categoryScreen");
  const menuItemsScreen = document.getElementById("menuItemsScreen");
  const cartScreen = document.getElementById("cartScreen");
  const confirmationScreen = document.getElementById("confirmationScreen");
  const cartButton = document.getElementById("cartButton");
  const backToServices = document.getElementById("backToServices");
  const backButton = document.getElementById("backButton");
  const servicesList = document.getElementById("servicesList");
  const categoriesList = document.getElementById("categoriesList");
  const menuItemsList = document.getElementById("menuItemsList");
  const cartItems = document.getElementById("cartItems");
  const categoryTitle = document.getElementById("categoryTitle");
  const menuTitle = document.getElementById("menuTitle");
  const cartCount = document.getElementById("cartCount");
  const sidebarCartCount = document.getElementById("sidebarCartCount");
  const totalEl = document.getElementById("total");
  const continueShopping = document.getElementById("continueShopping");
  const backToShoppingBtn = document.getElementById("backToShoppingBtn");
  const backToShopping = document.getElementById("backToShopping");
  const checkout = document.getElementById("checkout");
  const newOrder = document.getElementById("newOrder");
  const orderNumber = document.getElementById("orderNumber");
  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const guestFormScreen = document.getElementById("guestFormScreen");
  const navLinks = document.querySelectorAll(".nav-link");
  const guestForm = document.getElementById("guestInfoForm");
  // Sidebar Toggle
  toggleSidebarBtn.addEventListener("click", function () {
    isSidebarCollapsed = !isSidebarCollapsed;
    if (isSidebarCollapsed) {
      sidebar.classList.add("collapsed");
      mainContent.classList.remove("md:ml-64");
      mainContent.classList.add("md:ml-20");
      sidebarItemTexts.forEach((text) => {
        text.classList.add("hidden");
      });
      toggleSidebarBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    `;
    } else {
      sidebar.classList.remove("collapsed");
      mainContent.classList.remove("md:ml-20");
      mainContent.classList.add("md:ml-64");
      sidebarItemTexts.forEach((text) => {
        text.classList.remove("hidden");
      });
      toggleSidebarBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    `;
    }
  });

  // Mobile Menu
  mobileMenuBtn.addEventListener("click", function () {
    sidebar.classList.add("open");
    mobileMenuOverlay.classList.remove("hidden");
  });

  closeMobileMenuBtn.addEventListener("click", function () {
    sidebar.classList.remove("open");
    mobileMenuOverlay.classList.add("hidden");
  });

  mobileMenuOverlay.addEventListener("click", function () {
    sidebar.classList.remove("open");
    mobileMenuOverlay.classList.add("hidden");
  });

  // Navigation Links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetScreen = this.getAttribute("data-screen");

      // Cập nhật active link
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      this.classList.add("active");

      // ✅ Nếu là giỏ hàng thì cập nhật lại giao diện trước khi hiện
      if (targetScreen === "cartScreen") {
        updateCartUI();
      }

      showScreen(document.getElementById(targetScreen));
      sidebar.classList.remove("open");
      mobileMenuOverlay.classList.add("hidden");
    });
  });

  function navigateToService(service) {
    currentService = service;
    window.currentService = service;
    if (service.hasCategories) {
      renderCategories(service.id);
      categoryTitle.textContent = service.Name + " - Danh Mục";
      showScreen(categoryScreen);
    } else {
      renderMenuItems(null, service.id);
      menuTitle.textContent = service.Name;
      showScreen(menuItemsScreen);
    }

    // Close mobile menu if open
    sidebar.classList.remove("open");
    mobileMenuOverlay.classList.add("hidden");
  }

  backToServices.addEventListener("click", function () {
    showScreen(serviceScreen);
  });

  backButton.addEventListener("click", function () {
    if (currentCategory) {
      showScreen(categoryScreen);
      currentCategory = null;
    } else {
      showScreen(serviceScreen);
    }
  });

  cartButton.addEventListener("click", function () {
    updateCartUI();
    showScreen(cartScreen);
  });

  continueShopping.addEventListener("click", function () {
    updateCartUI();
    showScreen(serviceScreen);
  });

  backToShoppingBtn.addEventListener("click", function () {
    updateCartUI();
    showScreen(serviceScreen);
  });

  backToShopping.addEventListener("click", function () {
    updateCartUI();
    showScreen(serviceScreen);
  });

  newOrder.addEventListener("click", function () {
    window.cart = [];
    updateCartUI();
    updateCartCount();
    showScreen(serviceScreen);
  });

  function showScreen(screen) {
    const protectedScreens = [
      "serviceScreen",
      "categoryScreen",
      "menuItemsScreen",
    ];
    if (
      protectedScreens.includes(screen.id) &&
      (!window.guestData?.GuestName || !window.guestData?.Phone)
    ) {
      showToast("Vui lòng nhập thông tin khách hàng trước!", "error");
      return handleGuestInfoButton();
    }

    document
      .querySelectorAll(
        "#welcomeScreen, #guestFormScreen, #guestInfoScreen, #serviceScreen, #categoryScreen, #menuItemsScreen, #cartScreen, #confirmationScreen"
      )
      .forEach((el) => el.classList.add("hidden"));

    screen.classList.remove("hidden");
    screen.classList.add("fade-in");
    setTimeout(() => screen.classList.remove("fade-in"), 500);
  }

  function renderSidebarServices(services) {
    const container = document.getElementById("sidebarDynamicServices");
    container.innerHTML = "";

    services.forEach((service) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <a href="#" class="sidebar-item flex items-center px-4 py-3" data-id="${service.ID}">
        <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span class="ml-3 sidebar-item-text">${service.Name}</span>
      </a>
    `;

      li.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        currentService = service;
        renderCategories(service.ID, service.Name);
        categoryTitle.textContent = service.Name + " - Danh Mục";
        showScreen(categoryScreen);
      });

      container.appendChild(li);
    });
  }
  function renderServices(serviceList) {
    const itemsPerPage = 20;
    let currentPage = 1;
    function showPage(page) {
      servicesList.innerHTML = "";
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = serviceList.slice(start, end);
      pageItems.forEach((service) => {
        const serviceCard = document.createElement("div");
        serviceCard.className =
          "card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg relative";

        const container = document.createElement("div");
        container.className = "relative w-full h-40";

        const label = document.createElement("div");
        label.className =
          "absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2 text-sm font-semibold";
        label.textContent = service.Name;

        if (service.ImageUrl) {
          const img = document.createElement("img");
          img.src = service.ImageUrl;
          img.alt = service.Name;
          img.className = "w-full h-40 object-cover";

          img.onerror = () => {
            container.innerHTML = `
          <div class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">
            ${service.Name}
          </div>`;
            container.appendChild(label);
          };

          container.appendChild(img);
          container.appendChild(label);
        } else {
          container.innerHTML = `
        <div class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">
          ${service.Name}
        </div>`;
          container.appendChild(label);
        }

        serviceCard.appendChild(container);

        serviceCard.addEventListener("click", function () {
          currentService = service;
          window.currentService = service;
          renderCategories(service.ID, service.Name);
          categoryTitle.textContent = service.Name + " - Danh Mục";
          showScreen(categoryScreen);
        });

        servicesList.appendChild(serviceCard);
      });
      renderPagination(
        "servicesPagination",
        serviceList.length,
        itemsPerPage,
        page,
        showPage
      );
    }
    showPage(currentPage);
  }
  async function renderCategories(serviceId, serviceName) {
    try {
      const res = await fetchAPI(
        `GetSaleItemCategories?posId=${serviceId}`,
        "POST"
      );

      if (res.error) {
        const categories = res.data;
        const itemsPerPage = 6;
        let currentPage = 1;

        function showPage(page) {
          categoriesList.innerHTML = "";
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const pageItems = categories.slice(start, end);

          pageItems.forEach((category) => {
            const categoryCard = document.createElement("div");
            categoryCard.className =
              "card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg relative";

            const container = document.createElement("div");
            container.className = "relative w-full h-40";

            const label = document.createElement("div");
            label.className =
              "absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2 text-sm font-semibold";
            label.textContent = category.Name;

            if (category.ImageUrl) {
              const img = document.createElement("img");
              img.src = category.ImageUrl;
              img.alt = category.Name;
              img.className = "w-full h-40 object-cover";

              img.onerror = () => {
                container.innerHTML = `<div class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">${category.Name}</div>`;
                container.appendChild(label);
              };

              container.appendChild(img);
              container.appendChild(label);
            } else {
              container.innerHTML = `<div class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">${category.Name}</div>`;
              container.appendChild(label);
            }

            categoryCard.appendChild(container);

            categoryCard.addEventListener("click", () => {
              currentCategory = category;
              renderMenuItems(
                serviceId,
                category.ID,
                `${serviceName} - ${category.Name}`
              );
              menuTitle.textContent = `${serviceName} - ${category.Name}`;
              showScreen(menuItemsScreen);
            });

            categoriesList.appendChild(categoryCard);
          });

          renderPagination(
            "categoriesPagination",
            categories.length,
            itemsPerPage,
            page,
            showPage
          );
        }

        showPage(currentPage);
        categoryTitle.textContent = serviceName + " - Danh Mục";
        showScreen(categoryScreen);
      } else {
        showToast("Không lấy được danh mục", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối danh mục", "error");
    }
  }

  async function renderMenuItems(serviceId, categoryId, title) {
    try {
      const res = await fetchAPI("GetSaleItems", "POST", {
        CategoryID: categoryId,
      });

      if (res.error) {
        const menuItems = res.data;
        const itemsPerPage = 6;
        let currentPage = 1;

        function showPage(page) {
          menuItemsList.innerHTML = "";
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const pageItems = menuItems.slice(start, end);

          pageItems.forEach((item) => {
            const itemCard = document.createElement("div");
            itemCard.className =
              "card bg-white rounded-lg shadow-md overflow-hidden";

            const imageContainer = document.createElement("div");
            imageContainer.className =
              "w-full h-40 bg-gray-200 flex items-center justify-center";

            const img = document.createElement("img");
            img.src = item.ImageUrl || "";
            img.alt = item.Name;
            img.className = "w-full h-40 object-cover";
            img.onerror = () => {
              imageContainer.innerHTML = "";
              imageContainer.classList.add("bg-gray-200");
            };

            if (item.ImageUrl) imageContainer.appendChild(img);

            const content = document.createElement("div");
            content.className = "p-4";
            content.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800">${item.Name}</h3>
            <div class="flex justify-between items-start mt-1">
              <span class="text-indigo-600 font-medium">${formatPrice(
                item.Price
              )}</span>
            </div>
            <p class="text-gray-600 mt-1 text-sm">${item.Description || ""}</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center">
                <button class="decrease-qty bg-gray-200 px-2 py-1 rounded-l-md hover:bg-gray-300">-</button>
                <input type="number" min="1" value="1" class="quantity-input border-t border-b border-gray-300 py-1 px-2 w-12 text-center">
                <button class="increase-qty bg-gray-200 px-2 py-1 rounded-r-md hover:bg-gray-300">+</button>
              </div>
              <button class="add-to-cart py-1 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Thêm</button>
            </div>
          `;

            itemCard.appendChild(imageContainer);
            itemCard.appendChild(content);

            const qtyInput = itemCard.querySelector(".quantity-input");
            itemCard.querySelector(".decrease-qty").onclick = () => {
              if (qtyInput.value > 1) qtyInput.value--;
            };
            itemCard.querySelector(".increase-qty").onclick = () => {
              qtyInput.value++;
            };
            itemCard.querySelector(".add-to-cart").onclick = () => {
              addToCart({
                id: item.ID,
                name: item.Name,
                price: item.Price,
                quantity: parseInt(qtyInput.value),
                image: item.ImageUrl || "",
                details: item.Description || "",
                posId: serviceId,
              });
              showToast(`Đã thêm ${item.Name}`);
            };

            menuItemsList.appendChild(itemCard);
          });

          renderPagination(
            "menuItemsPagination",
            menuItems.length,
            itemsPerPage,
            page,
            showPage
          );
        }

        showPage(currentPage);
        menuTitle.textContent = title;
        showScreen(menuItemsScreen);
      } else {
        showToast("Không tải được mặt hàng", "error");
      }
    } catch (e) {
      showToast("Lỗi kết nối API khi lấy mặt hàng", "error");
    }
  }

  function renderPagination(
    containerId,
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange
  ) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    const maxVisiblePages = 5;
    const edgePages = 2;

    const createButton = (
      label,
      page,
      isActive = false,
      isDisabled = false
    ) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className = `px-3 py-1 rounded-md ${
        isActive
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-700 border hover:bg-gray-100"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`;
      if (!isDisabled) {
        btn.onclick = () => onPageChange(page);
      }
      return btn;
    };

    // Prev button
    container.appendChild(
      createButton("<", currentPage - 1, false, currentPage === 1)
    );

    const pages = [];
    if (totalPages <= maxVisiblePages + edgePages * 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startRange = Array.from({ length: edgePages }, (_, i) => i + 1);
      const endRange = Array.from(
        { length: edgePages },
        (_, i) => totalPages - edgePages + 1 + i
      );
      const middleStart = Math.max(
        currentPage - Math.floor(maxVisiblePages / 2),
        edgePages + 1
      );
      const middleEnd = Math.min(
        currentPage + Math.floor(maxVisiblePages / 2),
        totalPages - edgePages
      );

      const middleRange = Array.from(
        { length: middleEnd - middleStart + 1 },
        (_, i) => middleStart + i
      );

      pages.push(...startRange);
      if (middleStart > edgePages + 1) pages.push("...");
      pages.push(...middleRange);
      if (middleEnd < totalPages - edgePages) pages.push("...");
      pages.push(...endRange);
    }

    for (const page of pages) {
      if (page === "...") {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "px-2 py-1 text-gray-500";
        container.appendChild(dots);
      } else {
        container.appendChild(createButton(page, page, page === currentPage));
      }
    }

    // Next button
    container.appendChild(
      createButton(">", currentPage + 1, false, currentPage === totalPages)
    );
  }
  function updateContactScreen() {
    const guest = window.guestData;
    if (!guest) return;

    const fields = [
      { key: "GuestName", label: "Tên khách hàng" },
      { key: "Phone", label: "Số điện thoại" },
      { key: "Email", label: "Email" },
      { key: "Address", label: "Địa chỉ" },
      { key: "IdentifyNo", label: "CMND/Hộ chiếu" },
      { key: "Note", label: "Ghi chú" },
    ];

    const container = document.getElementById("contactGuestInfo");
    if (!container) return;

    container.innerHTML = fields
      .map(({ key, label }) =>
        guest[key]
          ? `<p class="mb-2"><strong>${label}:</strong> ${guest[key]}</p>`
          : ""
      )
      .join("");
  }
  function handleGuestInfoButton() {
    const formScreen = document.getElementById("guestFormScreen");
    const roomNumber = extractRoomNumber();
    if (!roomNumber) return showScreen(formScreen);

    const useGuestData = (guest) => {
      window.guestData = guest;
      const hasInfo = guest?.GuestName?.trim() && guest?.Phone?.trim();
      if (hasInfo) return showGuestInfo();

      showScreen(formScreen);
      const fields = [
        "GuestName",
        "Phone",
        "Email",
        "Address",
        "IdentifyNo",
        "Note",
      ];
      fields.forEach((key) => {
        const input = formScreen.querySelector(`[name="${key}"]`);
        if (input && guest[key]) input.value = guest[key];
      });
    };

    if (window.guestData) return useGuestData(window.guestData);

    fetchAPI("GetGuestInfo", "POST", { RoomNo: roomNumber })
      .then((res) => {
        const guest = res?.data?.[0];
        if (guest) useGuestData(guest);
        else {
          showToast("Không tìm thấy thông tin khách", "error");
          showScreen(formScreen);
        }
      })
      .catch(() => {
        showToast("Lỗi khi lấy thông tin khách", "error");
        showScreen(formScreen);
      });
  }

  function showGuestForm() {
    const formScreen = document.getElementById("guestFormScreen");

    setTimeout(() => {
      const roomNumber = extractRoomNumber();
      if (!roomNumber) {
        showScreen(formScreen);
        return;
      }

      fetchAPI("GetGuestInfo", "POST", { RoomNo: roomNumber }).then((res) => {
        if (res) {
          const guest = res.data[0];

          const requiredFields = ["GuestName", "Phone"];
          const hasEnoughData = requiredFields.every(
            (field) => guest[field] && guest[field].trim() !== ""
          );

          // ✅ Lưu vào biến toàn cục
          window.guestData = guest;

          if (hasEnoughData) {
            showToast("Đã tự động nhận thông tin khách hàng");
            showScreen(document.getElementById("serviceScreen"));
          } else {
            // Điền form nếu thiếu dữ liệu
            showScreen(formScreen);
            const allowedFields = [
              "GuestName",
              "Phone",
              "Email",
              "Address",
              "IdentifyNo",
              "Note",
            ];
            allowedFields.forEach((key) => {
              const input = formScreen.querySelector(`[name='${key}']`);
              if (input && guest[key]) input.value = guest[key];
            });
          }
        } else {
          showToast("Không tìm thấy thông tin khách", "error");
          showScreen(formScreen);
        }
      });
    }, 100);
  }
  function extractRoomNumber() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("info")) {
      return params.get("info");
    }

    if (params.has("qr")) {
      const qr = decodeURIComponent(params.get("qr"));
      if (qr.includes("Room")) return qr.split("#")[0];
    }

    const match = decodeURIComponent(window.location.href).match(
      /([0-9]+)# ?Room/
    );
    if (match) return match[1];

    return null;
  }
  function loadWelcomeScreen() {
    fetchAPI("GetHotelInfo", "POST").then((res) => {
      if (res.data) {
        const hotel = res.data;
        window.hotelInfo = hotel;
        document.getElementById("hotelName").textContent =
          hotel.Name || "Khách sạn";
        if (hotel.WelcomeFontColor) {
          document.getElementById("hotelName").style.color =
            hotel.WelcomeFontColor;
        }
        document.getElementById("hotelTitle").textContent =
          hotel.Name || "Khách sạn";
        if (hotel.WelcomeFontColor) {
          document.getElementById("hotelTitle").style.color =
            hotel.WelcomeFontColor;
        }

        // Không dùng ảnh từ API => logo giữ nguyên
        document.getElementById("hotelPhone").textContent = `Hotline: ${
          hotel.Phone || "..."
        }`;
        document.getElementById("hotelAddress").textContent = `Địa chỉ: ${
          hotel.Address || "..."
        }`;
        document.getElementById("hotelEmail").textContent = `Email: ${
          hotel.Email || "..."
        }`;

        const roomText = document.getElementById("roomNoText");
        if (roomNumber && roomText) roomText.textContent = roomNumber;

        showScreen(document.getElementById("welcomeScreen"));
      } else {
        showToast("Không lấy được thông tin khách sạn", "error");
      }
    });
  }
  function showGuestInfo() {
    const guestInfoScreen = document.getElementById("guestInfoScreen");
    const guest = window.guestData;
    const roomNumber = extractRoomNumber();

    let infoHtml = `<p class="mb-2"><strong>Số phòng:</strong> ${roomNumber}</p>`;

    const fields = [
      { key: "GuestName", label: "Tên khách hàng" },
      { key: "Phone", label: "Số điện thoại" },
      { key: "Email", label: "Email" },
      { key: "Address", label: "Địa chỉ" },
      { key: "IdentifyNo", label: "CMND/Hộ chiếu" },
      { key: "Note", label: "Ghi chú" },
    ];

    fields.forEach(({ key, label }) => {
      const value = guest?.[key];
      if (value && value.trim()) {
        infoHtml += `<p class="mb-2"><strong>${label}:</strong> ${value}</p>`;
      }
    });

    guestInfoScreen.innerHTML = `
    <div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow text-left">
      <h2 class="text-2xl font-bold mb-4 text-indigo-700">Thông tin khách hàng</h2>
      ${infoHtml}
    </div>`;

    showScreen(guestInfoScreen);
  }

  function showContactScreen() {
    const hotel = window.hotelInfo;
    if (!hotel) {
      showToast("Thông tin khách sạn chưa sẵn sàng", "error");
      return;
    }

    document.getElementById("contactHotelName").textContent =
      hotel.Name || "...";
    document.getElementById("contactPhone").textContent = hotel.Phone || "...";
    document.getElementById("contactEmail").textContent = hotel.Email || "...";
    document.getElementById("contactAddress").textContent =
      hotel.Address || "...";
    updateContactScreen();
    showScreen(document.getElementById("contactScreen"));
  }

  function submitGuestOrder(cart, currentService) {
    if (
      !window.guestData ||
      !window.guestData.GuestName ||
      !window.guestData.Phone
    ) {
      showToast("Thông tin khách hàng không hợp lệ", "error");
      return;
    }

    const now = new Date();
    const currentTime = now
      .toLocaleString("en-US", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\//g, "/");

    let qr = new URLSearchParams(window.location.search).get("qr");
    if (!qr) {
      const match = window.location.href.match(/([0-9]+)#Room#/);
      if (match) qr = `${match[1]}#Room#...`;
    }
    const roomNo = extractRoomNumber();

    const orderDetails = cart.map((item) => ({
      GuestOrderID: "",
      ID: "",
      Date: now,
      ItemID: item.id,
      Qty: item.quantity,
      Price: item.price,
      Total: item.price * item.quantity,
      PosID: item.posId || "",
    }));

    const totalAmount = orderDetails.reduce((sum, item) => sum + item.Total, 0);
    if (!currentService || !currentService.ID) {
      console.error(
        "⚠️ currentService chưa được thiết lập đúng:",
        currentService
      );
      showToast("Chưa chọn dịch vụ phù hợp", "error");
      return;
    }
    const payload = {
      ID: "",
      GuestID: window.guestData?.ID || "",
      GuestName: window.guestData.GuestName,
      PhoneNumber: window.guestData.Phone,
      Email: window.guestData.Email || "",
      RoomNo: roomNo,
      PosID: currentService?.ID || "",
      FromDate: currentTime,
      ToDate: currentTime,
      OrderDetails: orderDetails,
      Total: totalAmount,
      Note: window.guestData.Note || "",
    };

    fetchAPI("UpdateGuestOrder", "POST", payload)
      .then((res) => {
        showToast("Đặt hàng thành công!");
        // ✅ Gán OrderNo vào confirmationScreen
        const orderNo = res.data?.OrderNo ? res.data?.OrderNo : "--";
        document.getElementById("orderNumber").textContent = orderNo;
        window.cart = [];
        window.updateCartCount?.();
        showScreen(document.getElementById("confirmationScreen"));
      })
      .catch(() => {
        showToast("Lỗi khi gửi đơn hàng", "error");
      });
  }
  function addToCart(item) {
    const existingItem = window.cart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      window.cart.push(item);
    }
    updateCartCount();
  }

  function updateCartCount() {
    const count = window.cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    sidebarCartCount.textContent = count;
  }

  function updateCartUI() {
    if (window.cart.length === 0) {
      emptyCart.classList.remove("hidden");
      cartContent.classList.add("hidden");
      return;
    }

    emptyCart.classList.add("hidden");
    cartContent.classList.remove("hidden");

    cartItems.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const row = document.createElement("tr");
      row.className = "hover:bg-gray-50";
      row.innerHTML = `
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-16 w-16">
                                    <img class="h-16 w-16 rounded-md object-cover" src="${
                                      item.image
                                    }" alt="${item.name}">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${
                                      item.name
                                    }</div>
                                    <div class="text-sm text-gray-500">${
                                      item.details
                                    }</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">${formatPrice(
                              item.price
                            )}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <button class="cart-decrease-qty bg-gray-200 px-2 py-1 rounded-l-md hover:bg-gray-300">-</button>
                                <input type="number" min="1" value="${
                                  item.quantity
                                }" class="cart-quantity-input border-t border-b border-gray-300 py-1 px-2 w-12 text-center" data-index="${index}">
                                <button class="cart-increase-qty bg-gray-200 px-2 py-1 rounded-r-md hover:bg-gray-300">+</button>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">${formatPrice(
                              itemTotal
                            )}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="remove-item text-red-600 hover:text-red-900">Xóa</button>
                        </td>
                    `;

      const quantityInput = row.querySelector(".cart-quantity-input");

      row
        .querySelector(".cart-decrease-qty")
        .addEventListener("click", function () {
          if (item.quantity > 1) {
            item.quantity--;
            quantityInput.value = item.quantity;
            updateCartUI();
          }
        });

      row
        .querySelector(".cart-increase-qty")
        .addEventListener("click", function () {
          item.quantity++;
          quantityInput.value = item.quantity;
          updateCartUI();
        });

      quantityInput.addEventListener("change", function () {
        const newQuantity = parseInt(this.value);
        if (newQuantity > 0) {
          item.quantity = newQuantity;
          updateCartUI();
        } else {
          this.value = item.quantity;
        }
      });

      row.querySelector(".remove-item").addEventListener("click", function () {
        cart.splice(index, 1);
        updateCartUI();
        updateCartCount();
      });

      cartItems.appendChild(row);
    });

    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    totalEl.textContent = formatPrice(total);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }

  // Initialize
  updateCartCount();
  const roomNumber = extractRoomNumber();
  if (roomNumber) {
    currentRoom = roomNumber;

    const roomInfoEl = document.getElementById("roomInfo");
    if (roomInfoEl) {
      roomInfoEl.textContent = `(Phòng ${currentRoom})`;
    }

    const roomText = document.getElementById("roomNoText");
    if (roomText) {
      roomText.textContent = currentRoom;
    }
  }

  // 📦 Gọi API lấy danh sách dịch vụ
  fetchAPI("GetPOSList", "POST")
    .then((res) => {
      if (res.error) {
        renderServices(res.data.Categories);
        renderSidebarServices(res.data.Categories);
      } else {
        showToast("Lỗi lấy danh sách dịch vụ", "error");
      }
    })
    .catch(() => {
      showToast("Không thể kết nối máy chủ", "error");
    });
  loadWelcomeScreen();
  // Gắn sự kiện nút "Xem dịch vụ"
  document.getElementById("goToServicesBtn")?.addEventListener("click", () => {
    showScreen(document.getElementById("serviceScreen"));
  });
  // Gắn sự kiện nút "Xem dịch vụ"
  document.getElementById("hotelTitle")?.addEventListener("click", () => {
    showScreen(document.getElementById("serviceScreen"));
  });
  // Xử lý form thông tin khách
  cartButton.addEventListener("click", function () {
    if (!window.currentService || !window.currentService.ID) {
      showToast("Bạn cần chọn dịch vụ trước khi thanh toán", "error");
      return;
    }
    updateCartUI();
    showScreen(cartScreen);
  });
  if (guestForm) {
    guestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const form = e.target;
      guestData = Object.fromEntries(new FormData(form).entries());

      if (!guestData.GuestName || !guestData.Phone) {
        document.getElementById("guestFormError").textContent =
          "Vui lòng điền đầy đủ thông tin bắt buộc.";
        document.getElementById("guestFormError").classList.remove("hidden");
        return;
      }

      if (!/^0\d{9}$/.test(guestData.Phone)) {
        document.getElementById("guestFormError").textContent =
          "Số điện thoại phải bắt đầu bằng số 0 và gồm đúng 10 chữ số.";
        document.getElementById("guestFormError").classList.remove("hidden");
        return;
      }

      const btn = document.getElementById("submitGuestForm");
      btn.disabled = true;
      btn.textContent = "Đang xử lý...";

      // Lưu dữ liệu khách hàng vào biến toàn cục
      window.guestData = guestData;

      // Tiếp tục đến màn dịch vụ, không gửi đơn hàng ngay
      showToast("Thông tin khách hàng đã lưu. Mời chọn dịch vụ.");
      showScreen(document.getElementById("serviceScreen"));
      btn.disabled = false;
      btn.textContent = "Gửi";
    });
  }

  if (checkout) {
    checkout.addEventListener("click", function () {
      if (!window.cart || window.cart.length === 0) {
        showToast("Giỏ hàng trống", "error");
        return;
      }

      // Kiểm tra dịch vụ đã được chọn chưa
      if (!window.currentService || !window.currentService.ID) {
        showToast("Vui lòng chọn dịch vụ trước khi đặt hàng", "error");
        return;
      }

      // Gửi đơn hàng thực sự
      submitGuestOrder(window.cart, window.currentService);
    });
  }
  window.showGuestForm = showGuestForm;
  window.showGuestInfo = showGuestInfo;
  window.showWelcomeScreen = loadWelcomeScreen;
  window.submitGuestOrder = submitGuestOrder;
  window.handleGuestInfoButton = handleGuestInfoButton;
  window.cart = cart;
  window.currentService = currentService;
  window.showContactScreen = showContactScreen;
});
