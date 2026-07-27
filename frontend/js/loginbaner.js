// ========== 1. SLIDER (chỉ chạy khi có slider trên trang) ==========
if (document.getElementById('prevBtn')) {
  const slides      = document.querySelectorAll('.slide');
  const dotNavs     = document.querySelectorAll('.dot-nav');
  const slideNum    = document.getElementById('slideNum');
  const progressBar = document.getElementById('progressBar');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  const INTERVAL = 10000;
  let current = 0;
  let autoTimer = null;

  function goTo(n) {
    slides[current].classList.remove('active');
    dotNavs[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotNavs[current].classList.add('active');
    slideNum.textContent = (current + 1) + ' / ' + slides.length;
    progressBar.style.animation = 'none';
    progressBar.offsetWidth;
    progressBar.style.animation = 'progress ' + (INTERVAL / 1000) + 's linear infinite';
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(current + 1); }, INTERVAL);
  }

  prevBtn.addEventListener('click', function() { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', function() { goTo(current + 1); startAuto(); });

  dotNavs.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(dot.dataset.i));
      startAuto();
    });
  });

  startAuto();
}






// ========== 2. SIDEBAR TOGGLE (chỉ khi có sidebar) ==========
if (document.getElementById('sidebarToggle')) {
  const sidebar       = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
  });
}
















// ========== 3. LOGIN MODAL & AVATAR DROPDOWN ==========
if (document.getElementById('avatarBtn')) {
var avatarBtn  = document.getElementById('avatarBtn');
var loginModal = document.getElementById('loginModal');
var modalClose = document.getElementById('modalClose');
var loginBtn   = document.getElementById('loginBtn');
var loginError = document.getElementById('loginError');

// ===== TẠO DROPDOWN MENU =====
var dropMenu = document.createElement('div');
dropMenu.className = 'avatar-dropdown';
dropMenu.id = 'avatarDropdown';
document.querySelector('.nav-actions').appendChild(dropMenu);

// ===== TẠO SETTINGS POPUP =====
var settingsHTML = '<div class="settings-overlay" id="settingsOverlay">' +
  '<div class="settings-box">' +
    '<div class="settings-header">' +
      '<h3>⚙️ Cài đặt tài khoản</h3>' +
      '<button class="settings-close" id="settingsClose">✕</button>' +
    '</div>' +
    '<div class="settings-success" id="settingsSuccess">✅ Cập nhật thành công!</div>' +
    '<div class="settings-field">' +
      '<label>Họ tên</label>' +
      '<input type="text" id="settingsName" placeholder="Nhập họ tên">' +
    '</div>' +
    '<div class="settings-field">' +
      '<label>Email</label>' +
      '<input type="email" id="settingsEmail" placeholder="Nhập email">' +
    '</div>' +
    '<div class="settings-field">' +
      '<label>Số điện thoại</label>' +
      '<input type="text" id="settingsPhone" placeholder="Nhập SĐT">' +
    '</div>' +
    '<div class="settings-field">' +
      '<label>Mật khẩu mới</label>' +
      '<input type="password" id="settingsPassword" placeholder="Để trống nếu không đổi">' +
    '</div>' +
    '<div class="settings-field">' +
      '<label>Xác nhận mật khẩu</label>' +
      '<input type="password" id="settingsConfirm" placeholder="Nhập lại mật khẩu mới">' +
    '</div>' +
    '<button class="settings-save-btn" id="settingsSaveBtn">💾 Lưu thay đổi</button>' +
  '</div>' +
'</div>';
document.body.insertAdjacentHTML('beforeend', settingsHTML);

// ===== TẠO REGISTER POPUP =====
var registerHTML = '<div class="login-modal" id="registerModal">' +
  '<div class="login-box">' +
    '<button class="login-close" id="registerClose">&times;</button>' +
    '<h2 class="login-title">📝 Đăng ký tài khoản</h2>' +
    '<p class="login-subtitle">Tạo tài khoản mới để mua sắm tại PCZONE</p>' +
    '<div id="registerError" style="display:none;color:#dc2626;background:#fee2e2;padding:10px;border-radius:8px;margin-bottom:12px;font-size:13px;font-weight:600;text-align:center"></div>' +
    '<div class="login-field">' +
      '<label>Họ tên *</label>' +
      '<input type="text" id="regName" placeholder="Nhập họ tên">' +
    '</div>' +
    '<div class="login-field">' +
      '<label>Email *</label>' +
      '<input type="email" id="regEmail" placeholder="email@vi-du.com">' +
    '</div>' +
    '<div class="login-field">' +
      '<label>Số điện thoại</label>' +
      '<input type="tel" id="regPhone" placeholder="Số điện thoại">' +
    '</div>' +
    '<div class="login-field">' +
      '<label>Địa chỉ</label>' +
      '<input type="text" id="regAddress" placeholder="Địa chỉ nhận hàng">' +
    '</div>' +
    '<div class="login-field">' +
      '<label>Mật khẩu * (tối thiểu 6 ký tự)</label>' +
      '<input type="password" id="regPassword" placeholder="••••••••">' +
    '</div>' +
    '<div class="login-field">' +
      '<label>Xác nhận mật khẩu *</label>' +
      '<input type="password" id="regConfirm" placeholder="Nhập lại mật khẩu">' +
    '</div>' +
    '<button class="login-btn" id="registerBtn" style="margin-bottom:12px;">📝 Đăng ký</button>' +
    '<div style="text-align:center;font-size:13px;color:#718096;">' +
      'Đã có tài khoản? <a href="#" id="switchToLogin" style="color:#00bcd4;font-weight:700;">Đăng nhập</a>' +
    '</div>' +
  '</div>' +
'</div>';
document.body.insertAdjacentHTML('beforeend', registerHTML);

// Danh sách tài khoản → lấy từ data-customers.js (ACCOUNTS)

// ===== TRẠNG THÁI ĐĂNG NHẬP (đồng bộ localStorage) =====
const USER_STORAGE_KEY = 'pczone_user';

// Khôi phục đăng nhập từ localStorage khi trang load
var currentUser = null;
try {
  var savedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    // Cập nhật UI ngay lập tức
    updateNavAfterLogin(currentUser);
  }
} catch (e) {
  currentUser = null;
}

