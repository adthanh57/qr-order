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
  let cart = [];
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
  const pageTitle = document.getElementById("pageTitle");
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
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");
  const continueShopping = document.getElementById("continueShopping");
  const backToShoppingBtn = document.getElementById("backToShoppingBtn");
  const backToShopping = document.getElementById("backToShopping");
  const checkout = document.getElementById("checkout");
  const newOrder = document.getElementById("newOrder");
  const orderNumber = document.getElementById("orderNumber");
  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");
  const navLinks = document.querySelectorAll(".nav-link");

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

      // Update active state
      navLinks.forEach((navLink) => {
        navLink.classList.remove("active");
      });
      this.classList.add("active");

      // Update page title
      if (targetScreen === "serviceScreen") {
        pageTitle.textContent = "Dịch Vụ";
      } else if (targetScreen === "cartScreen") {
        pageTitle.textContent = "Giỏ Hàng";
        updateCartUI();
      }

      // Show the target screen
      showScreen(document.getElementById(targetScreen));

      // Close mobile menu if open
      sidebar.classList.remove("open");
      mobileMenuOverlay.classList.add("hidden");
    });
  });

  function navigateToService(service) {
    currentService = service;
    pageTitle.textContent = service.Name;

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
    pageTitle.textContent = "Dịch Vụ";
  });

  backButton.addEventListener("click", function () {
    if (currentCategory) {
      showScreen(categoryScreen);
      pageTitle.textContent = currentService.Name + " - Danh Mục";
      currentCategory = null;
    } else {
      showScreen(serviceScreen);
      pageTitle.textContent = "Dịch Vụ";
    }
  });

  cartButton.addEventListener("click", function () {
    updateCartUI();
    showScreen(cartScreen);
    pageTitle.textContent = "Giỏ Hàng";
  });

  continueShopping.addEventListener("click", function () {
    showScreen(serviceScreen);
    pageTitle.textContent = "Dịch Vụ";
  });

  backToShoppingBtn.addEventListener("click", function () {
    showScreen(serviceScreen);
    pageTitle.textContent = "Dịch Vụ";
  });

  backToShopping.addEventListener("click", function () {
    showScreen(serviceScreen);
    pageTitle.textContent = "Dịch Vụ";
  });

  // applyPromoButton.addEventListener("click", function () {
  //   const code = promoCodeInput.value.trim().toUpperCase();
  //   if (promoCodes[code] !== undefined) {
  //     discount = promoCodes[code];
  //     updateCartUI();
  //     showToast(`Mã giảm giá ${code} đã được áp dụng!`);
  //   } else {
  //     showToast("Mã giảm giá không hợp lệ!", "error");
  //   }
  // });

  checkout.addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!", "error");
      return;
    }

    // Generate random order number
    const randomOrderNumber =
      "ORD" + Math.floor(100000 + Math.random() * 900000);
    orderNumber.textContent = randomOrderNumber;

    // Show confirmation screen
    showScreen(confirmationScreen);
    pageTitle.textContent = "Đặt Hàng Thành Công";

    // Reset cart
    cart = [];
    updateCartCount();
  });

  newOrder.addEventListener("click", function () {
    showScreen(serviceScreen);
    pageTitle.textContent = "Dịch Vụ";
  });

  // Functions
  function showScreen(screen) {
    serviceScreen.classList.add("hidden");
    categoryScreen.classList.add("hidden");
    menuItemsScreen.classList.add("hidden");
    cartScreen.classList.add("hidden");
    confirmationScreen.classList.add("hidden");
    screen.classList.remove("hidden");

    // Add fade-in animation
    screen.classList.add("fade-in");
    setTimeout(() => {
      screen.classList.remove("fade-in");
    }, 500);

    // Update active state in sidebar
    navLinks.forEach((link) => {
      const targetScreen = link.getAttribute("data-screen");
      if (targetScreen === screen.id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile menu if open
    sidebar.classList.remove("open");
    mobileMenuOverlay.classList.add("hidden");
  }

  function renderServices(serviceList) {
    servicesList.innerHTML = "";

    serviceList.forEach((service) => {
      const serviceCard = document.createElement("div");
      serviceCard.className =
        "card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg relative";
      serviceCard.innerHTML = ` <img src="${service.ImageUrl}" alt="${service.Name}" class="w-full h-40 object-cover">
      <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2 text-lg font-semibold">
        ${service.Name}
      </div>
    `;

      // 👉 Xử lý khi bấm vào toàn bộ card
      serviceCard.addEventListener("click", function () {
        currentService = service;
        renderCategories(service.ID, service.Name); // 👉 Gọi API danh mục
        categoryTitle.textContent = service.Name + " - Danh Mục";
        pageTitle.textContent = service.Name + " - Danh Mục";
        showScreen(categoryScreen);
      });

      servicesList.appendChild(serviceCard);
    });
  }

  async function renderCategories(serviceId, serviceName) {
    try {
      const res = await fetchAPI(
        `GetSaleItemCategories?posId=${serviceId}`,
        "POST"
      );
      if (res.error) {
        categoriesList.innerHTML = "";
        res.data.forEach((category) => {
          const categoryCard = document.createElement("div");
          categoryCard.className =
            "card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg relative";
          categoryCard.innerHTML = `
    <img src="${category.ImageUrl}" alt="${category.Name}" class="w-full h-40 object-cover">
    <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2 text-lg font-semibold">
      ${category.Name}
    </div>
  `;

          categoryCard.addEventListener("click", () => {
            currentCategory = category;
            renderMenuItems(
              serviceId,
              category.ID,
              `${serviceName} - ${category.Name}`
            );
            menuTitle.textContent = currentService.Name + " - " + category.Name;
            pageTitle.textContent = currentService.Name + " - " + category.Name;
            showScreen(menuItemsScreen);
          });

          categoriesList.appendChild(categoryCard);
        });

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
        ID: serviceId,
        CategoryID: categoryId,
      });

      if (res.error) {
        const list = menuItemsList;
        list.innerHTML = "";

        res.data.forEach((item) => {
          const itemCard = document.createElement("div");
          itemCard.className =
            "card bg-white rounded-lg shadow-md overflow-hidden";
          itemCard.innerHTML = `
                        <img src="${item.ImageUrl}" alt="${
            item.Name
          }" class="w-full h-40 object-cover">
                        <div class="p-4">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-semibold text-gray-800">${
                                  item.Name
                                }</h3>
                                <span class="text-indigo-600 font-medium">${formatPrice(
                                  item.Price
                                )}</span>
                            </div>
                            <p class="text-gray-600 mt-1 text-sm">${
                              item.Description
                            }</p>
                            <div class="mt-4 flex items-center justify-between">
                                <div class="flex items-center">
                                    <button class="decrease-qty bg-gray-200 px-2 py-1 rounded-l-md hover:bg-gray-300">-</button>
                                    <input type="number" min="1" value="1" class="quantity-input border-t border-b border-gray-300 py-1 px-2 w-12 text-center">
                                    <button class="increase-qty bg-gray-200 px-2 py-1 rounded-r-md hover:bg-gray-300">+</button>
                                </div>
                                <button class="add-to-cart py-1 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none">Thêm</button>
                            </div>
                        </div>
                    `;

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
            });
            showToast(`Đã thêm ${item.Name}`);
          };

          list.appendChild(itemCard);
        });

        menuTitle.textContent = title;
        showScreen(menuItemsScreen);
      } else {
        showToast("Không tải được mặt hàng", "error");
      }
    } catch (e) {
      showToast("Lỗi kết nối API khi lấy mặt hàng", "error");
    }
  }

  function addToCart(item) {
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    updateCartCount();
  }

  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    sidebarCartCount.textContent = count;
  }

  function updateCartUI() {
    if (cart.length === 0) {
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

    subtotalEl.textContent = formatPrice(subtotal);
    discountEl.textContent = formatPrice(discountAmount);
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
  const params = new URLSearchParams(window.location.search);
  const roomNumber = params.get("room");
  if (roomNumber) {
    currentRoom = roomNumber;
    const roomInfoEl = document.getElementById("roomInfo");
    if (roomInfoEl) {
      roomInfoEl.textContent = `(Phòng ${currentRoom})`;
    }
  }

  // 📦 Gọi API lấy danh sách dịch vụ
  fetchAPI("GetPOSList", "POST")
    .then((res) => {
      if (res.error) {
        renderServices(res.data.Categories);
        showScreen(document.getElementById("serviceScreen"));
        pageTitle.textContent = "Dịch Vụ";
      } else {
        showToast("Lỗi lấy danh sách dịch vụ", "error");
      }
    })
    .catch(() => {
      showToast("Không thể kết nối máy chủ", "error");
    });
});
