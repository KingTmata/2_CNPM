/* ============================================
   PCZONE ADMIN - JS
   Giai đoạn 1-10: Menu, Dashboard, Sản phẩm,
   Đơn hàng, Khách hàng, Build PC, Khuyến mãi,
   Đánh giá, Thống kê, Kho hàng
   
   Dữ liệu lấy từ: data-products.js, data-customers.js
   Mọi thay đổi được lưu vào localStorage.
   ============================================ */

/* ===== CẤU HÌNH MENU ===== */
const MENUS = [
  { id: 'dashboard', icon: 'dashboard',      label: 'Tổng quan' },
  { id: 'products',  icon: 'inventory_2',    label: 'Sản phẩm',  },
  { id: 'orders',    icon: 'shopping_cart',  label: 'Đơn hàng',  },
  { id: 'customers', icon: 'people',         label: 'Khách hàng', },
  { id: 'builds',    icon: 'memory',         label: 'Build PC',    },
  { id: 'coupons',   icon: 'local_offer',    label: 'Khuyến mãi', },
  { id: 'reviews',   icon: 'star',           label: 'Đánh giá', },
  { id: 'stats',     icon: 'bar_chart',      label: 'Thống kê', },
  { id: 'settings',  icon: 'settings',       label: 'Cài đặt', },
];

/* ===== XÁC THỰC ADMIN ===== */
const USER_STORAGE_KEY = 'pczone_user';
let adminUser = null;

function checkAdminAuth() {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const user = JSON.parse(saved);
      if (user && user.role === 'admin') {
        adminUser = user;
        return true;
      }
    }
  } catch (e) {}
  return false;
}

/* ===== ĐỒNG BỘ DỮ LIỆU 2 CHIỀU ===== */

// Storage keys
const STORAGE_KEYS = {
  products:  'pczone_products',
  orders:    'pczone_orders',
  customers: 'pczone_customers',
  builds:    'pczone_builds',
  coupons:   'pczone_coupons',
  reviews:   'pczone_reviews',
  cart:      'pczone_cart',
};

// Fallback mảng rỗng cho các biến có thể chưa được định nghĩa
const DEFAULT_BUILDS = [];
const DEFAULT_COUPONS = [];

// Đồng bộ dữ liệu từ file nguồn (data-products.js, data-customers.js) sang localStorage
// Chỉ đồng bộ khi localStorage chưa có dữ liệu (lần đầu)
// Nếu admin đã chỉnh sửa, giữ nguyên dữ liệu trong localStorage, chỉ thêm sản phẩm mới từ nguồn
function syncDataFromSource() {
  // === SẢN PHẨM ===
  // Chuyển đổi từ getAllProducts() (data-products.js) sang định dạng admin
  var allProducts = typeof getAllProducts === 'function' ? getAllProducts() : [];
  const freshProducts = allProducts.map(function(sp) {
    return {
      id: sp.id,
      name: sp.ten,
      brand: sp.hang,
      category: sp.danhMuc === 'Cooler' ? 'Tản nhiệt' :
                sp.danhMuc === 'Storage' ? 'SSD' :
                sp.danhMuc === 'Fans' ? 'Case' :
                sp.danhMuc === 'Monitor' ? 'Màn hình' :
                sp.danhMuc === 'Peripherals' ? 'Linh kiện' :
                sp.danhMuc,
      price: sp.gia,
      sale: sp.giaGoc > sp.gia ? sp.giaGoc : null,
      qty: sp.luotMua > 50 ? 50 : (sp.luotMua > 20 ? 20 : 10),
      desc: sp.moTa || sp.specs,
      specs: sp.specs,
      img: sp.img,
      status: 'Còn hàng',
      date: new Date().toISOString().slice(0, 10),
    };
  });

  // Kiểm tra dữ liệu localStorage hiện có
  const existingProductsStr = localStorage.getItem(STORAGE_KEYS.products);
  let existingProducts = [];
  if (existingProductsStr) {
    try { existingProducts = JSON.parse(existingProductsStr); } catch(e) {}
  }

  if (existingProducts.length > 0) {
    // Đã có dữ liệu admin -> merge: giữ sản phẩm admin đã thêm/chỉnh sửa
    // Thêm sản phẩm mới từ nguồn nếu chưa có trong localStorage
    const existingIds = {};
    existingProducts.forEach(function(p) { existingIds[p.id] = true; });

    var mergedProducts = existingProducts.slice();
    freshProducts.forEach(function(fp) {
      if (!existingIds[fp.id]) {
        mergedProducts.push(fp);
      } else {
        // Cập nhật ảnh từ nguồn nếu admin chưa đổi ảnh
        var existing = mergedProducts.find(function(p) { return p.id === fp.id; });
        if (existing && (!existing.img || existing.img.indexOf('placeholder') >= 0)) {
          existing.img = fp.img;
        }
      }
    });
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(mergedProducts));
  } else if (freshProducts.length > 0) {
    // Chưa có -> đồng bộ lần đầu (chỉ khi có dữ liệu từ API)
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(freshProducts));
  }

  // === KHÁCH HÀNG ===
  const existingCustomersStr = localStorage.getItem(STORAGE_KEYS.customers);
  if (!existingCustomersStr && typeof DEFAULT_CUSTOMERS !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify([...DEFAULT_CUSTOMERS]));
  }

  // === ĐƠN HÀNG ===
  if (!localStorage.getItem(STORAGE_KEYS.orders) && typeof DEFAULT_ORDERS !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([...DEFAULT_ORDERS]));
  }

  // === ĐÁNH GIÁ ===
  if (!localStorage.getItem(STORAGE_KEYS.reviews) && typeof DEFAULT_REVIEWS !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify([...DEFAULT_REVIEWS]));
  }

  // === BUILDS ===
  if (!localStorage.getItem(STORAGE_KEYS.builds)) {
    localStorage.setItem(STORAGE_KEYS.builds, JSON.stringify([]));
  }

  // === COUPONS ===
  if (!localStorage.getItem(STORAGE_KEYS.coupons)) {
    localStorage.setItem(STORAGE_KEYS.coupons, JSON.stringify([]));
  }
}

