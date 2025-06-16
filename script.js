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
  localStorage.clear(); // Xoá toàn bộ localStorage
  sessionStorage.clear(); // Nếu dùng sessionStorage thì thêm
  let guestData = null;
  let dp;
  window.cart = [];
  let currentService = null;
  let currentCategory = null;
  let discount = 0;
  let isSidebarCollapsed = false;
  let isStaffLoggedIn = localStorage.getItem("staffLoggedIn") === "1";
  function updateLogoutVisibility() {
    const logoutBtn = document.getElementById("staffLogoutBtn");
    const isStaffLoggedIn = localStorage.getItem("staffLoggedIn") === "1";
    if (logoutBtn) {
      logoutBtn.classList.toggle("hidden", !isStaffLoggedIn);
    }
  }
  updateLogoutVisibility();
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
  const staffLoginForm = document.getElementById("staffLoginForm");
  const goToServicesBtn = document.getElementById("goToServicesBtn");
  const hotelTitle = document.getElementById("hotelTitle");
  const hotelName = document.getElementById("hotelName");
  const contactHotelName = document.getElementById("contactHotelName");
  const contactPhone = document.getElementById("contactPhone");
  const contactEmail = document.getElementById("contactEmail");
  const contactAddress = document.getElementById("contactAddress");
  const contactScreen = document.getElementById("contactScreen");
  const hotelPhone = document.getElementById("hotelPhone");
  const hotelAddress = document.getElementById("hotelAddress");
  const hotelEmail = document.getElementById("hotelEmail");
  const scaleSelect = document.getElementById("scaleSelect");
  const viewMode = document.getElementById("viewMode");
  const datePicker = document.getElementById("datePicker");
  const bookingForm = document.getElementById("bookingForm");
  const bookingModal = document.getElementById("bookingModal");
  const deleteEventBtn = document.getElementById("deleteEventBtn");
  // Sidebar Toggle
  toggleSidebarBtn.addEventListener("click", function () {
    isSidebarCollapsed = !isSidebarCollapsed;

    const dynamicSidebarTexts = document.querySelectorAll(".sidebar-item-text");
    if (isSidebarCollapsed) {
      sidebar.classList.add("collapsed");
      mainContent.classList.remove("md:ml-64");
      mainContent.classList.add("md:ml-20");
      dynamicSidebarTexts.forEach((text) => {
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
      dynamicSidebarTexts.forEach((text) => {
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
  staffLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    // Dummy check — thay bằng gọi API thật nếu có
    if (username === "admin" && password === "123456") {
      localStorage.setItem("staffLoggedIn", "1");
      isStaffLoggedIn = true;
      updateLogoutVisibility();
      showToast("Đăng nhập thành công!");
      showScreen(serviceScreen);
    } else {
      document.getElementById("staffLoginError").textContent =
        "Sai thông tin đăng nhập";
      document.getElementById("staffLoginError").classList.remove("hidden");
    }
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
    updateCartCount();
    showScreen(cartScreen);
  });

  continueShopping.addEventListener("click", function () {
    updateCartUI();
    updateCartCount();
    showScreen(serviceScreen);
  });

  backToShoppingBtn.addEventListener("click", function () {
    updateCartUI();
    updateCartCount();
    showScreen(serviceScreen);
  });

  backToShopping.addEventListener("click", function () {
    updateCartUI();
    updateCartCount();
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
      "miceSchedulerScreen",
    ];

    const isStaffLoggedIn = localStorage.getItem("staffLoggedIn") === "1";

    if (
      protectedScreens.includes(screen.id) &&
      !isStaffLoggedIn &&
      (!window.guestData?.GuestName || !window.guestData?.Phone)
    ) {
      showToast("Vui lòng nhập thông tin khách hàng trước!", "error");
      return handleGuestInfoButton();
    }

    document
      .querySelectorAll(
        "#welcomeScreen, #guestFormScreen, #guestInfoScreen, #serviceScreen, #categoryScreen, #menuItemsScreen, #cartScreen, #confirmationScreen, #contactScreen, #staffLoginScreen,#miceSchedulerScreen, #bookingModal"
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
      if (service.Type === 8) {
        li.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          showScreen(document.getElementById("miceSchedulerScreen"));
          window.schedulerRoomAreaID = service.ID;
          initScheduler();
        });
      } else {
        li.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          currentService = service;
          renderCategories(service.ID, service.Name);
          categoryTitle.textContent = service.Name + " - Danh Mục";
          showScreen(categoryScreen);
        });
      }

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
          if (service.Type === 8) {
            showScreen(document.getElementById("miceSchedulerScreen"));
            window.schedulerRoomAreaID = service.ID; // 🆕 Gán ID vào biến toàn cục
            initScheduler();
            return;
          }
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
  function handleStaffLoginButton() {
    const screen = document.getElementById("staffLoginScreen");
    if (screen) {
      screen.classList.remove("hidden");
      showScreen(screen);
    }
  }
  function handleStaffLogout() {
    localStorage.removeItem("staffLoggedIn");
    window.isStaffLoggedIn = false;
    updateLogoutVisibility();
    showToast("Đã đăng xuất nhân viên");
    showScreen(welcomeScreen);
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
            showScreen(serviceScreen);
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
        hotelName.textContent = hotel.Name || "Khách sạn";
        if (hotel.WelcomeFontColor) {
          hotelName.style.color = hotel.WelcomeFontColor;
        }
        hotelTitle.textContent = hotel.Name || "Khách sạn";
        if (hotel.WelcomeFontColor) {
          hotelTitle.style.color = hotel.WelcomeFontColor;
        }

        // Không dùng ảnh từ API => logo giữ nguyên
        hotelPhone.textContent = `Hotline: ${hotel.Phone || "..."}`;
        hotelAddress.textContent = `Địa chỉ: ${hotel.Address || "..."}`;
        hotelEmail.textContent = `Email: ${hotel.Email || "..."}`;

        const roomText = document.getElementById("roomNoText");
        if (roomNumber && roomText) roomText.textContent = roomNumber;

        if (isStaffLoggedIn) {
          showScreen(serviceScreen);
        } else {
          showScreen(welcomeScreen);
        }
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

    contactHotelName.textContent = hotel.Name || "...";
    contactPhone.textContent = hotel.Phone || "...";
    contactEmail.textContent = hotel.Email || "...";
    contactAddress.textContent = hotel.Address || "...";
    updateContactScreen();
    showScreen(contactScreen);
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
        updateCartUI();
        updateCartCount();
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
  const roomNumberInit = extractRoomNumber();
  if (roomNumberInit) {
    fetchAPI("GetGuestInfo", "POST", { RoomNo: roomNumberInit })
      .then((res) => {
        const guest = res?.data?.[0];
        if (guest?.GuestName && guest?.Phone) {
          window.guestData = guest;
          showToast("Chào mừng trở lại! Đang chuyển tới dịch vụ...");
          showScreen(serviceScreen);
        } else {
          // Nếu không có thông tin khách thì tiếp tục logic welcome bình thường
          window.guestData = guest || null;
        }
      })
      .catch(() => {
        showToast("Không thể lấy thông tin khách", "error");
      });
  }
  // Gắn sự kiện nút "Xem dịch vụ"
  goToServicesBtn?.addEventListener("click", () => {
    showScreen(serviceScreen);
  });
  // Gắn sự kiện nút "Xem dịch vụ"
  hotelTitle?.addEventListener("click", () => {
    showScreen(serviceScreen);
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
      showScreen(serviceScreen);
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
  function getDateRange() {
    const datePickerEl = document.getElementById("datePicker");
    let selectedDate = datePickerEl.value
      ? new Date(datePickerEl.value)
      : new Date(); // fallback: hôm nay
    const viewMode = document.getElementById("viewMode").value;

    let startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    if (viewMode === "day") {
      // Giữ nguyên start và end
    } else if (viewMode === "week") {
      const day = selectedDate.getDay();
      const diffToMonday = selectedDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(selectedDate.setDate(diffToMonday));
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (viewMode === "month") {
      startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );
    }

    const format = (d) =>
      d.toLocaleDateString("en-GB").split("/").reverse().join("-");

    return {
      start: format(startDate),
      end: format(endDate),
    };
  }

  async function initScheduler() {
    const { start, end } = getDateRange();
    let startDate = start;
    let days = 1;

    if (viewMode.value === "week") {
      days = 7;
    } else if (viewMode.value === "month") {
      const startD = new Date(start);
      const endD = new Date(end);
      days = Math.round((endD - startD) / (1000 * 60 * 60 * 24)) + 1;
    }
    const formatDateToMMDDYYYY = (d) => {
      const date = new Date(d);
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    };
    const roomAreaID = window.schedulerRoomAreaID || "all"; // 🆕
    const roomResponse = await fetchAPI(
      `SchedulerResource?date=&roomTypeID=all&roomAreaID=${roomAreaID}`,
      "POST"
    );
    const eventResponse = await fetchAPI(
      `SchedulerData?startDate=${formatDateToMMDDYYYY(
        start
      )}&roomTypeID=all&roomAreaID=${roomAreaID}&endDate=${formatDateToMMDDYYYY(
        end
      )}`,
      "POST"
    );
    // Sửa tại đây
    const rooms = Array.isArray(roomResponse.data)
      ? roomResponse.data.map((room) => ({
          id: room.RoomNo,
          name: `${room.RoomName}`,
          type: room.RoomTypeCode,
          color: room.RoomStatusColor || "#3c78d8",
        }))
      : [];

    const events = Array.isArray(eventResponse.data)
      ? eventResponse.data.map((ev) => ({
          id: ev.id,
          start: ev.start,
          end: ev.end,
          resource: ev.resource,
          text: `${ev.name} (${ev.guests} khách)`,
          name: ev.name,
          guests: ev.guests,
          phone: ev.phone,
          email: ev.email,
          note: ev.note,
          type: ev.type,
          originalStart: ev.originalStart,
          originalEnd: ev.originalEnd,
          originalResource: ev.originalResource,
          Color: ev.Color,
        }))
      : [];
    if (dp) {
      dp.startDate = startDate;
      dp.days = days;
      dp.resources = rooms;
      dp.events.list = events;
      dp.update();
      return;
    }
    dp = new DayPilot.Scheduler("dp", {
      timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "dd/MM" }],
      scale: "Day",
      days: days,
      startDate: startDate,
      businessBeginsHour: 0,
      businessEndsHour: 0,
      cellWidth: 100,
      wheelStep: 30,
      scrollX: "Auto",
      scrollY: "Auto",
      wheelHorizontal: true,
      resources: rooms,
      events: events,
      rowHeaderWidth: 100,
      // theme: "scheduler_white",
      contextMenu: new DayPilot.Menu({
        items: [
          {
            text: "Xoá đặt phòng",
            onClick: async (args) => {
              const eventId = args.source.data.id;
              await deleteSchedulerEvent(eventId);
            },
          },
        ],
      }),

      onTimeRangeSelected: (args) => {
        // Tạo object mô phỏng event mới
        const newEvent = {
          id: "", // id rỗng vì là mới
          resource: args.resource,
          start: args.start,
          end: args.end,
        };

        // Kiểm tra trùng
        if (isOverlapping(newEvent)) {
          showAlert(
            "⚠️ Khoảng thời gian đã có người đặt phòng này!",
            "bg-red-600"
          );
          dp.clearSelection();
          return;
        }

        openModal(args);
        dp.clearSelection();
      },

      onEventResized: async (args) => {
        const resizedEvent = {
          ...args.e.data,
          start: args.newStart,
          end: args.newEnd,
        };

        if (isOverlapping(resizedEvent)) {
          showAlert(
            "⚠️ Thời gian mới bị trùng với một lịch khác!",
            "bg-red-600"
          );
          args.preventDefault();
          return;
        }

        const result = await saveSchedulerEvent(resizedEvent);

        if (!result) {
          // ❌ API lỗi → rollback
          args.e.data.start = args.e.data.originalStart;
          args.e.data.end = args.e.data.originalEnd;
          args.e.data.resource = args.e.data.originalResource;
          // Rollback về vị trí cũ
          args.preventDefault(); // Ngăn DayPilot cập nhật event
          dp.events.update(args.e); // Cập nhật lại event
          dp.update();
          showAlert("❌ Cập nhật thất bại, đã hoàn tác", "bg-red-600");
        } else {
          // ✅ API thành công → cập nhật UI
          dp.events.update(result);
          dp.update();
          showAlert("✏️ Đã thay đổi thời gian sự kiện", "bg-indigo-500");
        }
      },
      onEventMoved: async (args) => {
        const movedEvent = {
          ...args.e.data,
          start: args.newStart,
          end: args.newEnd,
          resource: args.newResource,
        };

        if (isOverlapping(movedEvent)) {
          showAlert("⚠️ Lịch bị trùng!", "bg-red-600");
          args.preventDefault();
          return;
        }

        const result = await saveSchedulerEvent(movedEvent);

        if (!result) {
          // ❌ API lỗi → rollback
          args.e.data.start = args.e.data.originalStart;
          args.e.data.end = args.e.data.originalEnd;
          args.e.data.resource = args.e.data.originalResource;
          // Rollback về vị trí cũ
          args.preventDefault(); // Ngăn DayPilot cập nhật event
          dp.events.update(args.e); // Cập nhật lại event
          dp.update();
        } else {
          dp.events.update(result);
          dp.update();
          showAlert("🔄 Đã cập nhật sự kiện", "bg-blue-500");
        }
      },

      onEventClick: (args) => {
        const e = args.e.data;
        const form = bookingForm;
        form.room.value = e.resource;
        form.type.value = getRoomTypeById(e.resource); // override nếu type chưa đúng
        form.start.value = toDatetimeLocalString(e.start);
        form.end.value = toDatetimeLocalString(e.end);
        // form.end.value = new DayPilot.Date(e.end).toString(
        //   "dd/MM/yyyy HH:mm:ss"
        // );
        form.guests.value = e.guests || "";
        form.name.value = e.name || "";
        form.phone.value = e.phone || "";
        form.email.value = e.email || "";
        form.note.value = e.note || "";
        form.dataset.eventId = e.id;
        bookingModal.classList.remove("hidden");
      },
      onBeforeEventRender: (args) => {
        args.data.barColor = args.data.Color;
        args.data.barBackColor = args.data.Color;
      },
      onBeforeRowHeaderRender: (args) => {
        args.row.html = `
    <div style="padding-bottom: 6px;">
      <div style="position: absolute; top: 0; right: 0; height: 100%; width:6px; background: ${args.row.data.color}; border-radius: 2px;"></div>
      ${args.row.name}
    </div>
  `;
      },
    });

    dp.init();
    // ✅ Thêm hàm tại đây
    function toDatetimeLocalString(date) {
      const d = new Date(date);
      const pad = (n) => String(n).padStart(2, "0");
      return (
        d.getFullYear() +
        "-" +
        pad(d.getMonth() + 1) +
        "-" +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes())
      );
    }
    const openModal = (args) => {
      const form = bookingForm;
      form.reset();
      form.room.value = args.resource;
      form.type.value = getRoomTypeById(args.resource);
      form.start.value = toDatetimeLocalString(args.start);
      form.end.value = toDatetimeLocalString(args.end);
      form.dataset.eventId = "";
      bookingModal.classList.remove("hidden");

      // 🧠 Gắn lại submit mỗi khi mở modal để đảm bảo form tồn tại
      form.onsubmit = async function (e) {
        e.preventDefault();
        console.log("📥 Đã submit bookingForm trong modal");
        // ➕ THÊM đoạn xử lý API UpdateScheduler tại đây hoặc gọi hàm handleBookingFormSubmit(form)
      };
    };
    function barColor(i) {
      const colors = ["#3c78d8", "#6aa84f", "#f1c232", "#cc0000"];
      return colors[i % 4];
    }
    function barBackColor(i) {
      const colors = ["#a4c2f4", "#b6d7a8", "#ffe599", "#ea9999"];
      return colors[i % 4];
    }
    async function saveSchedulerEvent(e) {
      const roomObj = rooms.find((r) => r.id === e.resource);

      const toDateTime = (d) => {
        const date = new Date(d);
        const pad = (n) => String(n).padStart(2, "0");
        return (
          date.getFullYear() +
          "-" +
          pad(date.getMonth() + 1) +
          "-" +
          pad(date.getDate()) +
          " " +
          pad(date.getHours()) +
          ":" +
          pad(date.getMinutes()) +
          ":" +
          pad(date.getSeconds() || 0)
        );
      };

      const payload = {
        id: e.id || "",
        resid: roomObj?.resid || null,
        start: toDateTime(e.start),
        end: toDateTime(e.end),
        resource: e.resource || null,
        name: e.name || "",
        guests: parseInt(e.guests) || 0,
        phone: e.phone || "",
        email: e.email || "",
        note: e.note || "",
        status: null,
        text: null,
        type: null,
        originalStart: null,
        originalEnd: null,
        originalResource: null,
        Color: null,
      };

      try {
        const res = await fetchAPI("UpdateScheduler", "POST", payload);
        if (res.error === "true") {
          showAlert(`❌ ${res.message}`, "bg-red-600");
          return null;
        }

        const updated = res.data;
        return {
          ...updated,
          text: `${updated.name} (${updated.guests} khách)`,
        };
      } catch (err) {
        console.error("❌ Gọi API UpdateScheduler thất bại:", err);
        showAlert("❌ Không thể kết nối API", "bg-red-600");
        return null;
      }
    }
    async function deleteSchedulerEvent(eventId) {
      if (!eventId) {
        showAlert("⚠️ Không tìm thấy ID sự kiện!", "bg-red-500");
        return false;
      }

      if (!confirm("Bạn có chắc chắn muốn xoá lịch này?")) return false;

      try {
        const res = await fetchAPI(`DeleteScheduler?id=${eventId}`, "POST");

        if (res.error === "true") {
          showAlert(`❌ ${res.message}`, "bg-red-600");
          return false;
        }

        // Xoá khỏi UI
        const evIndex = dp.events.list.findIndex((e) => e.id == eventId);
        if (evIndex !== -1) {
          dp.events.list.splice(evIndex, 1);
          dp.update();
        }

        showAlert("🗑️ Đã xoá lịch thành công", "bg-red-500");
        return true;
      } catch (err) {
        console.error("❌ Lỗi khi gọi API DeleteScheduler:", err);
        showAlert("❌ Không thể kết nối API xoá", "bg-red-600");
        return false;
      }
    }

    function closeModal() {
      bookingModal.classList.add("hidden");
    }
    function isOverlapping(newEvent) {
      return dp.events.list.some((existing) => {
        // Không so sánh với chính nó nếu đang update
        if (existing.id === newEvent.id) return false;

        // Cùng phòng?
        if (existing.resource !== newEvent.resource) return false;

        const start1 = new DayPilot.Date(existing.start);
        const end1 = new DayPilot.Date(existing.end);
        const start2 = new DayPilot.Date(newEvent.start);
        const end2 = new DayPilot.Date(newEvent.end);

        return !(end2 <= start1 || start2 >= end1); // Có giao nhau
      });
    }
    bookingForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;

      const requiredFields = [
        "room",
        "type",
        "start",
        "end",
        "guests",
        "name",
        "phone",
      ];

      for (const field of requiredFields) {
        const value = form[field].value.trim();
        if (!value) {
          showAlert(
            `⚠️ Vui lòng điền đầy đủ trường: ${field}`,
            "bg-yellow-500"
          );
          form[field].focus();
          return;
        }

        if (field === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(form.email.value.trim())) {
            showAlert("⚠️ Email không đúng định dạng", "bg-yellow-500");
            form.email.focus();
            return;
          }
        }

        if (field === "phone") {
          const phoneRegex = /^0\d{9}$/;
          if (!phoneRegex.test(form.phone.value.trim())) {
            showAlert(
              "⚠️ Số điện thoại phải có 10 chữ số và bắt đầu bằng 0",
              "bg-yellow-500"
            );
            form.phone.focus();
            return;
          }
        }
      }

      const eventId = form.dataset.eventId || "";

      // ✅ datetime-local trả dạng 'YYYY-MM-DDTHH:mm' => nối ':00' để có định dạng đầy đủ
      const toDateTime = (val) => {
        if (!val) return "";
        const parts = val.split("T");
        if (parts.length !== 2) return "";
        return parts[0] + " " + parts[1] + (parts[1].length === 5 ? ":00" : "");
      };

      const payload = {
        id: form.dataset.eventId || "",
        resid: null,
        start: toDateTime(form.start.value) || null,
        end: toDateTime(form.end.value) || null,
        resource: form.room.value || null,
        name: form.name.value || "",
        guests: parseInt(form.guests.value) || 0,
        phone: form.phone.value || "",
        email: form.email.value || "",
        note: form.note.value || "",

        // Các trường không bắt buộc nhưng vẫn thêm với giá trị null
        status: null,
        text: null,
        type: null,
        originalStart: null,
        originalEnd: null,
        originalResource: null,
        Color: null,
      };

      // Kiểm tra trùng sự kiện
      const checkOverlap = {
        ...payload,
        id: eventId || DayPilot.guid(),
      };

      if (isOverlapping(checkOverlap)) {
        showAlert(
          "⚠️ Phòng này đã được đặt trong khoảng thời gian đó!",
          "bg-red-600"
        );
        return;
      }

      const saved = await saveSchedulerEvent(payload);

      if (!saved) return;

      if (eventId) {
        dp.events.update(saved);
      } else {
        dp.events.add(saved);
      }

      dp.update();
      showAlert("✅ Lưu thông tin đặt phòng thành công", "bg-green-600");
      bookingModal.classList.add("hidden");
    });

    datePicker.valueAsDate = new Date();
    datePicker.addEventListener("change", function (e) {
      initScheduler();
    });

    // Thay đổi chế độ xem (ngày/tuần/tháng)
    viewMode.addEventListener("change", function (e) {
      initScheduler();
    });
    // Thay đổi chế độ chọn (giờ/ngày)
    scaleSelect.addEventListener("change", function (e) {
      const scale = e.target.value;

      if (scale === "Hour") {
        dp.scale = "Hour";
        dp.timeHeaders = [
          { groupBy: "Day", format: "dd/MM/yyyy" },
          { groupBy: "Hour" },
        ];
        dp.cellWidth = 50;
      } else if (scale === "Day") {
        dp.scale = "Day";
        dp.timeHeaders = [
          { groupBy: "Month" },
          { groupBy: "Day", format: "dd/MM" },
        ];
        dp.cellWidth = 100;
      }

      dp.update(); // cập nhật lại giao diện
    });
    deleteEventBtn.addEventListener("click", async function () {
      const eventId = bookingForm.dataset.eventId;
      const deleted = await deleteSchedulerEvent(eventId);
      if (deleted) bookingModal.classList.add("hidden");
    });

    function getRoomTypeById(roomId) {
      const room = rooms.find((r) => r.id === roomId);
      return room ? room.type : "";
    }
    function showAlert(message, colorClass) {
      const box = document.getElementById("alertBox");
      box.textContent = message;
      box.className = `fixed top-4 right-4 px-4 py-2 rounded shadow text-white text-sm z-[9999] ${colorClass}`;
      box.classList.remove("hidden");
      setTimeout(() => box.classList.add("hidden"), 3000);
    }
    // Giả lập fetch loại phòng từ API
    const typeSelect = document.getElementById("roomTypeSelect");
    rooms.forEach((data) => {
      const option = document.createElement("option");
      option.value = data.type;
      option.textContent = data.type;
      typeSelect.appendChild(option);
    });
    window.closeModal = closeModal;
  }
  window.showGuestForm = showGuestForm;
  window.showGuestInfo = showGuestInfo;
  window.showWelcomeScreen = loadWelcomeScreen;
  window.submitGuestOrder = submitGuestOrder;
  window.handleGuestInfoButton = handleGuestInfoButton;
  window.cart = cart;
  window.currentService = currentService;
  window.showContactScreen = showContactScreen;
  window.handleStaffLoginButton = handleStaffLoginButton;
  window.handleStaffLogout = handleStaffLogout;
});