// Hàm cập nhật dropdown
function updateDropdown(user) {
  if (!user) { dropMenu.innerHTML = ''; dropMenu.classList.remove('show'); return; }
  var initials = user.name.charAt(0).toUpperCase();
  var roleText = user.role === 'admin' ? '👑 Quản trị viên' : '🛒 Khách hàng';
  var avatarStyle = user.role === 'admin'
    ? 'background:#fee2e2;color:#dc2626;border-color:#fca5a5'
    : 'background:#e0f7fa;color:#0097a7;border-color:#00bcd4';
  var adminItem = user.role === 'admin'
    ? '<div class="drop-item" data-action="admin"><span class="drop-icon">👑</span> Sang trang Admin</div>'
    : '';

  dropMenu.innerHTML =
    '<div class="drop-header">' +
      '<div class="drop-avatar" style="' + avatarStyle + '">' + initials + '</div>' +
      '<div class="drop-info">' +
        '<div class="drop-name">' + user.name + '</div>' +
        '<div class="drop-role">' + roleText + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="drop-item" data-action="settings"><span class="drop-icon">⚙️</span> Cài đặt tài khoản</div>' +
    '<div class="drop-item" data-action="orders"><span class="drop-icon">📦</span> Đơn hàng</div>' +
    adminItem +
    '<div class="drop-item danger" data-action="logout"><span class="drop-icon">🚪</span> Đăng xuất</div>';

  // Gán sự kiện cho các item
  dropMenu.querySelectorAll('.drop-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      var action = this.dataset.action;
      if (action === 'settings') { openSettings(); closeDropdown(); }
      else if (action === 'orders') { closeDropdown(); window.location.href = ROOT_PATH()+'pages/don-mua.html'; }
      else if (action === 'admin') { closeDropdown(); window.location.href = 'admin.html'; }
      else if (action === 'logout') { closeDropdown(); logout(); }
    });
  });
}

function closeDropdown() {
  dropMenu.classList.remove('show');
}

// Click avatar → toggle dropdown
avatarBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  if (currentUser) {
    dropMenu.classList.toggle('show');
  } else {
    openModal();
  }
});

// Click ra ngoài → đóng dropdown
document.addEventListener('click', function(e) {
  if (!avatarBtn.contains(e.target) && !dropMenu.contains(e.target)) {
    closeDropdown();
  }
});

// Đóng modal khi bấm X
modalClose.addEventListener('click', closeModal);

// Đóng modal khi bấm ra ngoài
loginModal.addEventListener('click', function(e) {
  if (e.target === loginModal) closeModal();
});

// ===== REGISTER MODAL EVENTS =====
var registerModal = document.getElementById('registerModal');
var registerClose = document.getElementById('registerClose');
var registerBtn = document.getElementById('registerBtn');
var registerError = document.getElementById('registerError');
var switchToLogin = document.getElementById('switchToLogin');

// Đóng register modal
registerClose.addEventListener('click', function() { registerModal.classList.remove('show'); });
registerModal.addEventListener('click', function(e) { if (e.target === registerModal) registerModal.classList.remove('show'); });

// Chuyển từ register → login
switchToLogin.addEventListener('click', function(e) {
  e.preventDefault();
  registerModal.classList.remove('show');
  openModal();
});