// Hàm khởi tạo dữ liệu (gọi sau khi products đã sẵn sàng)
function initializeData() {
  syncDataFromSource();
  products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || [];
  orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || (typeof DEFAULT_ORDERS !== 'undefined' ? [...DEFAULT_ORDERS] : []);
  customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers)) || (typeof DEFAULT_CUSTOMERS !== 'undefined' ? [...DEFAULT_CUSTOMERS] : []);
  builds = JSON.parse(localStorage.getItem(STORAGE_KEYS.builds)) || [];
  coupons = JSON.parse(localStorage.getItem(STORAGE_KEYS.coupons)) || [];
  reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.reviews)) || (typeof DEFAULT_REVIEWS !== 'undefined' ? [...DEFAULT_REVIEWS] : []);

  // Nếu products vẫn rỗng, thử load trực tiếp từ API qua callback
  if (products.length === 0 && typeof onProductsReady === 'function') {
    onProductsReady(function(allProducts) {
      if (allProducts.length > 0) {
        syncDataFromSource();
        products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || [];
        // Re-render nếu đã có page hiện tại
        if (currentPage) showPage(currentPage);
      }
    });
  }
}

// Khởi tạo biến từ localStorage (dùng hàm mới để đợi dữ liệu)
initializeData();

// Giỏ hàng hiện tại (đọc từ trang chính)
function getCartData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  } catch (e) { return []; }
}

// Aliases cho backward compatibility
const revenueData = typeof REVENUE_DATA !== 'undefined' ? REVENUE_DATA : [];
const orderData = typeof ORDER_DATA !== 'undefined' ? ORDER_DATA : [];
const months = typeof MONTHS !== 'undefined' ? MONTHS : [];

// Hàm lưu dữ liệu (đồng bộ vào localStorage)
function saveProducts() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  // Tự động đẩy dữ liệu ra public để đồng bộ với các trang frontend
  if (typeof pushAdminToPublic === 'function' && products.length > 0) {
    pushAdminToPublic(products);
  }
}
function saveOrders() {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}
function saveCustomers() {
  localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
}
function saveBuilds() {
  localStorage.setItem(STORAGE_KEYS.builds, JSON.stringify(builds));
}
function saveCoupons() {
  localStorage.setItem(STORAGE_KEYS.coupons, JSON.stringify(coupons));
}
function saveReviews() {
  localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
}

// Lưu trạng thái đơn hàng trước đó để theo dõi thay đổi
let prevOrderStatuses = {};

function trackOrderChanges() {
  const changes = [];
  orders.forEach(o => {
    if (prevOrderStatuses[o.id] && prevOrderStatuses[o.id] !== o.status) {
      changes.push({ order: o, from: prevOrderStatuses[o.id], to: o.status });
    }
    prevOrderStatuses[o.id] = o.status;
  });
  return changes;
}

// Thông báo — tạo tự động từ dữ liệu thực
function getNotifications() {
  const notifs = [];
  // Đơn chờ xử lý
  const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận');
  pendingOrders.forEach(o => {
    notifs.push({ icon: '🛒', text: `Đơn hàng mới #${o.id} từ ${o.customer}`, time: 'mới', type: 'order' });
  });
  // Theo dõi thay đổi trạng thái đơn hàng
  const statusChanges = trackOrderChanges();
  statusChanges.forEach(c => {
    notifs.push({ icon: '🔄', text: `Đơn #${c.order.id} chuyển từ "${c.from}" → "${c.to}"`, time: 'vừa xong', type: 'order' });
  });
  // Sản phẩm sắp hết
  const lowStock = products.filter(p => p.status === 'Sắp hết');
  lowStock.forEach(p => {
    notifs.push({ icon: '⚠️', text: `${p.name} sắp hết hàng (còn ${p.qty})`, time: 'gần đây', type: 'stock' });
  });
  // Tài khoản đăng ký mới (từ customers - đếm tổng số khách hàng)
  const totalCustomers = customers.length;
  notifs.push({ icon: '👤', text: `Tổng số khách hàng: ${totalCustomers}`, time: 'hiện tại', type: 'customer' });
  // Giỏ hàng hiện tại
  const cart = getCartData();
  if (cart.length > 0) {
    notifs.push({ icon: '🛒', text: `Khách đang có ${cart.length} sản phẩm trong giỏ hàng`, time: 'hiện tại', type: 'cart' });
  }
  return notifs.length > 0 ? notifs : [
    { icon: '✅', text: 'Không có thông báo mới', time: 'ngay bây giờ', type: 'info' }
  ];
}

/* ===== STATE ===== */
let currentPage = 'dashboard';
let currentSub  = null;
let editingProductId = null;
let productPage = 1;
const ITEMS_PER_PAGE = 5;
let productFilter = { search: '', category: '', status: '' };
let deleteCallback = null;

