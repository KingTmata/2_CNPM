// ============================================
// BEST-SELLERS.JS — Dùng chung cho tất cả trang danh mục
// Sử dụng dữ liệu từ data-products.js
// Hỗ trợ biến DEFAULT_CATEGORY đặt trong mỗi trang HTML
// ============================================

// Biến lưu trạng thái filter
var filterState = {
    brands: [],
    priceMax: 20000000,
    props: {}
};

// Biến sort hiện tại
var currentSort = 'ban-chay';

// Tên hiển thị cho sort
var sortLabels = {
    'ban-chay': 'Bán chạy nhất',
    'gia-tang': 'Giá tăng dần',
    'gia-giam': 'Giá giảm dần',
    'moi-nhat': 'Mới nhất',
    'danh-gia': 'Đánh giá cao nhất',
    'giam-nhieu': 'Giảm giá nhiều nhất',
    'hang-a-z': 'Theo hãng (A-Z)'
};

function filterAndRender() {
    var category = document.getElementById('filterCategory').value;
    var keyword = document.getElementById('searchBox').value.trim();

    var filters = {};
    if (category !== 'tat-ca') filters.danhMuc = category;
    if (keyword) filters.tuKhoa = keyword;

    // Xử lý sort
    if (currentSort === 'gia-tang') filters.sort = 'gia-tang';
    else if (currentSort === 'gia-giam') filters.sort = 'gia-giam';
    else filters.sort = 'ban-chay';

    // Áp dụng filter từ sidebar
    if (filterState.brands.length > 0) {
        filters.hang = filterState.brands;
    }
    if (filterState.priceMax < 20000000) {
        filters.giaMax = filterState.priceMax;
    }

    var result = filterProducts(filters);

    // Sort kết quả
    if (currentSort === 'ban-chay') {
        result.sort(function(a, b) { return (b.luotMua || 0) - (a.luotMua || 0); });
    } else if (currentSort === 'moi-nhat') {
        result.sort(function(a, b) { return new Date(b.ngayRaMat || 0) - new Date(a.ngayRaMat || 0); });
    } else if (currentSort === 'danh-gia') {
        result.sort(function(a, b) { return (b.danhGia || 0) - (a.danhGia || 0); });
    } else if (currentSort === 'giam-nhieu') {
        result.sort(function(a, b) {
            var aGiam = a.giaGoc && a.gia ? (a.giaGoc - a.gia) / a.giaGoc : 0;
            var bGiam = b.giaGoc && b.gia ? (b.giaGoc - b.gia) / b.giaGoc : 0;
            return bGiam - aGiam;
        });
    } else if (currentSort === 'hang-a-z') {
        result.sort(function(a, b) {
            var aBrand = (a.hang || '').toLowerCase();
            var bBrand = (b.hang || '').toLowerCase();
            if (aBrand < bBrand) return -1;
            if (aBrand > bBrand) return 1;
            return 0;
        });
    }

    var grid = document.getElementById('productGrid');
    var countEl = document.getElementById('productCount');

    if (result.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#718096"><p style="font-size:40px;margin-bottom:15px">📦</p><p style="font-size:16px;font-weight:600">Không tìm thấy sản phẩm phù hợp</p></div>';
        countEl.innerHTML = 'Hiển thị <strong>0</strong> sản phẩm';
        return;
    }

    var html = '';
    result.forEach(function(sp) {
        html += renderProductCard(sp);
    });

    grid.innerHTML = html;
    countEl.innerHTML = 'Hiển thị <strong>' + result.length + '</strong> sản phẩm';

    // Cập nhật filter tags
    renderFilterTags();
}

