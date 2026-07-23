// ============================================
// SO-SANH.JS — So sánh sản phẩm (tối đa 3 sản phẩm cùng category)
// Dữ liệu lấy từ ALL_PRODUCTS (data-products.js)
// ============================================

(function() {
try {

// Danh mục hỗ trợ so sánh
const SS_CATEGORIES = [
    { key: 'CPU', label: 'CPU', icon: '🔲' },
    { key: 'GPU', label: 'GPU', icon: '🎮' },
    { key: 'RAM', label: 'RAM', icon: '💾' },
    { key: 'Mainboard', label: 'Mainboard', icon: '🖥️' },
    { key: 'Storage', label: 'Storage', icon: '💿' },
    { key: 'Cooler', label: 'Tản nhiệt', icon: '❄️' },
    { key: 'Case', label: 'Case', icon: '🗄️' },
    { key: 'PSU', label: 'PSU', icon: '🔌' },
    { key: 'Monitor', label: 'Màn hình', icon: '🖥️' },
    { key: 'Peripherals', label: 'Phụ kiện', icon: '⌨️' },
    { key: 'Laptop', label: 'Laptop', icon: '💻' }
];

// Số lượng sản phẩm tối đa có thể so sánh
const MAX_COMPARE = 3;

// State
let ssDanhMucHienTai = 'CPU';
let ssSanPhamDaChon = [null, null, null];
let ssFilteredTimeout = null;

// ===== FORMAT GIÁ =====
function formatGia(vnd) {
    return Number(vnd).toLocaleString("vi-VN") + "đ";
}

// ===== KHỞI TẠO =====
function ssInit() {
    // Check if container elements exist
    if (!document.getElementById('ssCategoryBar')) return;
    renderCategoryBar();
    renderSearchBoxes();
    renderCompareResult();
}

// ===== LẤY PRODUCTS THEO CATEGORY (dùng ALL_PRODUCTS global) =====
function getProductsByCat(cat) {
    var products = typeof getAllProducts === 'function' ? getAllProducts() : [];
    if (products.length > 0) {
        return products.filter(function(sp) { return sp.danhMuc === cat; });
    }
    return [];
}

// ===== RENDER DANH MỤC =====
function renderCategoryBar() {
    var bar = document.getElementById('ssCategoryBar');
    if (!bar) return;
    bar.innerHTML = '';
    var dem = 0;

    SS_CATEGORIES.forEach(function(cat) {
        var products = getProductsByCat(cat.key);
        if (products.length === 0) return;
        dem++;

        var btn = document.createElement('button');
        btn.className = 'ss-cat-btn' + (cat.key === ssDanhMucHienTai ? ' active' : '');
        btn.textContent = cat.icon + ' ' + cat.label;
        btn.addEventListener('click', function() {
            ssDanhMucHienTai = cat.key;
            ssSanPhamDaChon = [null, null, null];
            renderCategoryBar();
            renderSearchBoxes();
            renderCompareResult();
        });
        bar.appendChild(btn);
    });

    if (dem === 0) {
        bar.innerHTML = '<div style="color:#6B7280;padding:12px;font-weight:600">Không có danh mục sản phẩm</div>';
    }
}

// ===== RENDER Ô TÌM KIẾM =====
function renderSearchBoxes() {
    var row = document.getElementById('ssSearchRow');
    if (!row) return;
    row.innerHTML = '';

    for (var i = 0; i < MAX_COMPARE; i++) {
        var box = document.createElement('div');
        box.className = 'ss-search-box';
        box.style.cssText = 'position:relative';

        var input = document.createElement('input');
        input.className = 'ss-search-input';
        input.type = 'text';
        input.placeholder = '🔍 Tìm sản phẩm #' + (i + 1) + '...';
        input.autocomplete = 'off';
        input.dataset.index = i;
        input.style.cssText = 'width:100%;padding:12px 16px;border:2px solid #000;border-radius:12px;font-family:Nunito,sans-serif;font-size:14px;font-weight:600;outline:none;background:white;box-shadow:4px 4px 0px 0px #000;box-sizing:border-box';

        if (ssSanPhamDaChon[i]) {
            input.value = ssSanPhamDaChon[i].ten;
        }

        var dropdown = document.createElement('div');
        dropdown.className = 'ss-autocomplete';
        dropdown.id = 'ssAc' + i;
        dropdown.style.cssText = 'display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:white;border:2px solid #000;border-radius:12px;box-shadow:4px 4px 0px 0px #000;z-index:100;max-height:280px;overflow-y:auto';

        // Input event
        input.addEventListener('input', function(e) {
            var idx = parseInt(e.target.dataset.index);
            var kw = e.target.value.trim();

            if (!kw) {
                ssSanPhamDaChon[idx] = null;
                renderCompareResult();
                hideAutocomplete(idx);
                return;
            }

            showAutocomplete(idx, kw);
        });

        // Focus event
        input.addEventListener('focus', function(e) {
            var idx = parseInt(e.target.dataset.index);
            if (e.target.value.trim()) {
                showAutocomplete(idx, e.target.value.trim());
            }
        });

        // Click outside to close
        document.addEventListener('click', function(e) {
            for (var j = 0; j < MAX_COMPARE; j++) {
                var dd = document.getElementById('ssAc' + j);
                var inp = document.querySelector('.ss-search-input[data-index="' + j + '"]');
                if (dd && inp && !dd.contains(e.target) && e.target !== inp) {
                    dd.style.display = 'none';
                }
            }
        });

        box.appendChild(input);
        box.appendChild(dropdown);
        row.appendChild(box);
    }
}

// ===== HIỂN THỊ AUTOCOMPLETE =====
function showAutocomplete(idx, keyword) {
    if (ssFilteredTimeout) {
        clearTimeout(ssFilteredTimeout);
    }

    ssFilteredTimeout = setTimeout(function() {
        var products = getProductsByCat(ssDanhMucHienTai);
        var kw = keyword.toLowerCase().trim();
        var results = [];

        if (kw) {
            results = products.filter(function(sp) {
                return sp.ten.toLowerCase().indexOf(kw) !== -1 ||
                       sp.hang.toLowerCase().indexOf(kw) !== -1;
            });
        } else {
            results = products.slice(0, 10);
        }

        // Loại bỏ sản phẩm đã chọn ở ô khác
        results = results.filter(function(sp) {
            for (var j = 0; j < MAX_COMPARE; j++) {
                if (j !== idx && ssSanPhamDaChon[j] && ssSanPhamDaChon[j].id === sp.id) {
                    return false;
                }
            }
            return true;
        });

        var dropdown = document.getElementById('ssAc' + idx);
        if (!dropdown) return;
        dropdown.innerHTML = '';

        if (results.length === 0) {
            dropdown.innerHTML = '<div class="ss-ac-item" style="color:#9CA3AF;font-size:12px;padding:10px 14px;text-align:center">Không tìm thấy sản phẩm</div>';
        } else {
            results.forEach(function(sp) {
                var item = document.createElement('div');
                item.className = 'ss-ac-item';
                item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:0.15s;border-bottom:1px solid #F1F5F9';
                item.innerHTML =
                    '<img src="' + sp.img + '" alt="' + sp.ten + '" style="width:40px;height:40px;object-fit:contain;border-radius:4px;background:#F8FAFC;flex-shrink:0" onerror="this.src=\'https://via.placeholder.com/40\'">' +
                    '<div class="info" style="flex:1;min-width:0">' +
                        '<div class="name" style="font-size:13px;font-weight:700;color:#1c1c2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + sp.ten + '</div>' +
                        '<div class="price" style="font-size:12px;font-weight:700;color:#0EA5E9">' + formatGia(sp.gia) + '</div>' +
                        '<div class="rating" style="font-size:11px;color:#6B7280">⭐ ' + sp.rating + ' (' + sp.luotMua + ' đã mua)</div>' +
                    '</div>';

                item.addEventListener('click', function() {
                    ssSanPhamDaChon[idx] = sp;
                    var input = document.querySelector('.ss-search-input[data-index="' + idx + '"]');
                    if (input) input.value = sp.ten;
                    hideAutocomplete(idx);
                    renderCompareResult();
                });

                dropdown.appendChild(item);
            });
        }

        dropdown.style.display = 'block';
    }, 200);
}

// ===== ẨN AUTOCOMPLETE =====
function hideAutocomplete(idx) {
    var dropdown = document.getElementById('ssAc' + idx);
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

// ===== XÓA SẢN PHẨM =====
function ssRemoveProduct(idx) {
    ssSanPhamDaChon[idx] = null;
    var input = document.querySelector('.ss-search-input[data-index="' + idx + '"]');
    if (input) {
        input.value = '';
        input.focus();
    }
    renderCompareResult();
}

// ===== RENDER KẾT QUẢ SO SÁNH =====
function renderCompareResult() {
    var container = document.getElementById('ssCompareResult');
    if (!container) return;
    var selected = ssSanPhamDaChon.filter(function(sp) { return sp !== null; });

    if (selected.length === 0) {
        container.innerHTML =
            '<div class="ss-no-products" style="text-align:center;padding:80px 24px;background:white;border:2px solid #000;border-radius:12px;box-shadow:4px 4px 0px 0px #000">' +
                '<span style="font-size:64px;display:block;margin-bottom:16px">⚖️</span>' +
                '<h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#1c1c2e">Chọn sản phẩm để so sánh</h3>' +
                '<p style="color:#6B7280;font-size:14px">Nhập tên sản phẩm vào ô tìm kiếm bên trên. Tối đa 3 sản phẩm cùng danh mục.</p>' +
            '</div>';
        return;
    }

    var html = '<div class="ss-compare-grid" style="display:grid;grid-template-columns:200px 1fr 1fr 1fr;border:2px solid #000;border-radius:12px;overflow:hidden;box-shadow:4px 4px 0px 0px #000;background:white">';

    // Row 1: Product headers
    html += '<div style="background:#1E293B;color:white;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;padding:14px 16px;border-bottom:2px solid #000;border-right:2px solid #000">Sản phẩm</div>';

    var maxPrice = -1;
    var maxPriceIdx = -1;
    var maxRating = -1;
    var maxRatingIdx = -1;

    for (var i = 0; i < MAX_COMPARE; i++) {
        var sp = ssSanPhamDaChon[i];
        if (sp) {
            // Track best price (lowest is better for price)
            if (maxPriceIdx === -1 || sp.gia < maxPrice) {
                maxPrice = sp.gia;
                maxPriceIdx = i;
            }
            // Track best rating
            var rat = parseFloat(sp.rating);
            if (rat > maxRating) {
                maxRating = rat;
                maxRatingIdx = i;
            }
        }
    }

    for (var a = 0; a < MAX_COMPARE; a++) {
        var sp2 = ssSanPhamDaChon[a];
        if (sp2) {
            var badgeHtml = sp2.badge ? '<div style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:700;background:#FEF3C7;color:#92400E;margin-top:6px">' + sp2.badge + '</div>' : '';
            var giaGocHtml = sp2.giaGoc > sp2.gia ? '<div style="font-size:13px;color:#6B7280;text-decoration:line-through">' + (Number(sp2.giaGoc).toLocaleString('vi-VN') + 'đ') + '</div>' : '';
            var phanTramGiam = sp2.getPhanTramGiam ? sp2.getPhanTramGiam() : '';
            var giamGiaHtml = phanTramGiam ? '<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:700;background:#FEF3C7;color:#92400E;margin-top:6px">-' + phanTramGiam + '</span>' : '';

            html += '<div class="ss-product-header" style="text-align:center;padding:20px 16px;border-bottom:2px solid #000;border-right:1px solid #E5E7EB;background:white">' +
                '<div style="width:120px;height:120px;margin:0 auto 10px;background:#F8FAFC;border-radius:8px;border:2px solid #E5E7EB;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
                    '<img src="' + sp2.img + '" alt="' + sp2.ten + '" style="max-width:100%;max-height:100%;object-fit:contain" onerror="this.src=\'https://via.placeholder.com/120\'">' +
                '</div>' +
                '<div style="font-size:14px;font-weight:800;color:#1c1c2e;margin-bottom:4px">' + sp2.ten + '</div>' +
                '<div style="font-size:18px;font-weight:900;color:#0EA5E9">' + sp2.hienThiGia() + '</div>' +
                giaGocHtml +
                giamGiaHtml +
                badgeHtml +
                '<button onclick="window.ssRemoveProduct(' + a + ')" style="margin-top:10px;padding:6px 14px;border:2px solid #EF4444;border-radius:6px;background:white;color:#EF4444;font-size:12px;font-weight:700;cursor:pointer;font-family:Nunito,sans-serif">✕ Bỏ chọn</button>' +
            '</div>';
        } else {
            html += '<div style="text-align:center;padding:20px 16px;border-bottom:2px solid #000;border-right:1px solid #E5E7EB;background:white;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#6B7280">' +
                '<span style="font-size:48px;margin-bottom:8px;opacity:0.5">❓</span>' +
                '<span style="font-size:13px;font-weight:600">Chưa chọn</span>' +
            '</div>';
        }
    }

    // ===== SECTION ROWS =====
    var rows = [];

    // Thông tin cơ bản
    rows.push({ section: '📋 Thông tin cơ bản', isSection: true });
    rows.push({ label: 'Hãng', fn: function(sp) { return sp.hang || '—'; } });
    rows.push({ label: 'Danh mục', fn: function(sp) { return sp.danhMuc || '—'; } });
    rows.push({ label: 'Nhãn', fn: function(sp) { return sp.badge || '—'; } });

    // Thông số kỹ thuật
    rows.push({ section: '⚙️ Thông số kỹ thuật', isSection: true });
    rows.push({ label: 'Specs', fn: function(sp) {
        if (!sp.specs) return '—';
        var parts = sp.specs.split('|');
        var lis = parts.map(function(s) { return '• ' + s.trim(); }).join('<br>');
        return lis;
    }});
    rows.push({ label: 'Form Factor', fn: function(sp) { return sp.formFactor || '—'; } });
    rows.push({ label: 'Mô tả', fn: function(sp) { return sp.moTa || '—'; } });

    // Giá & Khuyến mãi
    rows.push({ section: '💰 Giá & Khuyến mãi', isSection: true });
    rows.push({ label: 'Giá hiện tại', fn: function(sp) {
        return '<span style="font-size:16px;font-weight:900;color:#0EA5E9">' + sp.hienThiGia() + '</span>';
    }, highlight: 'min' });
    rows.push({ label: 'Giá gốc', fn: function(sp) {
        return sp.giaGoc > sp.gia ? (Number(sp.giaGoc).toLocaleString('vi-VN') + 'đ') : '—';
    }});
    rows.push({ label: 'Giảm giá', fn: function(sp) {
        var pct = sp.getPhanTramGiam ? sp.getPhanTramGiam() : '';
        return pct ? '-' + pct : '—';
    }, highlight: 'max' });

    // Đánh giá
    rows.push({ section: '⭐ Đánh giá', isSection: true });
    rows.push({ label: 'Điểm đánh giá', fn: function(sp) {
        var stars = '★'.repeat(Math.round(parseFloat(sp.rating)));
        return '<span style="color:#F59E0B;font-size:14px;letter-spacing:1px">' + stars + '</span> <span style="font-weight:700;color:#1c1c2e">' + sp.rating + '/5</span>';
    }, highlight: 'max' });
    rows.push({ label: 'Lượt mua', fn: function(sp) {
        return sp.luotMua + ' đã mua';
    }, highlight: 'max' });

    // Đánh giá chi tiết
    rows.push({ section: '📝 Đánh giá chi tiết', isSection: true });

    // Render all rows
    rows.forEach(function(row) {
        if (row.isSection) {
            html += '<div style="grid-column:1/-1;display:grid;grid-template-columns:200px 1fr 1fr 1fr">' +
                '<div style="background:#1E293B;color:white;font-size:13px;font-weight:800;padding:14px 16px;border-bottom:2px solid #000;border-right:2px solid #000">' + row.section + '</div>' +
                '<div style="background:#F1F5F9;border-bottom:2px solid #000;grid-column:2/-1"></div>' +
            '</div>';
            return;
        }

        // Collect values for winner
        var vals = [];
        for (var n = 0; n < MAX_COMPARE; n++) {
            var spn = ssSanPhamDaChon[n];
            vals.push(spn ? row.fn(spn) : '—');
        }

        // Determine winner
        var winnerIdx = -1;
        if (row.highlight) {
            var nums = [];
            for (var m = 0; m < MAX_COMPARE; m++) {
                if (ssSanPhamDaChon[m]) {
                    var rawText = vals[m];
                    var numVal = parseFloat(String(rawText).replace(/[^0-9.]/g, ''));
                    if (!isNaN(numVal) && numVal > 0) {
                        nums.push({ idx: m, val: numVal });
                    }
                }
            }
            if (nums.length >= 2) {
                nums.sort(function(a, b) { 
                    return row.highlight === 'min' ? a.val - b.val : b.val - a.val; 
                });
                winnerIdx = nums[0].idx;
            }
        }

        html += '<div style="background:#F8FAFC;padding:14px 16px;font-size:12px;font-weight:800;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #E5E7EB;border-right:2px solid #000;display:flex;align-items:center">' + row.label + '</div>';

        for (var p = 0; p < MAX_COMPARE; p++) {
            var win = (p === winnerIdx);
            var bgColor = win ? 'background:#ECFDF5' : 'background:white';
            html += '<div style="' + bgColor + ';padding:14px 16px;font-size:14px;font-weight:600;color:#1c1c2e;border-bottom:1px solid #E5E7EB;border-right:1px solid #E5E7EB;display:flex;align-items:center;gap:8px">' +
                '<span>' + vals[p] + '</span>' +
                (win ? ' <span style="display:inline-block;background:#10B981;color:white;font-size:10px;font-weight:700;padding:1px 8px;border-radius:10px">🏆 Best</span>' : '') +
            '</div>';
        }
    });

    // Reviews section
    html += '<div style="background:#F8FAFC;padding:14px 16px;font-size:12px;font-weight:800;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #E5E7EB;border-right:2px solid #000;display:flex;align-items:flex-start;padding-top:16px">Khách hàng đánh giá</div>';

    for (var j = 0; j < MAX_COMPARE; j++) {
        var spj = ssSanPhamDaChon[j];
        html += '<div style="padding:14px 16px;font-size:14px;font-weight:600;color:#1c1c2e;border-bottom:1px solid #E5E7EB;border-right:1px solid #E5E7EB;display:flex;flex-direction:column;align-items:flex-start;gap:4px">';
        if (spj && spj.danhGia && spj.danhGia.length > 0) {
            var maxR = Math.min(2, spj.danhGia.length);
            for (var r = 0; r < maxR; r++) {
                var rv = spj.danhGia[r];
                html += '<div style="padding:6px 0;border-bottom:1px solid #F1F5F9;font-size:12px;width:100%">' +
                    '<div><span style="font-weight:700;color:#1c1c2e">' + rv.ten + '</span> <span style="color:#F59E0B;font-size:11px">' + '★'.repeat(rv.sao) + '</span> <span style="color:#6B7280;font-size:11px">' + rv.ngay + '</span></div>' +
                    '<div style="color:#4B5563;font-size:12px;margin-top:2px;line-height:1.3">' + rv.noiDung + '</div>' +
                '</div>';
            }
            if (spj.danhGia.length > 2) {
                html += '<div style="font-size:11px;color:#6B7280;margin-top:4px">+ ' + (spj.danhGia.length - 2) + ' đánh giá khác</div>';
            }
        } else {
            html += '<span style="color:#6B7280;font-size:13px">Chưa có đánh giá</span>';
        }
        html += '</div>';
    }

    html += '</div>'; // end ss-compare-grid
    container.innerHTML = html;
}

// ===== EXPORT hàm xóa sản phẩm cho onclick =====
window.ssRemoveProduct = ssRemoveProduct;

// ===== KHỞI TẠO =====
function init() {
    // Wait for products to be available
    var checkReady = function() {
        var products = typeof getAllProducts === 'function' ? getAllProducts() : [];
        if (products.length > 0 && document.getElementById('ssCategoryBar')) {
            ssInit();
        } else {
            setTimeout(checkReady, 100);
        }
    };
    checkReady();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

} catch(e) {
    console.error('So sánh error:', e);
    document.addEventListener('DOMContentLoaded', function() {
        var container = document.getElementById('ssCompareResult');
        if (container) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#EF4444;font-weight:700">⚠️ Đã xảy ra lỗi: ' + e.message + '</div>';
        }
    });
}
})();