// Thêm nút "Đăng ký" vào login modal
var loginRegisterLink = document.createElement('div');
loginRegisterLink.style.cssText = 'text-align:center;font-size:13px;color:#718096;margin-top:15px;';
loginRegisterLink.innerHTML = 'Chưa có tài khoản? <a href="#" id="gotoRegister" style="color:#00bcd4;font-weight:700;">Đăng ký ngay</a>';
document.querySelector('.login-box').appendChild(loginRegisterLink);

document.getElementById('gotoRegister').addEventListener('click', function(e) {
  e.preventDefault();
  closeModal();
  registerModal.classList.add('show');
  document.getElementById('regName').focus();
  registerError.style.display = 'none';
});

// Bấm nút đăng ký
registerBtn.addEventListener('click', doRegister);
// Enter trong register
document.getElementById('regConfirm').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doRegister();
});

// Bấm nút đăng nhập
loginBtn.addEventListener('click', doLogin);

// Bấm Enter trong input cũng đăng nhập
document.getElementById('loginPassword').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});

function openModal() {
  loginModal.classList.add('show');
  document.getElementById('loginEmail').focus();
  loginError.style.display = 'none';
}

function closeModal() {
  loginModal.classList.remove('show');
}

// ===== HÀM ĐĂNG KÝ =====
async function doRegister() {
  var name = document.getElementById('regName').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var phone = document.getElementById('regPhone').value.trim();
  var address = document.getElementById('regAddress').value.trim();
  var password = document.getElementById('regPassword').value;
  var confirm = document.getElementById('regConfirm').value;

  if (!name || !email || !password) {
    registerError.textContent = '❌ Vui lòng điền đầy đủ họ tên, email và mật khẩu!';
    registerError.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    registerError.textContent = '❌ Mật khẩu phải có ít nhất 6 ký tự!';
    registerError.style.display = 'block';
    return;
  }

  if (password !== confirm) {
    registerError.textContent = '❌ Mật khẩu xác nhận không khớp!';
    registerError.style.display = 'block';
    return;
  }

  try {
    const result = await apiRegister({
      ten: name,
      email: email,
      matKhau: password,
      soDienThoai: phone,
      diaChi: address
    });

    // Đăng ký thành công → đóng register, mở login
    registerModal.classList.remove('show');
    showToast('✅ Đăng ký thành công! Vui lòng đăng nhập.', '#22C55E');

    // Mở login modal, điền sẵn email
    setTimeout(function() {
      openModal();
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').focus();
    }, 500);
  } catch (error) {
    var errMsg = error.message || 'Đăng ký thất bại!';
    // Nếu lỗi từ backend validation, nó có dạng JSON errors
    if (errMsg.indexOf('{') >= 0) {
      try {
        var parsed = JSON.parse(errMsg);
        if (parsed.errors) {
          var allErrors = [];
          for (var key in parsed.errors) {
            allErrors.push(parsed.errors[key].join(', '));
          }
          errMsg = allErrors.join('; ');
        } else if (parsed.title) {
          errMsg = parsed.title;
        }
      } catch(e) {}
    }
    registerError.textContent = '❌ ' + errMsg;
    registerError.style.display = 'block';
    console.error('Register error:', error);
  }
}

async function doLogin() {
  var email    = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    loginError.textContent = '❌ Vui lòng nhập email và mật khẩu!';
    loginError.style.display = 'block';
    return;
  }

  try {
    // Gọi API backend để đăng nhập — nhận JWT token
    const result = await apiLogin(email, password);

    // result trả về: { id, ten, email, vaiTro, token }
    // apiLogin() đã lưu token vào localStorage 'pczone_token' qua saveToken()

    // Lưu thông tin user để UI dùng (avatar, dropdown, role)
    currentUser = {
      id: result.id,
      name: result.ten,
      email: result.email,
      role: result.vaiTro.toLowerCase()
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));

    // Đóng modal và cập nhật UI
    closeModal();
    updateNavAfterLogin(currentUser);

    // Nếu là admin → chuyển sang trang admin
    if (currentUser.role === 'admin') {
      window.location.href = 'admin.html';
    }
  } catch (error) {
    loginError.textContent = '❌ ' + (error.message || 'Đăng nhập thất bại!');
    loginError.style.display = 'block';
  }
}

function logout() {
  currentUser = null;
  // Xóa cả token và user info
  localStorage.removeItem(USER_STORAGE_KEY);
  apiLogout(); // Xóa token khỏi localStorage
  // Reset avatar về trạng thái ban đầu
  avatarBtn.innerHTML = '<svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  avatarBtn.classList.remove('avatar-logged');
  avatarBtn.style.background = '';
  avatarBtn.style.borderColor = '';
  avatarBtn.title = 'Đăng nhập';
  // Xóa dropdown
  updateDropdown(null);
}