// Khởi tạo danh mục cho dropdown filter
function initCategoryFilter() {
    var select = document.getElementById('filterCategory');
    var cats = getAllCategories();
    cats.forEach(function(cat) {
        var opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}

// Đọc category từ URL (?category=...) và set filter
function applyUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('category');
    if (cat) {
        var select = document.getElementById('filterCategory');
        cat = decodeURIComponent(cat);
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value === cat) {
                select.value = cat;
                break;
            }
        }
    } else if (typeof DEFAULT_CATEGORY !== 'undefined' && DEFAULT_CATEGORY) {
        var select = document.getElementById('filterCategory');
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value === DEFAULT_CATEGORY) {
                select.value = DEFAULT_CATEGORY;
                break;
            }
        }
    }
    var keyword = params.get('keyword');
    if (keyword) {
        document.getElementById('searchBox').value = decodeURIComponent(keyword);
    }
}

// ===== RENDER BEST SELLERS (cho main+ds+sp.html) =====
function renderBestSellers(products) {
    var grid = document.getElementById('bestSellerGrid');
    if (!grid) return;
    if (!products || products.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:#718096">Đang tải dữ liệu...</div>';
        return;
    }
    var bestSellers = products.sort(function(a, b) { return b.luotMua - a.luotMua; }).slice(0, 5);
    var html = '';
    bestSellers.forEach(function(sp) {
        html += renderProductCard(sp);
    });
    grid.innerHTML = html;
}

// Tự động render Best Sellers khi dữ liệu sẵn sàng
function initBestSellersRender() {
    var existingProducts = getAllProducts();
    if (existingProducts && existingProducts.length > 0) {
        renderBestSellers(existingProducts);
    } else {
        var grid = document.getElementById('bestSellerGrid');
        if (grid) grid.innerHTML = '<div style="text-align:center;padding:40px;color:#718096">Đang tải dữ liệu...</div>';
        document.addEventListener('productsLoaded', function(e) {
            renderBestSellers(e.detail);
        });
        setTimeout(function() {
            var retry = getAllProducts();
            if (retry && retry.length > 0) {
                renderBestSellers(retry);
            }
        }, 3000);
    }
}

// ===== BRAND OVERLAY (giống Sort Overlay) =====

// Lấy danh sách thương hiệu từ sản phẩm hiện tại
function getBrandsFromProducts(products) {
    var brands = {};
    products.forEach(function(sp) {
        if (sp.hang) {
            if (!brands[sp.hang]) brands[sp.hang] = 0;
            brands[sp.hang]++;
        }
    });
    return brands;
}

// Render brand overlay
function renderBrandOverlay() {
    var container = document.getElementById('brandOptions');
    if (!container) return;

    // Lấy danh sách sản phẩm hiện tại (theo danh mục đã chọn)
    var category = document.getElementById('filterCategory').value;
    var products = category !== 'tat-ca' ? getProductsByCategory(category) : getAllProducts();

    // Lấy thương hiệu
    var brands = getBrandsFromProducts(products);
    var brandKeys = Object.keys(brands).sort();

    // Render brand list
    var html = '';
    brandKeys.forEach(function(b) {
        var checked = filterState.brands.indexOf(b) !== -1 ? 'checked' : '';
        html += '<label class="brand-option" style="display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;transition:0.2s">' +
            '<input type="checkbox" value="' + b + '" ' + checked + ' onchange="toggleBrand(this)" style="width:18px;height:18px;accent-color:#00bcd4">' +
            '<span style="flex:1;font-weight:600">' + b + '</span>' +
            '<span style="color:#94a3b8;font-size:12px">(' + brands[b] + ')</span>' +
            '</label>';
    });
    container.innerHTML = html;
}

// Mở / đóng brand overlay
function toggleBrandOverlay() {
    var overlay = document.getElementById('brandOverlay');
    if (overlay) {
        overlay.classList.toggle('show');
        if (overlay.classList.contains('show')) {
            renderBrandOverlay();
        }
    }
}

// Đóng brand overlay
function closeBrandOverlay() {
    var overlay = document.getElementById('brandOverlay');
    if (overlay) overlay.classList.remove('show');
}

