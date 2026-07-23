// ========== 1. SLIDER ==========

const slides      = document.querySelectorAll('.slide');
const dotNavs     = document.querySelectorAll('.dot-nav');
const slideNum    = document.getElementById('slideNum');
const progressBar = document.getElementById('progressBar');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');

const INTERVAL = 10000;   // 10 giây đổi slide
let current = 0;
let autoTimer = null;

// Đi đến slide số n
function goTo(n) {
  // Bỏ active slide cũ
  slides[current].classList.remove('active');
  dotNavs[current].classList.remove('active');

  // Tính slide mới (vòng tròn)
  current = (n + slides.length) % slides.length;

  // Bật active slide mới
  slides[current].classList.add('active');
  dotNavs[current].classList.add('active');
  slideNum.textContent = (current + 1) + ' / ' + slides.length;

  // Reset progress bar
  progressBar.style.animation = 'none';
  progressBar.offsetWidth;   // trick: force reflow
  progressBar.style.animation = 'progress ' + (INTERVAL / 1000) + 's linear infinite';
}

// Tự động chạy
function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(function() { goTo(current + 1); }, INTERVAL);
}

// Gán sự kiện nút
prevBtn.addEventListener('click', function() { goTo(current - 1); startAuto(); });
nextBtn.addEventListener('click', function() { goTo(current + 1); startAuto(); });

// Gán sự kiện dot
dotNavs.forEach(function(dot) {
  dot.addEventListener('click', function() {
    goTo(parseInt(dot.dataset.i));
    startAuto();
  });
});

// Khởi động
startAuto();






// ========== 2. SIDEBAR TOGGLE ==========

const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Mặc định: sidebar MỞ (không có class 'collapsed')
// Bấm toggle: thêm/bỏ class 'collapsed'
sidebarToggle.addEventListener('click', function() {
  sidebar.classList.toggle('collapsed');
});














const trigger = document.getElementById('megaTrigger');
const menu = document.getElementById('megaMenu');

// JS Toggle (Hover/Click tùy chọn, ví dụ hover)
trigger.addEventListener('mouseenter', () => menu.classList.add('open'));
trigger.addEventListener('mouseleave', () => menu.classList.remove('open'));