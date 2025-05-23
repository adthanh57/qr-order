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
    document
      .querySelectorAll(
        "#welcomeScreen, #serviceScreen, #categoryScreen, #menuItemsScreen, #cartScreen, #confirmationScreen"
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
        pageTitle.textContent = service.Name + " - Danh Mục";
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
          renderCategories(service.ID, service.Name);
          categoryTitle.textContent = service.Name + " - Danh Mục";
          pageTitle.textContent = service.Name + " - Danh Mục";
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
              pageTitle.textContent = `${serviceName} - ${category.Name}`;
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
        renderSidebarServices(res.data.Categories);
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