// Render filter sidebar (legacy - giữ lại cho các trang chưa chuyển)
function renderFilterSidebar() {
    var sidebar = document.getElementById('filterSidebar');
    if (!sidebar) return;

    // Lấy danh sách sản phẩm hiện tại (theo danh mục đã chọn)
    var category = document.getElementById('filterCategory').value;
    var products = category !== 'tat-ca' ? getProductsByCategory(category) : getAllProducts();

    // Lấy thương hiệu
    var brands = getBrandsFromProducts(products);
    var brandKeys = Object.keys(brands).sort();

    // Render brand list
    var brandHtml = '';
    brandKeys.forEach(function(b) {
        var checked = filterState.brands.indexOf(b) !== -1 ? 'checked' : '';
        brandHtml += '<label class="brand-item">' +
            '<input type="checkbox" value="' + b + '" ' + checked + ' onchange="toggleBrand(this)">' +
            '<span class="brand-name">' + b + '</span>' +
            '<span class="brand-count">(' + brands[b] + ')</span>' +
            '</label>';
    });
    var brandBody = document.getElementById('brandList');
    if (brandBody) brandBody.innerHTML = brandHtml;

    // Cập nhật giá trị range
    var priceRange = document.getElementById('priceRange');
    var priceVal = document.getElementById('priceValue');
    if (priceRange && priceVal) {
        priceRange.max = 20000000;
        priceRange.value = filterState.priceMax;
        priceVal.textContent = (filterState.priceMax).toLocaleString('vi-VN') + 'đ';
    }
}

// Toggle brand filter
function toggleBrand(cb) {
    var val = cb.value;
    var idx = filterState.brands.indexOf(val);
    if (cb.checked && idx === -1) {
        filterState.brands.push(val);
    } else if (!cb.checked && idx !== -1) {
        filterState.brands.splice(idx, 1);
    }
    filterAndRender();
}

// Price range change
function onPriceChange(val) {
    filterState.priceMax = parseInt(val);
    var priceVal = document.getElementById('priceValue');
    if (priceVal) priceVal.textContent = (filterState.priceMax).toLocaleString('vi-VN') + 'đ';
    filterAndRender();
}

// Reset all filters
function resetFilters() {
    filterState.brands = [];
    filterState.priceMax = 20000000;
    filterState.props = {};
    var priceRange = document.getElementById('priceRange');
    if (priceRange) priceRange.value = 20000000;
    var priceVal = document.getElementById('priceValue');
    if (priceVal) priceVal.textContent = '20.000.000đ';
    // Uncheck all checkboxes
    var checks = document.querySelectorAll('.brand-item input[type="checkbox"]');
    checks.forEach(function(cb) { cb.checked = false; });
    filterAndRender();
}

// Toggle filter group
function toggleFilterGroup(header) {
    var body = header.nextElementSibling;
    var toggle = header.querySelector('.fg-toggle');
    if (body) {
        body.classList.toggle('collapsed');
        if (toggle) toggle.classList.toggle('open');
    }
}

// ===== SORT OVERLAY =====

// Mở / đóng sort overlay
function toggleSortOverlay() {
    var overlay = document.getElementById('sortOverlay');
    if (overlay) {
        overlay.classList.toggle('show');
    }
}

// Đóng sort overlay
function closeSortOverlay() {
    var overlay = document.getElementById('sortOverlay');
    if (overlay) overlay.classList.remove('show');
}

// Đặt sort value
function setSort(value) {
    if (value === currentSort) {
        closeSortOverlay();
        return;
    }
    currentSort = value;
    
    // Cập nhật text trên nút
    var sortCurrent = document.getElementById('sortCurrent');
    if (sortCurrent) sortCurrent.textContent = sortLabels[value] || 'Bán chạy nhất';
    
    // Cập nhật active class trong overlay
    var options = document.querySelectorAll('#sortOptions .sort-option');
    options.forEach(function(opt) {
        opt.classList.toggle('active', opt.getAttribute('data-sort') === value);
    });
    
    closeSortOverlay();
    filterAndRender();
}

