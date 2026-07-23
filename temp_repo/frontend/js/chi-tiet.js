// ============================================
// CHI-TIET.JS — Trang chi tiết sản phẩm
// Hỗ trợ cả URL cũ (?name=...) và URL mới (?id=...)
// Dùng dữ liệu từ data-products.js (ưu tiên API backend)
// ============================================

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let tenSP, giaSP, giaGocSP, anhSP, thongSo, statusSP, ratingSP, luotMuaSP;

// Hàm render chi tiết sản phẩm
function renderChiTiet(sp) {
    tenSP = sp.ten || 'Không tìm thấy sản phẩm';
    giaSP = sp.gia || 0;
    giaGocSP = sp.giaGoc || 0;
    anhSP = sp.img || 'https://via.placeholder.com/400';
    thongSo = sp.specs || '';
    statusSP = sp.status || 'Còn hàng';
    ratingSP = sp.rating || '4.9';
    luotMuaSP = sp.luotMua || 0;

    // Đổ dữ liệu động
    document.getElementById('detailTitle').innerText = tenSP;
    document.getElementById('detailImg').src = anhSP;
    document.getElementById('detailRating').innerText = ratingSP;
    document.querySelector('.luot-binh-luan').innerText = luotMuaSP + ' lượt mua thành công';

    // --- TẠO 3 THUMBNAIL TỪ ẢNH SẢN PHẨM ---
    var thumbList = document.getElementById('thumbList');
    thumbList.innerHTML = '';
    for (var i = 0; i < 3; i++) {
        var thumb = document.createElement('img');
        thumb.className = 'thumb-item' + (i === 0 ? ' active' : '');
        thumb.src = anhSP;
        thumb.alt = 'Ảnh sản phẩm ' + (i + 1);
        thumb.dataset.src = anhSP;
        thumb.addEventListener('click', function() {
            document.querySelectorAll('.thumb-item').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById('detailImg').src = this.dataset.src;
        });
        thumbList.appendChild(thumb);
    }

    // Hiển thị giá và trạng thái
    var priceEl = document.getElementById('detailPrice');
    var oldPriceEl = document.getElementById('detailOldPrice');
    var discountEl = document.getElementById('detailDiscount');

    if (statusSP === 'Hết hàng') {
        priceEl.innerText = 'Hết hàng';
        priceEl.style.color = '#dc2626';
        priceEl.style.fontSize = '18px';
        oldPriceEl.innerText = '';
        discountEl.style.display = 'none';
    } else {
        priceEl.style.color = '';
        priceEl.style.fontSize = '';
        priceEl.innerText = giaSP.toLocaleString('vi-VN') + 'đ';
        
        if (giaGocSP > giaSP) {
            oldPriceEl.innerText = giaGocSP.toLocaleString('vi-VN') + 'đ';
            var phanTram = Math.round((1 - giaSP / giaGocSP) * 100);
            discountEl.innerText = '-' + phanTram + '%';
            discountEl.style.display = '';
        } else {
            oldPriceEl.innerText = '';
            discountEl.style.display = 'none';
        }
    }

    // Bóc tách chuỗi thông số kỹ thuật
    const listSpecs = thongSo.split('|');
    const specsContainer = document.getElementById('detailSpecs');
    specsContainer.innerHTML = '';

    listSpecs.forEach(item => {
        if (item.trim()) {
            const li = document.createElement('li');
            li.innerHTML = '• ' + item.trim();
            specsContainer.appendChild(li);
        }
    });

    // Load đánh giá
    if (sp.danhGia) {
        renderDanhGia(sp.danhGia);
    } else {
        renderDanhGia(null);
    }

    // Render sản phẩm đề xuất
    renderSuggestions(sp);
}

// Hàm load chi tiết từ ProductService (API backend)
async function loadChiTietFromAPI(id) {
    try {
        if (typeof ProductService !== 'undefined') {
            var p = await ProductService.getProductById(id);
            if (p) {
                var norm = ProductService.normalizeProduct(p);
                var spObj = new SanPham(
                    norm.id, norm.ten, norm.gia, norm.giaGoc,
                    norm.img,
                    norm.specs, norm.rating, norm.luotMua,
                    norm.danhMuc, norm.hang, norm.badge,
                    norm.moTa, norm.formFactor, norm.diemCpu, norm.diemGpu,
                    norm.danhGia
                );
                renderChiTiet(spObj);
                return true;
            }
        }
    } catch(e) {
        console.log('⚠️ Không thể load từ API:', e.message);
    }
    return false;
}