/* ===== KHỞI TẠO ===== */
document.addEventListener('DOMContentLoaded', () => {
  // ===== KIỂM TRA ĐĂNG NHẬP ADMIN =====
  if (!checkAdminAuth()) {
    document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:var(--bg-main);color:var(--text);font-family:Nunito,sans-serif;text-align:center;padding:2rem">
        <span class="material-icons" style="font-size:4rem;color:var(--red);margin-bottom:1rem">lock</span>
        <h1 style="color:var(--text);margin-bottom:0.5rem">Truy cập bị từ chối</h1>
        <p style="color:var(--text-muted);margin-bottom:1.5rem">Bạn cần đăng nhập với tài khoản Admin để truy cập trang này.</p>
        <a href="` + ROOT_PATH() + `main+ds+sp.html" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--cyan);color:white;border-radius:8px;text-decoration:none;font-weight:600;transition:opacity 0.2s" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
          <span class="material-icons">arrow_back</span> Về trang chủ
        </a>
      </div>`;
    return;
  }

  // Hiển thị tên admin
  if (adminUser) {
    const adminNameEl = document.getElementById('adminName');
    const adminAvatarEl = document.getElementById('adminAvatar');
    if (adminNameEl) adminNameEl.textContent = adminUser.name;
    if (adminAvatarEl) adminAvatarEl.textContent = adminUser.name.charAt(0).toUpperCase();
  }

  // Nút đăng xuất
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Đăng xuất và quay lại trang chủ?')) {
        localStorage.removeItem(USER_STORAGE_KEY);
        window.location.href = ROOT_PATH()+'main+ds+sp.html';
      }
    });
  }

  renderSidebar();
  renderNotifications();
  showPage('dashboard');

  // Toggle sidebar
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });

  // Toggle notification dropdown
  document.getElementById('notifBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.toggle('show');
  });
  document.addEventListener('click', () => {
    document.getElementById('notifDropdown').classList.remove('show');
  });

  // Tự động refresh dữ liệu mỗi 30 giây (đồng bộ với trang chính)
  setInterval(() => {
    // Đọc lại products từ localStorage
    const newProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || 'null');
    if (newProducts) products = newProducts;

    // Đọc lại orders
    const newOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || 'null');
    if (newOrders) orders = newOrders;

    // Đọc lại customers
    const newCustomers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || 'null');
    if (newCustomers) customers = newCustomers;

    // Cập nhật thông báo realtime
    renderNotifications();
  }, 30000);
});

/* ===== RENDER SIDEBAR ===== */
function renderSidebar() {
  const container = document.getElementById('menuContainer');
  container.innerHTML = MENUS.map(menu => `
    <div class="menu-group">
      <div class="menu-item" id="menu-${menu.id}" onclick="clickMenu('${menu.id}')">
        <span class="material-icons">${menu.icon}</span>
        <span class="menu-label">${menu.label}</span>
        ${menu.children ? `<span class="material-icons menu-arrow" id="arrow-${menu.id}">expand_more</span>` : ''}
      </div>
      ${menu.children ? `
        <div class="submenu" id="sub-${menu.id}">
          ${menu.children.map((child, i) => `
            <div class="submenu-item" onclick="clickSub('${menu.id}', '${child}', ${i})">${child}</div>
          `).join('')}
        </div>` : ''}
    </div>
  `).join('');
}

function clickMenu(id) {
  const menu = MENUS.find(m => m.id === id);

  // Nếu không có children → navigate thẳng
  if (!menu.children) {
    setActiveMenu(id, null);
    showPage(id);
    return;
  }

  // Toggle submenu
  const sub   = document.getElementById(`sub-${id}`);
  const arrow = document.getElementById(`arrow-${id}`);
  const isOpen = sub.classList.contains('open');
  // Đóng tất cả submenu
  document.querySelectorAll('.submenu').forEach(s => s.classList.remove('open'));
  document.querySelectorAll('.menu-arrow').forEach(a => a.classList.remove('open'));
  if (!isOpen) {
    sub.classList.add('open');
    arrow.classList.add('open');
  }
}

function clickSub(parentId, subName, idx) {
  setActiveMenu(parentId, subName);
  showPage(parentId, subName, idx);
}

function setActiveMenu(parentId, subName) {
  document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.submenu-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`menu-${parentId}`).classList.add('active');
  if (subName) {
    const subs = document.querySelectorAll(`#sub-${parentId} .submenu-item`);
    subs.forEach(el => { if (el.textContent === subName) el.classList.add('active'); });
  }
}