// Render filter tags
function renderFilterTags() {
    var container = document.getElementById('filterTags');
    if (!container) return;
    
    if (filterState.brands.length === 0 && filterState.priceMax >= 20000000) {
        container.innerHTML = '';
        return;
    }
    
    var html = '';
    
    // Thương hiệu
    filterState.brands.forEach(function(b, idx) {
        html += '<span class="filter-tag" data-tag-type="brand" data-tag-index="' + idx + '">' + b + ' <span class="tag-remove" data-tag-type="brand" data-tag-value="' + b + '">&times;</span></span>';
    });
    
    // Giá
    if (filterState.priceMax < 20000000) {
        html += '<span class="filter-tag" data-tag-type="price">Dưới ' + (filterState.priceMax).toLocaleString('vi-VN') + 'đ <span class="tag-remove" data-tag-type="price">&times;</span></span>';
    }
    
    container.innerHTML = html;
}

// Sự kiện - chờ dữ liệu từ API backend
function khoiTaoBestSellers() {
    initCategoryFilter();
    applyUrlParams();
    filterAndRender();
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof onProductsReady === 'function') {
        onProductsReady(khoiTaoBestSellers);
    } else {
        khoiTaoBestSellers();
    }

    document.getElementById('filterCategory').addEventListener('change', function() {
        filterAndRender();
    });

    // SORT OVERLAY EVENTS
    var sortBtn = document.getElementById('sortBtn');
    var sortCloseBtn = document.getElementById('sortCloseBtn');
    var sortOverlay = document.getElementById('sortOverlay');
    
    if (sortBtn) {
        sortBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSortOverlay();
        });
    }
    
    if (sortCloseBtn) {
        sortCloseBtn.addEventListener('click', closeSortOverlay);
    }
    
    // Click trên sort option
    var sortOptions = document.querySelectorAll('#sortOptions .sort-option');
    sortOptions.forEach(function(opt) {
        opt.addEventListener('click', function() {
            setSort(this.getAttribute('data-sort'));
        });
    });
    
    // Click bên ngoài overlay để đóng
    if (sortOverlay) {
        sortOverlay.addEventListener('click', function(e) {
            if (e.target === sortOverlay) closeSortOverlay();
        });
    }

    // BRAND OVERLAY EVENTS
    var brandBtn = document.getElementById('brandBtn');
    var brandCloseBtn = document.getElementById('brandCloseBtn');
    var brandOverlay = document.getElementById('brandOverlay');
    
    if (brandBtn) {
        brandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBrandOverlay();
        });
    }
    
    if (brandCloseBtn) {
        brandCloseBtn.addEventListener('click', closeBrandOverlay);
    }
    
    // Click bên ngoài brand overlay để đóng
    if (brandOverlay) {
        brandOverlay.addEventListener('click', function(e) {
            if (e.target === brandOverlay) closeBrandOverlay();
        });
    }
    
    // Event delegation cho filter tags remove (dynamic content)
    var filterTagsContainer = document.getElementById('filterTags');
    if (filterTagsContainer) {
        filterTagsContainer.addEventListener('click', function(e) {
            var target = e.target;
            if (target.classList.contains('tag-remove')) {
                var type = target.getAttribute('data-tag-type');
                if (type === 'brand') {
                    var value = target.getAttribute('data-tag-value');
                    // Uncheck checkbox
                    var checks = document.querySelectorAll('.brand-option input[type="checkbox"]');
                    checks.forEach(function(cb) {
                        if (cb.value === value) cb.checked = false;
                    });
                    var idx = filterState.brands.indexOf(value);
                    if (idx !== -1) filterState.brands.splice(idx, 1);
                    filterAndRender();
                } else if (type === 'price') {
                    filterState.priceMax = 20000000;
                    var priceRange = document.getElementById('priceRange');
                    var priceVal = document.getElementById('priceValue');
                    if (priceRange) priceRange.value = 20000000;
                    if (priceVal) priceVal.textContent = '20.000.000đ';
                    filterAndRender();
                }
            }
        });
    }
});