// Hàm khởi tạo trang chi tiết - gọi khi dữ liệu đã sẵn sàng
function initChiTiet() {
    // Nếu có id, ưu tiên load từ ProductService (API backend), fallback về cache
    if (productId) {
        (async function() {
            var loaded = await loadChiTietFromAPI(parseInt(productId));
            if (!loaded) {
                var sp = getProductById(parseInt(productId));
                if (sp) {
                    renderChiTiet(sp);
                } else {
                    renderChiTiet({ ten: 'Không tìm thấy sản phẩm', gia: 0, giaGoc: 0, img: 'https://via.placeholder.com/400', specs: 'Sản phẩm không tồn tại trong hệ thống', status: 'Hết hàng', rating: '0', luotMua: 0, danhGia: null });
                }
            }
        })();
    } else {
        // Fallback: hỗ trợ URL cũ với ?name=&price=&img=&specs=
        renderChiTiet({
            ten: urlParams.get('name') || 'Sản phẩm Máy tính',
            gia: parseInt(urlParams.get('price')?.replace(/[^0-9]/g,'')) || 0,
            giaGoc: 0,
            img: urlParams.get('img') || 'https://via.placeholder.com/400',
            specs: urlParams.get('specs') || 'Đang cập nhật dữ liệu cấu hình chi tiết từ nhà máy sản xuất...',
            status: 'Còn hàng',
            rating: '4.9',
            luotMua: 0,
            danhGia: null
        });
    }

    // Load đánh giá nếu có sản phẩm từ cache
    var spDanhGia = null;
    if (productId) {
        spDanhGia = getProductById(parseInt(productId));
    } else {
        var tenTim = urlParams.get('name');
        if (tenTim) {
            spDanhGia = getAllProducts().find(function(sp) { return sp.ten === tenTim; }) || null;
        }
    }
    if (spDanhGia && spDanhGia.danhGia) {
        renderDanhGia(spDanhGia.danhGia);
    }

}

// Khởi tạo - chờ dữ liệu từ API backend hoặc chạy ngay nếu đã có
if (typeof onProductsReady === 'function') {
    onProductsReady(initChiTiet);
} else {
    initChiTiet();
}

// --- XỬ LÝ SỐ LƯỢNG ---
const inputQty = document.getElementById('inputQty');
document.getElementById('btnGiamQty').addEventListener('click', () => {
    let val = parseInt(inputQty.value) || 1;
    if (val > 1) inputQty.value = val - 1;
});
document.getElementById('btnTangQty').addEventListener('click', () => {
    let val = parseInt(inputQty.value) || 1;
    inputQty.value = val + 1;
});

// --- THÊM VÀO GIỎ HÀNG ---
const btnAddToCart = document.getElementById('btnAddToCart');
const successToast = document.getElementById('successToast');

btnAddToCart.addEventListener('click', () => {
    const quantity = parseInt(inputQty.value) || 1;
    addToCart({
        name: tenSP,
        price: giaSP,
        img: anhSP,
        specs: thongSo,
        quantity: quantity
    });
    successToast.classList.add('show');
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 1800);
});

// --- ĐÁNH GIÁ SẢN PHẨM ---
function renderSao(sao) {
    var full = '';
    for (var i = 0; i < 5; i++) {
        full += (i < sao) ? '★' : '☆';
    }
    return full;
}