/* ===== RENDER NOTIFICATIONS ===== */
function renderNotifications() {
  const notifications = getNotifications();
  document.getElementById('notifBadge').textContent = notifications.length;
  document.getElementById('notifCount').textContent  = notifications.length;
  document.getElementById('notifList').innerHTML = notifications.map(n => `
    <div class="notif-item">
      <span class="notif-icon">${n.icon}</span>
      <div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

/* ===== PAGE ROUTER ===== */
function showPage(id, sub = null, subIdx = 0) {
  currentPage = id;
  currentSub  = sub;
  const main = document.getElementById('mainContent');

  if (id === 'dashboard') { main.innerHTML = renderDashboard(); renderCharts(); return; }
  if (id === 'products') {
    if (sub === 'Thêm sản phẩm') { openModal(); return; }
    if (sub === 'Danh mục')      { main.innerHTML = renderCategories(); return; }
    if (sub === 'Kho hàng')      { main.innerHTML = renderWarehouse(); return; }
    main.innerHTML = renderProducts();
    setTimeout(renderProductTable, 0);
    return;
  }
  if (id === 'orders')    { main.innerHTML = renderOrders();    setTimeout(renderOrderTable, 0);    return; }
  if (id === 'customers') { main.innerHTML = renderCustomers(); setTimeout(renderCustomerTable, 0); return; }
  if (id === 'builds')    { main.innerHTML = renderBuilds();    return; }
  if (id === 'coupons')   { main.innerHTML = renderCoupons();   return; }
  if (id === 'reviews')   {
    main.innerHTML = renderReviews();
    return;
  }
  if (id === 'stats')     { main.innerHTML = renderStats(); setTimeout(renderStatsCharts, 100); return; }
  if (id === 'settings')  { main.innerHTML = renderSettings(); return; }
}

/* ============================================
   GIAI ĐOẠN 3: DASHBOARD
   ============================================ */
function renderDashboard() {
  const totalRevenue = orders.filter(o => o.status === 'Hoàn thành').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận').length;
  const lowStock = products.filter(p => p.status === 'Sắp hết').length;
  const topProducts = [...products].sort((a,b) => b.price - a.price).slice(0,5);
  const recentOrders = [...orders].sort((a,b) => b.id.localeCompare(a.id)).slice(0,5);

  return `
    <h1 class="page-title">📊 Tổng quan</h1>

    <!-- Stat Cards -->
    <div class="stat-grid">
      ${statCard('monetization_on', 'cyan',   'Doanh thu',          fmtMoney(totalRevenue), '↑ 12%', 'up')}
      ${statCard('shopping_cart',   'green',  'Số đơn hàng',        orders.length, '↑ 8%', 'up')}
      ${statCard('people',          'yellow', 'Khách hàng',         customers.length, '↑ 5%', 'up')}
      ${statCard('inventory_2',     'cyan',   'Sản phẩm',           products.length, '', '')}
      ${statCard('warning',         'yellow', 'Sắp hết hàng',       lowStock, '', '')}
      ${statCard('pending_actions', 'red',    'Chờ xử lý',          pendingOrders, '', '')}
    </div>

    <!-- Charts -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-title">Doanh thu theo tháng (triệu VNĐ)</div>
        <div class="bar-chart" id="revenueChart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Đơn hàng theo tháng</div>
        <div class="bar-chart" id="orderChart"></div>
      </div>
    </div>

    <!-- Tables -->
    <div class="chart-grid">
      <div class="table-card">
        <div class="table-card-title">
          5 Đơn hàng mới nhất
          <a onclick="showPage('orders')">Xem tất cả →</a>
        </div>
        <table>
          <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${recentOrders.map(o => `
              <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td>${fmtMoney(o.total)}</td>
                <td>${orderStatusBadge(o.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="table-card">
        <div class="table-card-title">
          5 Sản phẩm nổi bật
          <a onclick="showPage('products')">Xem tất cả →</a>
        </div>
        <table>
          <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Kho</th></tr></thead>
          <tbody>
            ${topProducts.map(p => `
              <tr>
                <td>${p.name}</td>
                <td><span class="badge badge-cyan">${p.category}</span></td>
                <td>${fmtMoney(p.price)}</td>
                <td>${stockBadge(p.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function statCard(icon, color, label, value, trend, dir) {
  return `
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon ${color}"><span class="material-icons">${icon}</span></div>
        ${trend ? `<span class="stat-trend ${dir}">${trend}</span>` : ''}
      </div>
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    </div>`;
}

function renderCharts() {
  renderBarChart('revenueChart', revenueData, months, 52);
  renderBarChart('orderChart',   orderData,   months, 40);
}

function renderBarChart(id, data, labels, maxVal) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = data.map((val, i) => `
    <div class="bar-wrap">
      <div class="bar" style="height: ${(val/maxVal*100)}%" title="${labels[i]}: ${val}"></div>
      <span class="bar-label">${labels[i]}</span>
    </div>
  `).join('');
}

/* ============================================
   GIAI ĐOẠN 4 & 5: QUẢN LÝ SẢN PHẨM
   ============================================ */
function renderProducts() {
  productPage = 1;
  return `
    <h1 class="page-title">📦 Danh sách sản phẩm</h1>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search" style="flex:2">
        <span class="material-icons">search</span>
        <input type="text" id="searchInput" placeholder="Tìm tên sản phẩm..." oninput="filterProducts()">
      </div>
      <select id="catFilter" onchange="filterProducts()">
        <option value="">Tất cả danh mục</option>
        <option>CPU</option><option>GPU</option><option>RAM</option>
        <option>SSD</option><option>Mainboard</option><option>PSU</option>
        <option>Case</option><option>Laptop</option>
      </select>
      <select id="statusFilter" onchange="filterProducts()">
        <option value="">Tất cả trạng thái</option>
        <option>Còn hàng</option><option>Sắp hết</option><option>Hết hàng</option>
      </select>
      <button class="btn-primary" onclick="openModal()">
        <span class="material-icons">add</span> Thêm sản phẩm
      </button>
      <button class="btn-danger" onclick="bulkDelete()" id="bulkDelBtn" style="display:none">
        <span class="material-icons">delete</span> Xóa
      </button>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" id="checkAll" onchange="toggleAll(this)"></th>
            <th>ID</th><th>Ảnh</th><th>Tên sản phẩm</th>
            <th>Danh mục</th><th>Giá</th><th>Kho</th><th>Trạng thái</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody id="productTableBody"></tbody>
      </table>
      <div class="pagination" id="productPagination"></div>
    </div>
  `;
  // Render sau khi HTML được chèn vào DOM
  setTimeout(renderProductTable, 0);
}

function getFilteredProducts() {
  const s = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const c = document.getElementById('catFilter')?.value || '';
  const st = document.getElementById('statusFilter')?.value || '';
  return products.filter(p =>
    (!s  || p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)) &&
    (!c  || p.category === c) &&
    (!st || p.status === st)
  );
}

function filterProducts() { productPage = 1; renderProductTable(); }

function renderProductTable() {
  const filtered = getFilteredProducts();
  const start = (productPage - 1) * ITEMS_PER_PAGE;
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE);
  const tbody = document.getElementById('productTableBody');
  if (!tbody) return;

  if (paged.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><span class="material-icons">inventory_2</span><p>Không có sản phẩm nào</p></div></td></tr>`;
  } else {
    tbody.innerHTML = paged.map(p => `
      <tr>
        <td><input type="checkbox" class="row-check" data-id="${p.id}" onchange="updateBulkBtn()"></td>
        <td><strong>#${p.id}</strong></td>
        <td>${p.img ? `<img src="${p.img}" class="product-thumb" alt="">` : `<div class="no-img"><span class="material-icons">image</span></div>`}</td>
        <td>
          <div><strong>${p.name}</strong></div>
          <div style="font-size:0.8rem;color:var(--text-muted)">${p.brand}</div>
        </td>
        <td><span class="badge badge-cyan">${p.category}</span></td>
        <td>
          <div style="color:var(--cyan);font-weight:600">${fmtMoney(p.sale || p.price)}</div>
          ${p.sale ? `<div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through">${fmtMoney(p.price)}</div>` : ''}
        </td>
        <td>${p.qty}</td>
        <td>${stockBadge(p.status)}</td>
        <td>
          <div class="action-btns">
            <button class="act-btn view" onclick="viewProduct(${p.id})"><span class="material-icons">visibility</span></button>
            <button class="act-btn edit" onclick="editProduct(${p.id})"><span class="material-icons">edit</span></button>
            <button class="act-btn del"  onclick="confirmDelete('Xóa sản phẩm "${p.name}"?', () => deleteProduct(${p.id}))"><span class="material-icons">delete</span></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Pagination
  const total = filtered.length;
  const pages = Math.ceil(total / ITEMS_PER_PAGE);
  const pag = document.getElementById('productPagination');
  if (pag && pages > 1) {
    pag.innerHTML = Array.from({length: pages}, (_, i) => `
      <button class="page-btn ${productPage === i+1 ? 'active' : ''}" onclick="goPage(${i+1})">${i+1}</button>
    `).join('');
  } else if (pag) { pag.innerHTML = ''; }
}

function goPage(n) { productPage = n; renderProductTable(); }

function toggleAll(cb) {
  document.querySelectorAll('.row-check').forEach(c => c.checked = cb.checked);
  updateBulkBtn();
}
function updateBulkBtn() {
  const checked = document.querySelectorAll('.row-check:checked').length;
  const btn = document.getElementById('bulkDelBtn');
  if (btn) btn.style.display = checked > 0 ? 'flex' : 'none';
}
function bulkDelete() {
  const ids = [...document.querySelectorAll('.row-check:checked')].map(c => +c.dataset.id);
  confirmDelete(`Xóa ${ids.length} sản phẩm đã chọn?`, () => {
    products = products.filter(p => !ids.includes(p.id));
    saveProducts();
    renderProductTable();
    showToast('Đã xóa ' + ids.length + ' sản phẩm', 'success');
  });
}

function viewProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem">
      <button class="btn-secondary" onclick="showPage('products')"><span class="material-icons">arrow_back</span> Quay lại</button>
      <h1 class="page-title" style="margin:0">Chi tiết sản phẩm</h1>
    </div>
    <div class="chart-grid">
      <div class="table-card">
        ${p.img ? `<img src="${p.img}" style="width:100%;border-radius:8px;margin-bottom:1rem" alt="">` : `<div style="height:200px;background:var(--bg-side);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem"><span class="material-icons" style="font-size:4rem;color:var(--border)">image</span></div>`}
        <h2 style="color:var(--cyan-light);margin-bottom:0.5rem">${p.name}</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1rem">${p.desc}</p>
        <div style="font-size:1.5rem;font-weight:700;color:var(--cyan)">${fmtMoney(p.sale || p.price)}</div>
        ${p.sale ? `<div style="font-size:0.85rem;color:var(--text-muted);text-decoration:line-through">${fmtMoney(p.price)}</div>` : ''}
      </div>
      <div class="table-card">
        <div class="chart-title">Thông tin chi tiết</div>
        ${[['Thương hiệu', p.brand], ['Danh mục', p.category], ['Số lượng', p.qty], ['Trạng thái', p.status], ['Ngày thêm', p.date], ['Thông số', p.specs || 'N/A']].map(([k,v]) => `
          <div class="info-row"><span>${k}</span><span>${v}</span></div>
        `).join('')}
        <div style="margin-top:1rem;display:flex;gap:0.75rem">
          <button class="btn-primary" onclick="editProduct(${p.id})"><span class="material-icons">edit</span> Sửa</button>
          <button class="btn-danger" onclick="confirmDelete('Xóa sản phẩm?', () => { deleteProduct(${p.id}); showPage('products'); })">Xóa</button>
        </div>
      </div>
    </div>
  `;
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  openModal(p);
}
function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderProductTable();
  showToast('Đã xóa sản phẩm', 'success');
}

/* --- Modal Product --- */
function openModal(product = null) {
  editingProductId = product ? product.id : null;
  document.getElementById('modalTitle').textContent = product ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
  // Fill fields
  const f = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  f('p-name', product?.name); f('p-brand', product?.brand);
  f('p-category', product?.category); f('p-price', product?.price);
  f('p-sale', product?.sale); f('p-qty', product?.qty);
  f('p-desc', product?.desc); f('p-specs', product?.specs);
  f('p-img', product?.img); f('p-status', product?.status);
  document.getElementById('productModal').classList.add('show');
}
function closeModal() { document.getElementById('productModal').classList.remove('show'); }

function saveProduct() {
  const name = document.getElementById('p-name').value.trim();
  const price = +document.getElementById('p-price').value;
  const qty   = +document.getElementById('p-qty').value;
  if (!name || !price || qty < 0) { showToast('Vui lòng điền đầy đủ thông tin bắt buộc *', 'error'); return; }

  const product = {
    id:       editingProductId || (products.length ? Math.max(...products.map(p=>p.id)) + 1 : 1),
    name,
    brand:    document.getElementById('p-brand').value,
    category: document.getElementById('p-category').value,
    price,
    sale:     +document.getElementById('p-sale').value || null,
    qty,
    desc:     document.getElementById('p-desc').value,
    specs:    document.getElementById('p-specs').value,
    img:      document.getElementById('p-img').value,
    status:   document.getElementById('p-status').value,
    date:     new Date().toISOString().slice(0,10),
  };

  if (editingProductId) {
    const idx = products.findIndex(p => p.id === editingProductId);
    products[idx] = product;
    showToast('Đã cập nhật sản phẩm', 'success');
  } else {
    products.push(product);
    showToast('Đã thêm sản phẩm mới', 'success');
  }
  saveProducts();
  closeModal();
  if (document.getElementById('productTableBody')) renderProductTable();
}

/* --- Danh mục --- */
function renderCategories() {
  const cats = ['CPU','GPU','RAM','SSD','Mainboard','PSU','Case','Laptop'];
  const counts = cats.map(c => ({ name: c, count: products.filter(p => p.category === c).length }));
  return `
    <h1 class="page-title">📁 Danh mục sản phẩm</h1>
    <div class="stat-grid">
      ${counts.map(c => `
        <div class="stat-card" style="cursor:pointer" onclick="">
          <div class="stat-value">${c.count}</div>
          <div class="stat-label">${c.name}</div>
        </div>`).join('')}
    </div>
    <div class="table-card">
      <div class="chart-title">Danh sách danh mục</div>
      <table>
        <thead><tr><th>Danh mục</th><th>Số sản phẩm</th><th>Hoạt động</th></tr></thead>
        <tbody>
          ${counts.map(c => `
            <tr>
              <td><strong>${c.name}</strong></td>
              <td>${c.count}</td>
              <td>${c.count > 0 ? '<span class="badge badge-green">Có sản phẩm</span>' : '<span class="badge badge-gray">Trống</span>'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ============================================
   GIAI ĐOẠN 6: ĐƠN HÀNG
   ============================================ */
const ORDER_STEPS = ['Chờ xác nhận','Đã xác nhận','Đang chuẩn bị','Đang giao','Hoàn thành'];
const STATUS_CLASS = { 'Chờ xác nhận': 'badge-yellow', 'Đã xác nhận': 'badge-cyan', 'Đang chuẩn bị': 'badge-cyan', 'Đang giao': 'badge-cyan', 'Hoàn thành': 'badge-green', 'Đã hủy': 'badge-red' };

function renderOrders() {
  return `
    <h1 class="page-title">🛒 Quản lý đơn hàng</h1>
    <div class="toolbar">
      <div class="toolbar-search" style="flex:2">
        <span class="material-icons">search</span>
        <input type="text" placeholder="Tìm mã đơn, khách hàng..." oninput="filterOrders(this.value)">
      </div>
      <select onchange="filterOrderStatus(this.value)">
        <option value="">Tất cả trạng thái</option>
        ${ORDER_STEPS.map(s => `<option>${s}</option>`).join('')}
        <option>Đã hủy</option>
      </select>
    </div>
    <div class="table-card">
      <table>
        <thead>
          <tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th><th>Hành động</th></tr>
        </thead>
        <tbody id="orderTableBody"></tbody>
      </table>
    </div>
  `;
  setTimeout(renderOrderTable, 0);
}

function renderOrderTable(data = orders) {
  const tbody = document.getElementById('orderTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td>
      <td>${o.date}</td>
      <td style="color:var(--cyan);font-weight:600">${fmtMoney(o.total)}</td>
      <td>${o.payment}</td>
      <td>${orderStatusBadge(o.status)}</td>
      <td>
        <div class="action-btns">
          <button class="act-btn view" onclick="viewOrder('${o.id}')"><span class="material-icons">visibility</span></button>
          ${o.status !== 'Hoàn thành' && o.status !== 'Đã hủy' ? `
            <button class="act-btn edit" onclick="prevOrderStatus('${o.id}')" title="Quay lại"><span class="material-icons">arrow_back</span></button>
            <button class="act-btn edit" onclick="nextOrderStatus('${o.id}')" title="Tiếp theo"><span class="material-icons">arrow_forward</span></button>
            <button class="act-btn del"  onclick="cancelOrder('${o.id}')"><span class="material-icons">cancel</span></button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function viewOrder(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const stepIdx = ORDER_STEPS.indexOf(o.status);
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem">
      <button class="btn-secondary" onclick="showPage('orders')"><span class="material-icons">arrow_back</span> Quay lại</button>
      <h1 class="page-title" style="margin:0">Chi tiết đơn hàng ${o.id}</h1>
    </div>
    ${o.status !== 'Đã hủy' ? `
      <div class="table-card">
        <div class="chart-title">Trạng thái giao hàng</div>
        <div class="order-steps">
          ${ORDER_STEPS.map((step, i) => `
            <div class="step ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}">
              <div class="step-dot"><span class="material-icons">${i < stepIdx ? 'check' : 'radio_button_unchecked'}</span></div>
              <span class="step-label">${step}</span>
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    <div class="chart-grid">
      <div class="table-card">
        <div class="chart-title">Thông tin đơn hàng</div>
        ${[['Mã đơn', o.id], ['Khách hàng', o.customer], ['Số điện thoại', o.phone || 'Chưa có'], ['Email', o.email || 'Chưa có'], ['Địa chỉ', o.address || 'Chưa có'], ['Ghi chú', o.note || 'Không có'], ['Ngày đặt', o.date], ['Thanh toán', o.payment], ['Trạng thái', orderStatusBadge(o.status)]].map(([k,v]) => `
          <div class="info-row"><span>${k}</span><span>${v}</span></div>
        `).join('')}
      </div>
      <div class="table-card">
        <div class="chart-title">Sản phẩm</div>
        ${o.items.map(item => `<div class="info-row"><span>📦 ${item}</span></div>`).join('')}
        <div class="info-row"><span><strong>Tổng cộng</strong></span><span style="color:var(--cyan);font-weight:700">${fmtMoney(o.total)}</span></div>
        ${o.status !== 'Hoàn thành' && o.status !== 'Đã hủy' ? `
          <div style="margin-top:1rem;display:flex;gap:0.75rem">
            <button class="btn-secondary" onclick="prevOrderStatus('${o.id}');showPage('orders')">← Quay lại</button>
            <button class="btn-primary" onclick="nextOrderStatus('${o.id}');showPage('orders')">Bước tiếp theo →</button>
            <button class="btn-danger"  onclick="cancelOrder('${o.id}');showPage('orders')">Hủy đơn</button>
          </div>` : ''}
      </div>
    </div>
  `;
}

function nextOrderStatus(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const idx = ORDER_STEPS.indexOf(o.status);
  if (idx < ORDER_STEPS.length - 1) {
    o.status = ORDER_STEPS[idx + 1];
    saveOrders();
    showToast(`Đơn ${id}: ${o.status}`, 'success');
    renderOrderTable();
  }
}
function prevOrderStatus(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const idx = ORDER_STEPS.indexOf(o.status);
  if (idx > 0) {
    o.status = ORDER_STEPS[idx - 1];
    saveOrders();
    showToast(`Đơn ${id}: ${o.status}`, 'success');
    renderOrderTable();
  }
}
function cancelOrder(id) {
  const o = orders.find(x => x.id === id);
  if (o) { o.status = 'Đã hủy'; saveOrders(); showToast(`Đã hủy đơn ${id}`, 'error'); renderOrderTable(); }
}
function filterOrders(val) {
  const v = val.toLowerCase();
  renderOrderTable(orders.filter(o => o.id.toLowerCase().includes(v) || o.customer.toLowerCase().includes(v)));
}
function filterOrderStatus(val) {
  renderOrderTable(val ? orders.filter(o => o.status === val) : orders);
}

// Render table after innerHTML is set by showPage
setTimeout(() => {
  if (currentPage === 'orders') renderOrderTable();
}, 0);

/* ============================================
   GIAI ĐOẠN 7: KHÁCH HÀNG
   ============================================ */
function renderCustomers() {
  return `
    <h1 class="page-title">👥 Quản lý khách hàng</h1>
    <div class="toolbar">
      <div class="toolbar-search" style="flex:2">
        <span class="material-icons">search</span>
        <input type="text" placeholder="Tìm khách hàng..." oninput="filterCustomers(this.value)">
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead>
          <tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Điện thoại</th><th>Ngày tham gia</th><th>Số đơn</th><th>Chi tiêu</th><th>Hành động</th></tr>
        </thead>
        <tbody id="customerTableBody"></tbody>
      </table>
    </div>
  `;
  setTimeout(renderCustomerTable, 0);
}

function renderCustomerTable(data = customers) {
  const tbody = document.getElementById('customerTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.joined}</td>
      <td>${c.orders}</td>
      <td style="color:var(--cyan)">${fmtMoney(c.spent)}</td>
      <td>
        <div class="action-btns">
          <button class="act-btn view" onclick="viewCustomer(${c.id})"><span class="material-icons">person</span></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function viewCustomer(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;
  const cOrders = orders.filter(o => o.customer === c.name);
  document.getElementById('mainContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem">
      <button class="btn-secondary" onclick="showPage('customers')"><span class="material-icons">arrow_back</span> Quay lại</button>
      <h1 class="page-title" style="margin:0">Chi tiết khách hàng</h1>
    </div>
    <div class="customer-detail-grid">
      <div class="info-card">
        <div style="text-align:center;margin-bottom:1rem">
          <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--cyan),var(--cyan-dark));display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:var(--bg-main);margin:0 auto 0.75rem">${c.name[0]}</div>
          <div style="font-weight:700;font-size:1.1rem">${c.name}</div>
        </div>
        ${[['Email', c.email], ['Điện thoại', c.phone], ['Địa chỉ', c.address || 'Chưa cập nhật'], ['Tham gia', c.joined], ['Số đơn', c.orders], ['Tổng chi tiêu', fmtMoney(c.spent)]].map(([k,v]) => `
          <div class="info-row"><span>${k}</span><span>${v}</span></div>
        `).join('')}
      </div>
      <div class="table-card">
        <div class="chart-title">Lịch sử mua hàng</div>
        ${cOrders.length ? `
          <table>
            <thead><tr><th>Mã đơn</th><th>Ngày</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
            <tbody>
              ${cOrders.map(o => `
                <tr>
                  <td><strong>${o.id}</strong></td>
                  <td>${o.date}</td>
                  <td style="color:var(--cyan)">${fmtMoney(o.total)}</td>
                  <td>${orderStatusBadge(o.status)}</td>
                </tr>`).join('')}
            </tbody>
          </table>` : '<div class="empty-state"><span class="material-icons">shopping_bag</span><p>Chưa có đơn hàng nào</p></div>'}
      </div>
    </div>
  `;
}

function filterCustomers(val) {
  const v = val.toLowerCase();
  renderCustomerTable(customers.filter(c => c.name.toLowerCase().includes(v) || c.email.toLowerCase().includes(v)));
}

/* ============================================
   GIAI ĐOẠN 8: BUILD PC
   ============================================ */
function renderBuilds() {
  const pub  = builds.filter(b => b.public);
  const priv = builds.filter(b => !b.public);
  return `
    <h1 class="page-title">🖥️ Quản lý Build PC</h1>
    <div class="stat-grid" style="margin-bottom:1.5rem">
      ${statCard('memory', 'cyan', 'Tổng cấu hình', builds.length, '', '')}
      ${statCard('public',  'green','Công khai', pub.length, '', '')}
      ${statCard('lock',    'yellow','Riêng tư', priv.length, '', '')}
    </div>
    <div class="chart-grid">
      <div class="table-card">
        <div class="chart-title">Cấu hình công khai</div>
        ${pub.map(b => buildCard(b)).join('') || '<div class="empty-state"><span class="material-icons">memory</span><p>Chưa có cấu hình nào</p></div>'}
      </div>
      <div class="table-card">
        <div class="chart-title">Tất cả cấu hình</div>
        ${builds.map(b => buildCard(b)).join('')}
      </div>
    </div>
  `;
}
function buildCard(b) {
  return `
    <div class="build-card">
      <div class="build-card-title">${b.name} <span style="font-size:0.75rem;color:var(--text-muted)">by ${b.user}</span></div>
      <div class="build-parts">${b.parts.map(p => `<span class="build-tag">${p}</span>`).join('')}</div>
      <div style="display:flex;justify-content:space-between;margin-top:0.75rem;font-size:0.85rem">
        <span style="color:var(--cyan);font-weight:600">${fmtMoney(b.total)}</span>
        <span>${b.public ? '<span class="badge badge-green">Công khai</span>' : '<span class="badge badge-gray">Riêng tư</span>'}</span>
      </div>
    </div>
  `;
}

/* ============================================
   GIAI ĐOẠN 9: KHUYẾN MÃI
   ============================================ */
function renderCoupons() {
  return `
    <h1 class="page-title">🏷️ Quản lý khuyến mãi</h1>
    <div class="toolbar" style="margin-bottom:1rem">
      <button class="btn-primary" onclick="showToast('Tính năng thêm mã sắp ra mắt','success')">
        <span class="material-icons">add</span> Thêm mã giảm giá
      </button>
    </div>
    <div class="coupon-card">
      <div>
        <div class="coupon-code">PCZONE10</div>
        <div class="coupon-info">Giảm 10% | Đơn tối thiểu 500.000₫ | Hạn: 31/12/2025</div>
        <div class="coupon-info">Đã dùng: 45/100</div>
      </div>
      <div style="display:flex;gap:0.5rem;align-items:center">
        <span class="badge badge-green">Hoạt động</span>
      </div>
    </div>
  `;
}

/* ============================================
   GIAI ĐOẠN 10: ĐÁNH GIÁ
   ============================================ */
function renderReviews() {
  return `
    <h1 class="page-title">⭐ Quản lý đánh giá</h1>
    <div class="table-card">
      <table>
        <thead><tr><th>Sản phẩm</th><th>Người dùng</th><th>Rating</th><th>Nội dung</th><th>Ngày</th><th>Hành động</th></tr></thead>
        <tbody>
          ${reviews.map(r => `
            <tr>
              <td>${r.product}</td>
              <td>${r.user}</td>
              <td>${'⭐'.repeat(r.rating)}</td>
              <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.content}</td>
              <td>${r.date}</td>
              <td>
                <div class="action-btns">
                  <button class="act-btn del" onclick="confirmDelete('Xóa đánh giá này?', () => { reviews = reviews.filter(x=>x.id!==${r.id}); saveReviews(); showPage('reviews'); })"><span class="material-icons">delete</span></button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ===== THỐNG KÊ & KHO HÀNG ===== */
function renderStats() {
  return `
    <h1 class="page-title">📈 Thống kê</h1>
    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-title">Doanh thu 12 tháng (triệu VNĐ)</div>
        <div class="bar-chart" id="statRevChart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Đơn hàng 12 tháng</div>
        <div class="bar-chart" id="statOrdChart"></div>
      </div>
    </div>
    <div class="table-card">
      <div class="chart-title">Top sản phẩm theo giá</div>
      <table>
        <thead><tr><th>Hạng</th><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Kho</th></tr></thead>
        <tbody>
          ${[...products].sort((a,b)=>b.price-a.price).map((p,i) => `
            <tr>
              <td><strong>#${i+1}</strong></td>
              <td>${p.name}</td>
              <td><span class="badge badge-cyan">${p.category}</span></td>
              <td style="color:var(--cyan)">${fmtMoney(p.price)}</td>
              <td>${stockBadge(p.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}
function renderStatsCharts() {
  renderBarChart('statRevChart', revenueData, months, 52);
  renderBarChart('statOrdChart', orderData,   months, 40);
}

function renderWarehouse() {
  return `
    <h1 class="page-title">🏭 Kho hàng</h1>
    <div class="stat-grid" style="margin-bottom:1.5rem">
      ${statCard('inventory_2','cyan','Còn hàng', products.filter(p=>p.status==='Còn hàng').length,'','')}
      ${statCard('warning','yellow','Sắp hết', products.filter(p=>p.status==='Sắp hết').length,'','')}
      ${statCard('remove_shopping_cart','red','Hết hàng', products.filter(p=>p.status==='Hết hàng').length,'','')}
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Số lượng</th><th>Tình trạng</th><th>Mức tồn</th></tr></thead>
        <tbody>
          ${[...products].sort((a,b)=>a.qty-b.qty).map(p => {
            const pct = Math.min((p.qty / 20) * 100, 100);
            const color = p.qty === 0 ? 'var(--red)' : p.qty <= 5 ? 'var(--yellow)' : 'var(--green)';
            return `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge badge-cyan">${p.category}</span></td>
                <td>${p.qty}</td>
                <td>${stockBadge(p.status)}</td>
                <td style="width:120px">
                  <div class="stock-bar"><div class="stock-fill" style="width:${pct}%;background:${color}"></div></div>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ===== SETTINGS ===== */
function renderSettings() {
  return `
    <h1 class="page-title">⚙️ Cài đặt</h1>
    <div class="settings-section">
      <h3>Thông tin Admin</h3>
      <div class="table-card" style="max-width:500px">
        <div class="form-group" style="margin-bottom:1rem">
          <label>Họ tên</label>
          <input type="text" value="Admin PCZONE">
        </div>
        <div class="form-group" style="margin-bottom:1rem">
          <label>Email</label>
          <input type="text" value="admin@pczone.vn">
        </div>
        <button class="btn-primary" onclick="showToast('Đã lưu thông tin','success')">Lưu thay đổi</button>
      </div>
    </div>
    <div class="settings-section">
      <h3>Đổi mật khẩu</h3>
      <div class="table-card" style="max-width:500px">
        <div class="form-group" style="margin-bottom:1rem"><label>Mật khẩu cũ</label><input type="password" placeholder="••••••••"></div>
        <div class="form-group" style="margin-bottom:1rem"><label>Mật khẩu mới</label><input type="password" placeholder="••••••••"></div>
        <div class="form-group" style="margin-bottom:1rem"><label>Xác nhận mật khẩu</label><input type="password" placeholder="••••••••"></div>
        <button class="btn-primary" onclick="showToast('Đã đổi mật khẩu','success')">Đổi mật khẩu</button>
      </div>
    </div>
  `;
}

// Hàm đồng bộ dữ liệu thủ công
function doSyncData() {
  if (!confirm('Đồng bộ dữ liệu từ file nguồn? Các thay đổi chưa lưu sẽ bị mất.')) return;
  syncDataFromSource();
  // Reload biến
  products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || [];
  customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers)) || (typeof DEFAULT_CUSTOMERS !== 'undefined' ? [...DEFAULT_CUSTOMERS] : []);
  orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || (typeof DEFAULT_ORDERS !== 'undefined' ? [...DEFAULT_ORDERS] : []);
  builds = JSON.parse(localStorage.getItem(STORAGE_KEYS.builds)) || [];
  coupons = JSON.parse(localStorage.getItem(STORAGE_KEYS.coupons)) || [];
  reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.reviews)) || (typeof DEFAULT_REVIEWS !== 'undefined' ? [...DEFAULT_REVIEWS] : []);
  // Đẩy dữ liệu admin ra public để đồng bộ với các trang frontend
  if (typeof pushAdminToPublic === 'function' && products.length > 0) {
    pushAdminToPublic(products);
  }
  showToast('Đã đồng bộ dữ liệu thành công!', 'success');
  // Reload lại trang hiện tại
  if (currentPage) showPage(currentPage);
}

// Hàm xuất dữ liệu admin đã cập nhật ra file để thay thế data-products.js
function exportUpdatedData() {
  var content = '/* ============================================\n';
  content += '   PCZONE - DATA SẢN PHẨM (XUẤT TỪ ADMIN)\n';
  content += '   File này được tạo tự động từ Admin Panel.\n';
  content += '   ============================================ */\n\n';
  content += '// Số sản phẩm hiện tại: ' + products.length + '\n';
  content += '// Ngày xuất: ' + new Date().toISOString().slice(0,10) + '\n\n';
  
  // Xuất từng sản phẩm dưới dạng new SanPham(...)
  content += '// Để sử dụng, copy nội dung dưới đây thay thế phần ALL_PRODUCTS trong data-products.js\n\n';
  content += 'const ALL_PRODUCTS_EXPORTED = [\n';
  products.forEach(function(p, idx) {
    var danhMuc = p.category === 'Tản nhiệt' ? 'Cooler' :
                  p.category === 'SSD' ? 'Storage' :
                  p.category === 'Màn hình' ? 'Monitor' :
                  p.category === 'Linh kiện' ? 'Peripherals' :
                  p.category;
    var badge = '';
    var rating = (Math.random() * 0.5 + 4.5).toFixed(1);
    var luotMua = Math.floor(Math.random() * 100) + 10;
    var separator = idx < products.length - 1 ? ',' : '';
    content += '    // ' + p.name + '\n';
    content += '    new SanPham(' + p.id + ', "' + p.name.replace(/"/g, '\\"') + '", ' + p.price + ', ' + (p.sale || 0) + ', "' + (p.img || '') + '", "' + (p.specs || '').replace(/"/g, '\\"') + '", ' + rating + ', ' + luotMua + ', "' + danhMuc + '", "' + (p.brand || '').replace(/"/g, '\\"') + '", "' + (badge || '').replace(/"/g, '\\"') + '", "' + (p.desc || '').replace(/"/g, '\\"') + '", "", 0, 0)' + separator + '\n';
  });
  content += '];\n\n';
  content += '// Ghi chú: sau khi thay thế, chạy syncDataFromSource() trong admin để cập nhật localStorage.\n';

  // Tạo file download
  var blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data-products-updated.js';
  link.click();
  URL.revokeObjectURL(link.href);
  
  showToast('Đã xuất file dữ liệu! Thay thế vào data-products.js để cập nhật vĩnh viễn.', 'success');
}

/* ===== CONFIRM DELETE MODAL ===== */
function confirmDelete(msg, callback) {
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmModal').classList.add('show');
  deleteCallback = callback;
  document.getElementById('confirmOkBtn').onclick = () => {
    callback();
    closeConfirm();
  };
}
function closeConfirm() { document.getElementById('confirmModal').classList.remove('show'); }

/* ===== TOAST ===== */
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.className = 'toast', 3000);
}

/* ===== HELPERS ===== */
function fmtMoney(n) {
  if (!n) return '0₫';
  return n.toLocaleString('vi-VN') + '₫';
}
function orderStatusBadge(status) {
  return `<span class="badge ${STATUS_CLASS[status] || 'badge-gray'}">${status}</span>`;
}
function stockBadge(status) {
  const cls = { 'Còn hàng': 'badge-green', 'Sắp hết': 'badge-yellow', 'Hết hàng': 'badge-red' };
  return `<span class="badge ${cls[status] || 'badge-gray'}">${status}</span>`;
}