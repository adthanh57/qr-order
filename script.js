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
  // Data

  const services = [
    {
      id: 1,
      name: "Nhà Hàng",
      description: "Đặt món ăn ngon",
      hasCategories: true,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%234f46e5'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ENhà Hàng%3C/text%3E%3C/svg%3E",
    },
    {
      id: 2,
      name: "Thời Trang",
      description: "Quần áo, phụ kiện",
      hasCategories: false,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f59e0b'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EThời Trang%3C/text%3E%3C/svg%3E",
    },
    {
      id: 3,
      name: "Điện Tử",
      description: "Thiết bị công nghệ",
      hasCategories: true,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2310b981'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EĐiện Tử%3C/text%3E%3C/svg%3E",
    },
    {
      id: 4,
      name: "Gói Dịch Vụ",
      description: "Dịch vụ trọn gói",
      isItem: true,
      price: 500000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23a855f7'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EGói Dịch Vụ%3C/text%3E%3C/svg%3E",
    },
  ];

  const categories = [
    {
      id: 1,
      serviceId: 1,
      name: "Món Chính",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23ef4444'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EMón Chính%3C/text%3E%3C/svg%3E",
    },
    {
      id: 2,
      serviceId: 1,
      name: "Món Phụ",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f59e0b'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EMón Phụ%3C/text%3E%3C/svg%3E",
    },
    {
      id: 3,
      serviceId: 1,
      name: "Đồ Uống",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2310b981'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EĐồ Uống%3C/text%3E%3C/svg%3E",
    },
    {
      id: 4,
      serviceId: 3,
      name: "Điện Thoại",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%236366f1'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EĐiện Thoại%3C/text%3E%3C/svg%3E",
    },
    {
      id: 5,
      serviceId: 3,
      name: "Laptop",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23ec4899'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ELaptop%3C/text%3E%3C/svg%3E",
    },
  ];

  const menuItems = [
    {
      id: 1,
      categoryId: 1,
      name: "Cơm Gà",
      price: 75000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f87171'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ECơm Gà%3C/text%3E%3C/svg%3E",
      details:
        "Gà địa phương, cơm gạo lứt, ships from Vietnam, warranty 1 ngày",
    },
    {
      id: 2,
      categoryId: 1,
      name: "Phở Bò",
      price: 85000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23fb923c'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EPhở Bò%3C/text%3E%3C/svg%3E",
      details: "Bò Úc, bánh phở tươi, ships from Vietnam, warranty 1 ngày",
    },
    {
      id: 3,
      categoryId: 2,
      name: "Salad",
      price: 45000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2334d399'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ESalad%3C/text%3E%3C/svg%3E",
      details: "Rau organic, dầu olive, ships from Vietnam, warranty 1 ngày",
    },
    {
      id: 4,
      categoryId: 3,
      name: "Trà Sữa",
      price: 35000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23a78bfa'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ETrà Sữa%3C/text%3E%3C/svg%3E",
      details: "Trà Đài Loan, sữa tươi, ships from Vietnam, warranty 1 ngày",
    },
    {
      id: 5,
      categoryId: 3,
      name: "Cà Phê",
      price: 30000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23a78bfa'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ECà Phê%3C/text%3E%3C/svg%3E",
      details: "Cà phê Arabica, rang xay, ships from Vietnam, warranty 1 ngày",
    },
    {
      id: 6,
      serviceId: 2,
      name: "Áo Thun",
      price: 150000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2360a5fa'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EÁo Thun%3C/text%3E%3C/svg%3E",
      details:
        "100% cotton, size M, màu trắng, ships from Vietnam, warranty 30 ngày",
    },
    {
      id: 7,
      serviceId: 2,
      name: "Quần Jean",
      price: 350000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2360a5fa'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EQuần Jean%3C/text%3E%3C/svg%3E",
      details:
        "Denim cao cấp, size 32, màu xanh đậm, ships from China, warranty 30 ngày",
    },
    {
      id: 8,
      categoryId: 4,
      name: "iPhone 13",
      price: 20000000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23818cf8'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EiPhone 13%3C/text%3E%3C/svg%3E",
      details: "128GB, màu đen, ships from Singapore, warranty 12 tháng",
    },
    {
      id: 9,
      categoryId: 4,
      name: "Samsung Galaxy S21",
      price: 18000000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23818cf8'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3ESamsung S21%3C/text%3E%3C/svg%3E",
      details: "256GB, màu xanh, ships from Korea, warranty 12 tháng",
    },
    {
      id: 10,
      categoryId: 5,
      name: "MacBook Pro",
      price: 35000000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f472b6'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EMacBook Pro%3C/text%3E%3C/svg%3E",
      details: "M1 Pro, 16GB RAM, 512GB SSD, ships from USA, warranty 24 tháng",
    },
    {
      id: 11,
      categoryId: 5,
      name: "Dell XPS 13",
      price: 28000000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f472b6'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='white'%3EDell XPS 13%3C/text%3E%3C/svg%3E",
      details:
        "Intel i7, 16GB RAM, 1TB SSD, ships from China, warranty 12 tháng",
    },
  ];

  let cart = [];
  let currentService = null;
  let currentCategory = null;
  let discount = 0;
  let promoCodes = {
    GIAMGIA10: 0.1,
    GIAMGIA20: 0.2,
    FREESHIP: 0.05,
  };
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
  const qrScreen = document.getElementById("qrScreen");
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
  const promoCodeInput = document.getElementById("promoCode");
  const applyPromoButton = document.getElementById("applyPromo");
  const continueShopping = document.getElementById("continueShopping");
  const backToShoppingBtn = document.getElementById("backToShoppingBtn");
  const backToShopping = document.getElementById("backToShopping");
  const checkout = document.getElementById("checkout");
  // const scanButton = document.getElementById("scanButton");
  const newOrder = document.getElementById("newOrder");
  const orderNumber = document.getElementById("orderNumber");
  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");
  const navLinks = document.querySelectorAll(".nav-link");
  // const sidebarNhaHang = document.getElementById("sidebarNhaHang");
  // const sidebarThoiTrang = document.getElementById("sidebarThoiTrang");
  // const sidebarDienTu = document.getElementById("sidebarDienTu");

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
      if (targetScreen === "qrScreen") {
        pageTitle.textContent = "Quét Mã QR";
      } else if (targetScreen === "serviceScreen") {
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

  // Service category links in sidebar
  // sidebarNhaHang.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   const service = services.find((s) => s.id === 1);
  //   navigateToService(service);
  // });

  // sidebarThoiTrang.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   const service = services.find((s) => s.id === 2);
  //   navigateToService(service);
  // });

  // sidebarDienTu.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   const service = services.find((s) => s.id === 3);
  //   navigateToService(service);
  // });

  function navigateToService(service) {
    currentService = service;
    pageTitle.textContent = service.name;

    if (service.hasCategories) {
      renderCategories(service.id);
      categoryTitle.textContent = service.name + " - Danh Mục";
      showScreen(categoryScreen);
    } else {
      renderMenuItems(null, service.id);
      menuTitle.textContent = service.name;
      showScreen(menuItemsScreen);
    }

    // Close mobile menu if open
    sidebar.classList.remove("open");
    mobileMenuOverlay.classList.add("hidden");
  }

  // Event Listeners
  // scanButton.addEventListener("click", function () {
  //   // Simulate scanning QR code
  //   setTimeout(function () {
  //     showScreen(serviceScreen);
  //     renderServices();
  //     pageTitle.textContent = "Dịch Vụ";
  //   }, 1000);
  // });

  backToServices.addEventListener("click", function () {
    showScreen(serviceScreen);
    pageTitle.textContent = "Dịch Vụ";
  });

  backButton.addEventListener("click", function () {
    if (currentCategory) {
      showScreen(categoryScreen);
      pageTitle.textContent = currentService.name + " - Danh Mục";
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
    qrScreen.classList.add("hidden");
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
      serviceCard.innerHTML = `
      ${
        service.ImageUrl
          ? `
        <img src="${service.ImageUrl}" alt="${service.Name}" class="w-full h-40 object-cover">
      `
          : `
        <div class="w-full h-40 bg-gray-400 flex items-center justify-center text-white text-lg font-semibold">
          ${service.Name}
        </div>
      `
      }
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
            "card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg";
          categoryCard.innerHTML = `
          ${
            category.ImageUrl
              ? `
            <img src="${category.ImageUrl}" alt="${category.Name}" class="w-full h-40 object-cover">
          `
              : `
            <div class="w-full h-40 bg-gray-400 flex items-center justify-center text-white text-lg font-semibold">
              ${category.Name}
            </div>
          `
          }
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
        const list = document.getElementById("menuItemsList");
        list.innerHTML = "";

        res.data.forEach((item) => {
          const itemCard = document.createElement("div");
          itemCard.className =
            "card bg-white rounded-lg shadow-md overflow-hidden relative";
          itemCard.innerHTML = `
          ${
            item.ImageUrl
              ? `
            <img src="${item.ImageUrl}" alt="${item.Name}" class="w-full h-40 object-cover">
          `
              : `
            <div class="w-full h-40 bg-gray-400 flex items-center justify-center text-white text-lg font-semibold">
              ${item.Name}
            </div>
          `
          }
          <div class="p-4">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-800">${item.Name}</h3>
              <span class="text-indigo-600 font-medium">${item.Price.toLocaleString()} ₫</span>
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
        showScreen(document.getElementById("menuItemsScreen"));
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

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'943b1daf90150994',t:'MTc0NzkwNDM1MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