function updateNavAfterLogin(user) {
  // Đổi icon avatar thành chữ viết tắt + màu theo role
  var initials = user.name.charAt(0).toUpperCase();

  if (user.role === 'admin') {
    avatarBtn.innerHTML = '<span style="font-size:13px;font-weight:900;color:#dc2626">' + initials + '</span>';
    avatarBtn.style.background = '#fee2e2';
    avatarBtn.style.borderColor = '#fca5a5';
    avatarBtn.title = 'Admin: ' + user.name;
  } else {
    avatarBtn.innerHTML = '<span style="font-size:13px;font-weight:900;color:#0097a7">' + initials + '</span>';
    avatarBtn.style.background = '#e0f7fa';
    avatarBtn.style.borderColor = '#00bcd4';
    avatarBtn.title = 'Khách: ' + user.name;
  }

  // Cập nhật dropdown
  updateDropdown(user);
}

// ===== SETTINGS POPUP =====
function openSettings() {
  var overlay = document.getElementById('settingsOverlay');
  document.getElementById('settingsName').value = currentUser.name || '';
  document.getElementById('settingsEmail').value = currentUser.email || '';
  document.getElementById('settingsPhone').value = currentUser.phone || '';
  document.getElementById('settingsPassword').value = '';
  document.getElementById('settingsConfirm').value = '';
  document.getElementById('settingsSuccess').style.display = 'none';
  overlay.classList.add('show');
}

function closeSettings() {
  document.getElementById('settingsOverlay').classList.remove('show');
}

// Settings events
document.getElementById('settingsClose').addEventListener('click', closeSettings);
document.getElementById('settingsOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeSettings();
});
document.getElementById('settingsSaveBtn').addEventListener('click', function() {
  var name = document.getElementById('settingsName').value.trim();
  var email = document.getElementById('settingsEmail').value.trim();
  var phone = document.getElementById('settingsPhone').value.trim();
  var newPass = document.getElementById('settingsPassword').value;
  var confirmPass = document.getElementById('settingsConfirm').value;
  var successDiv = document.getElementById('settingsSuccess');

  if (!name || !email) {
    showToast('❌ Họ tên và email không được để trống!', '#EF4444');
    return;
  }

  if (newPass && newPass !== confirmPass) {
    showToast('❌ Mật khẩu xác nhận không khớp!', '#EF4444');
    return;
  }

  // Cập nhật trong ACCOUNTS
  var acc = ACCOUNTS.find(function(a) { return a.email === currentUser.email; });
  if (acc) {
    acc.name = name;
    acc.email = email;
    acc.phone = phone;
    if (newPass) acc.password = newPass;
  }

  // Cập nhật currentUser
  currentUser.name = name;
  currentUser.email = email;
  currentUser.phone = phone;
  if (newPass) currentUser.password = newPass;

  // Lưu localStorage
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));

  // Cập nhật UI
  updateNavAfterLogin(currentUser);

  // Thông báo
  successDiv.style.display = 'block';
  showToast('✅ Cập nhật thông tin thành công!', '#22C55E');
});

}  // end if (avatarBtn)

// Toast thông báo nhỏ
function showToast(msg, color) {
  var toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed', 'bottom:24px', 'right:24px',
    'background:' + color, 'color:white',
    'padding:10px 20px', 'border-radius:40px',
    'font-family:Nunito,sans-serif', 'font-size:14px', 'font-weight:700',
    'box-shadow:0 4px 16px rgba(0,0,0,0.15)',
    'z-index:9999', 'opacity:0',
    'transition:opacity 0.3s'
  ].join(';');

  document.body.appendChild(toast);

  // Fade in
  setTimeout(function() { toast.style.opacity = '1'; }, 10);
  // Fade out sau 3 giây
  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// ========== 4. MEGA MENU HOVER (chỉ khi có mega menu) ==========
if (document.getElementById('megaTrigger')) {
const trigger = document.getElementById('megaTrigger');
const menu = document.getElementById('megaMenu');
let megaTimeout = null;

trigger.addEventListener('mouseenter', function() {
  clearTimeout(megaTimeout);
  menu.classList.add('open');
});
trigger.addEventListener('mouseleave', function() {
  megaTimeout = setTimeout(function() { menu.classList.remove('open'); }, 300);
});
menu.addEventListener('mouseenter', function() {
  clearTimeout(megaTimeout);
});
menu.addEventListener('mouseleave', function() {
  megaTimeout = setTimeout(function() { menu.classList.remove('open'); }, 300);
});
}

// ========== 5. TÌM KIẾM (Part 5) ==========
function doSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  // Chuyển đến trang best-sellers với keyword tìm kiếm
  window.location.href = ROOT_PATH()+'pages/best-sellers.html?keyword=' + encodeURIComponent(query);
}
