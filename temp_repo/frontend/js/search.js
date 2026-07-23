// ============================================
// SEARCH.JS — Tìm kiếm realtime + dropdown đề xuất
// Hoạt động trên tất cả các trang
// ============================================

// Hàm doSearch dùng chung cho nút tìm kiếm (onclick)
function doSearch() {
  var input = document.getElementById('searchInput');
  if (input && input.value.trim()) {
    window.location.href = ROOT_PATH()+'pages/best-sellers.html?keyword=' + encodeURIComponent(input.value.trim());
  }
}

(function() {
  var searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // Tạo dropdown container
  var dropdown = document.createElement('div');
  dropdown.className = 'search-dropdown';
  dropdown.id = 'searchDropdown';
  searchInput.parentNode.appendChild(dropdown);

  var debounceTimer = null;

  // Hàm render kết quả
  function renderResults(query) {
    var kw = query.trim().toLowerCase();
    if (!kw) {
      dropdown.classList.remove('show');
      return;
    }

    // Tìm kiếm trong getAllProducts (từ data-products.js)
    var results = [];
    if (typeof getAllProducts === 'function') {
      results = getAllProducts().filter(function(sp) {
        return sp.ten.toLowerCase().indexOf(kw) !== -1 ||
               sp.danhMuc.toLowerCase().indexOf(kw) !== -1 ||
               sp.hang.toLowerCase().indexOf(kw) !== -1;
      }).slice(0, 5);
    }

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="search-empty">Không tìm thấy sản phẩm phù hợp</div>';
      dropdown.classList.add('show');
      return;
    }

    var html = '';
    results.forEach(function(sp) {
      var gia = sp.hienThiGia ? sp.hienThiGia() : (sp.gia ? sp.gia.toLocaleString('vi-VN') + 'đ' : '');
      var link = sp.getLinkChiTiet ? sp.getLinkChiTiet() : ('chi-tiet-sp.html?id=' + sp.id);
      html += '<a href="' + link + '" class="search-item">' +
        '<img src="' + sp.img + '" alt="' + sp.ten + '" class="search-item-img" loading="lazy">' +
        '<div class="search-item-info">' +
          '<div class="search-item-name">' + sp.ten + '</div>' +
          '<div class="search-item-price">' + gia + '</div>' +
        '</div>' +
      '</a>';
    });

    // Thêm nút "Xem tất cả kết quả"
    html += '<a href="' + ROOT_PATH() + 'pages/best-sellers.html?keyword=' + encodeURIComponent(kw) + '" class="search-view-all">🔍 Xem tất cả kết quả</a>';

    dropdown.innerHTML = html;
    dropdown.classList.add('show');
  }

  // Sự kiện input: debounce 200ms
  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      renderResults(searchInput.value);
    }, 100);
  });

  // Sự kiện focus: nếu có giá trị thì hiện lại dropdown
  searchInput.addEventListener('focus', function() {
    if (searchInput.value.trim()) {
      renderResults(searchInput.value);
    }
  });

  // Enter → chuyển trang best-sellers
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var query = searchInput.value.trim();
      if (query) {
        window.location.href = ROOT_PATH()+'pages/best-sellers.html?keyword=' + encodeURIComponent(query);
      }
    }
  });

  // Click ra ngoài → đóng dropdown
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // Đóng dropdown khi scroll (trên mobile)
  window.addEventListener('scroll', function() {
    dropdown.classList.remove('show');
  }, { passive: true });

})();