function renderDanhGia(danhSach) {
    if (!danhSach || danhSach.length === 0) {
        document.getElementById('reviewDemoContainer').innerHTML = '<p style="font-size:13px;color:#94A3B8;text-align:center">Chưa có đánh giá nào.</p>';
        document.getElementById('soLuongDG').innerText = '0';
        return;
    }

    document.getElementById('soLuongDG').innerText = danhSach.length;

    var dg = danhSach[0];
    var chuCaiDau = dg.ten.charAt(0).toUpperCase();
    var html = '<div class="review-item-demo">' +
        '<div class="review-avatar-demo">' + chuCaiDau + '</div>' +
        '<div class="review-content-demo">' +
            '<div class="review-name-demo">' + dg.ten +
                '<span class="review-stars-demo">' + renderSao(dg.sao) + '</span>' +
                '<span class="review-date-demo">' + dg.ngay + '</span>' +
            '</div>' +
            '<div class="review-text-demo">"' + dg.noiDung + '"</div>' +
        '</div>' +
    '</div>';

    document.getElementById('reviewDemoContainer').innerHTML = html;

    var popupHtml = '';
    danhSach.forEach(function(r) {
        var firstChar = r.ten.charAt(0).toUpperCase();
        popupHtml += '<div class="popup-review-item">' +
            '<div class="review-avatar-demo">' + firstChar + '</div>' +
            '<div class="review-content-demo">' +
                '<div class="review-name-demo">' + r.ten +
                    '<span class="review-stars-demo">' + renderSao(r.sao) + '</span>' +
                    '<span class="review-date-demo">' + r.ngay + '</span>' +
                '</div>' +
                '<div class="review-text-demo">"' + r.noiDung + '"</div>' +
            '</div>' +
        '</div>';
    });
    document.getElementById('popupReviewList').innerHTML = popupHtml;

    var reviewSection = document.getElementById('reviewSection');
    var xemThem = document.getElementById('xemThemDG');
    var popup = document.getElementById('popupDanhGia');
    var popupClose = document.getElementById('popupDGClose');

    function moPopup() { popup.classList.add('show'); }
    function dongPopup() { popup.classList.remove('show'); }

    reviewSection.addEventListener('click', moPopup);
    xemThem.addEventListener('click', function(e) { e.stopPropagation(); moPopup(); });
    popupClose.addEventListener('click', dongPopup);
    popup.addEventListener('click', function(e) { if (e.target === popup) dongPopup(); });
}


// --- SẢN PHẨM ĐỀ XUẤT ---
function renderSuggestions(sp) {
    var suggestionsGrid = document.getElementById('suggestionsGrid');
    if (!suggestionsGrid) return;
    suggestionsGrid.innerHTML = '';

    var sanPhamDeXuat = [];
    if (sp && sp.danhMuc) {
        sanPhamDeXuat = getAllProducts().filter(function(item) {
            return item.danhMuc === sp.danhMuc && item.id !== sp.id;
        }).sort(function(a, b) { return b.luotMua - a.luotMua; }).slice(0, 5);
    }

    if (sanPhamDeXuat.length < 5) {
        var usedIds = {};
        sanPhamDeXuat.forEach(function(s) { usedIds[s.id] = true; });
        if (sp) usedIds[sp.id] = true;

        var themSP = getAllProducts().filter(function(item) {
            return !usedIds[item.id];
        }).sort(function(a, b) { return b.luotMua - a.luotMua; }).slice(0, 5 - sanPhamDeXuat.length);

        sanPhamDeXuat = sanPhamDeXuat.concat(themSP);
    }

    function renderSuggestionCard(sp) {
        var badgeHtml = sp.badge ? '<div class="nhan-noi-bat"><span class="cham-tron-nhan">✦</span> ' + sp.badge + '</div>' : '';
        var ratingHtml = '⭐ ' + sp.rating;
        var muaHtml = '(' + sp.luotMua + ')';
        var link = sp.getLinkChiTiet();
        var stt = sp.status || 'Còn hàng';
        var giaHtml = (stt === 'Hết hàng') ? '<p class="gia-san-pham" style="color:#dc2626">Hết hàng</p>' : '<p class="gia-san-pham">' + sp.hienThiGia() + '</p>';

        return '<a href="' + link + '" class="the-san-pham" style="text-decoration:none;color:inherit">' +
            badgeHtml +
            '<div class="khung-anh-san-pham"><img src="' + sp.img + '" alt="' + sp.ten + '" class="anh-san-pham"></div>' +
            '<div class="chi-tiet-san-pham">' +
                '<h3 class="ten-san-pham">' + sp.ten + '</h3>' +
                giaHtml +
                '<div class="thong-tin-phu">' +
                    '<span class="diem-danh-gia">' + ratingHtml + '</span>' +
                    '<span class="luot-mua">' + muaHtml + '</span>' +
                '</div>' +
            '</div>' +
        '</a>';
    }

    var htmlDeXuat = '';
    sanPhamDeXuat.forEach(function(sp) { htmlDeXuat += renderSuggestionCard(sp); });
    suggestionsGrid.innerHTML = htmlDeXuat;
}

