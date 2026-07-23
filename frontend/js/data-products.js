/* ============================================
   PCZONE - DATA SẢN PHẨM TRUNG TÂM
   Dữ liệu được lấy từ BACKEND API qua ProductService
   Frontend KHÔNG chứa dữ liệu sản phẩm hardcode
   Ảnh được serve từ backend tại /media/product/
   ============================================ */

// ===== CLASS SẢN PHẨM CHUẨN (giữ nguyên vì các file khác dùng) =====
class SanPham {
    constructor(id, ten, gia, giaGoc, img, specs, rating, luotMua, danhMuc, hang, badge, moTa, formFactor, diemCpu, diemGpu, danhGia) {
        this.id = id;
        this.ten = ten;
        this.gia = gia;
        this.giaGoc = giaGoc || 0;
        this.img = img || '/media/product/default.svg';
        this.specs = specs || '';
        this.rating = rating || '4.9';
        this.luotMua = luotMua || 0;
        this.danhMuc = danhMuc || 'Khác';
        this.hang = hang || '';
        this.badge = badge || '';
        this.moTa = moTa || '';
        this.formFactor = formFactor || '';
        this.diemCpu = diemCpu || 0;
        this.diemGpu = diemGpu || 0;
        this.phoPhien = this.luotMua;
        this.danhGia = danhGia || [
            { ten: 'Nguyễn Văn A', sao: 5, ngay: '15/06/2026', noiDung: 'Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh chóng. Sẽ ủng hộ shop lần sau.' },
            { ten: 'Trần Thị B', sao: 4, ngay: '10/06/2026', noiDung: 'Hàng chính hãng, giá hợp lý. Đóng gói cẩn thận, ship nhanh.' },
            { ten: 'Lê Văn C', sao: 5, ngay: '05/06/2026', noiDung: 'Mua lần thứ 2 rồi, chất lượng vẫn rất ổn. Sẽ giới thiệu cho bạn bè.' },
        ];
    }

    getGiaKhuyenMai() {
        return this.giaGoc > this.gia ? this.gia : 0;
    }

    getPhanTramGiam() {
        if (this.giaGoc > this.gia) {
            return Math.round((1 - this.gia / this.giaGoc) * 100) + '%';
        }
        return '';
    }

    getLinkChiTiet() {
        // Kiểm tra nếu đã ở trong thư mục pages/ thì không thêm pages/ nữa
        if (window.location.pathname.includes('/pages/')) {
            return 'chi-tiet-sp.html?id=' + this.id;
        }
        return 'pages/chi-tiet-sp.html?id=' + this.id;
    }

    hienThiGia() {
        return this.gia.toLocaleString('vi-VN') + 'đ';
    }

    hienThiGiaGoc() {
        return this.giaGoc ? this.giaGoc.toLocaleString('vi-VN') + 'đ' : '';
    }
}

// ===== HÀM TIỆN ÍCH =====
function formatGia(vnd) {
    return vnd.toLocaleString("vi-VN") + "đ";
}

// ===== BỘ NHỚ ĐỆM DỮ LIỆU =====
// Lưu sản phẩm dạng SanPham instances để các hàm đồng bộ cũ vẫn hoạt động
var cachedProducts = [];
var productsLoaded = false;
var productsLoading = false;
var pendingCallbacks = [];

/**
 * Lấy tất cả sản phẩm (đồng bộ) - từ bộ nhớ đệm
 * Nếu chưa load xong, trả về mảng rỗng
 */
function getAllProducts() {
    return cachedProducts;
}

/**
 * Lấy sản phẩm theo ID (đồng bộ) - từ bộ nhớ đệm
 */
function getProductById(id) {
    return cachedProducts.find(function(sp) { return sp.id === id; }) || null;
}

/**
 * Load sản phẩm từ backend API qua ProductService (bất đồng bộ)
 * Gọi hàm này khi trang load để đổ dữ liệu vào cache
 */
async function loadProductsFromAPI() {
    if (productsLoaded || productsLoading) return;
    productsLoading = true;

    try {
        // Kiểm tra ProductService có tồn tại không
        if (typeof ProductService === 'undefined') {
            console.warn('⚠️ ProductService chưa được load. Đảm bảo thêm <script src="js/product-service.js"> trước data-products.js');
            productsLoading = false;
            return;
        }

        var data = await ProductService.getAllProducts();
        var normalized = ProductService.normalizeProducts(data);

        // Chuyển đổi sang SanPham instances để tương thích với code cũ
        cachedProducts = normalized.map(function(p) {
            return new SanPham(
                p.id, p.ten, p.gia, p.giaGoc,
                ProductService.getImageUrl(p.img),
                p.specs, p.rating, p.luotMua,
                p.danhMuc, p.hang, p.badge,
                p.moTa, p.formFactor, p.diemCpu, p.diemGpu,
                p.danhGia
            );
        });

        productsLoaded = true;
        productsLoading = false;

        console.log('✅ Đã load ' + cachedProducts.length + ' sản phẩm từ backend');

        // Gọi tất cả callbacks đang chờ
        pendingCallbacks.forEach(function(cb) { cb(cachedProducts); });
        pendingCallbacks = [];

        // Dispatch event thông báo sản phẩm đã sẵn sàng
        var event = new CustomEvent('productsLoaded', { detail: cachedProducts });
        document.dispatchEvent(event);

    } catch(e) {
        productsLoading = false;
        console.error('❌ Lỗi tải sản phẩm từ backend:', e.message);

        // Dispatch event lỗi để các trang có thể xử lý (hiển thị thông báo)
        var errorEvent = new CustomEvent('productsError', { detail: { error: e.message } });
        document.dispatchEvent(errorEvent);
    }
}

/**
 * Đăng ký callback được gọi khi sản phẩm đã load xong
 * @param {Function} callback - Hàm nhận danh sách sản phẩm
 */
function onProductsReady(callback) {
    if (productsLoaded) {
        callback(cachedProducts);
    } else {
        pendingCallbacks.push(callback);
    }
}

// ===== CÁC HÀM LỌC/TÌM KIẾM (dùng cache đồng bộ, giữ nguyên interface) =====

function getProductsByCategory(danhMuc) {
    return cachedProducts.filter(function(sp) { return sp.danhMuc === danhMuc; });
}

function getAllCategories() {
    var cats = {};
    cachedProducts.forEach(function(sp) {
        cats[sp.danhMuc] = true;
    });
    return Object.keys(cats).sort();
}

function getBestSellers(limit) {
    var sorted = cachedProducts.slice().sort(function(a, b) { return b.luotMua - a.luotMua; });
    return limit ? sorted.slice(0, limit) : sorted;
}

function getFeaturedProducts(limit) {
    var all = cachedProducts.slice();
    var featured = all.filter(function(sp) { return sp.badge && sp.badge.length > 0; });
    var sorted = featured.sort(function(a, b) { return b.luotMua - a.luotMua; });
    return limit ? sorted.slice(0, limit) : sorted;
}

function searchProducts(tuKhoa) {
    var kw = tuKhoa.toLowerCase().trim();
    if (!kw) return [];
    return cachedProducts.filter(function(sp) {
        return sp.ten.toLowerCase().indexOf(kw) !== -1 ||
               sp.danhMuc.toLowerCase().indexOf(kw) !== -1 ||
               sp.hang.toLowerCase().indexOf(kw) !== -1;
    });
}

function filterProducts(filters) {
    var result = cachedProducts.slice();
    if (filters.danhMuc) result = result.filter(function(sp) { return sp.danhMuc === filters.danhMuc; });
    if (filters.hang) {
        if (Array.isArray(filters.hang)) {
            result = result.filter(function(sp) { return filters.hang.indexOf(sp.hang) !== -1; });
        } else {
            result = result.filter(function(sp) { return sp.hang === filters.hang; });
        }
    }
    if (filters.giaMin) result = result.filter(function(sp) { return sp.gia >= filters.giaMin; });
    if (filters.giaMax) result = result.filter(function(sp) { return sp.gia <= filters.giaMax; });
    if (filters.tuKhoa) result = result.filter(function(sp) {
        var kw = filters.tuKhoa.toLowerCase();
        return sp.ten.toLowerCase().indexOf(kw) !== -1;
    });
    if (filters.sort === 'gia-tang') result.sort(function(a, b) { return a.gia - b.gia; });
    else if (filters.sort === 'gia-giam') result.sort(function(a, b) { return b.gia - a.gia; });
    else result.sort(function(a, b) { return b.luotMua - a.luotMua; });
    return result;
}

// ===== HÀM RENDER SẢN PHẨM (giữ nguyên) =====

function renderProductCard(sp) {
    var badgeHtml = sp.badge ? '<div class="nhan-noi-bat"><span class="cham-tron-nhan">✦</span> ' + sp.badge + '</div>' : '';
    var giaGocHtml = sp.giaGoc > sp.gia ? '<p class="gia-goc-dung">' + sp.hienThiGiaGoc() + '</p>' : '';
    var phanTramGiam = sp.getPhanTramGiam();
    var giamGiaHtml = phanTramGiam ? '<span class="phan-tram-giam">-' + phanTramGiam + '</span>' : '';

    var giaHtml = '';
    if (sp.status === 'Hết hàng') {
        giaHtml = '<span class="gia-khuyen-mai-dung" style="color:#dc2626;font-size:13px">Hết hàng</span>';
    } else {
        giaHtml = '<span class="gia-khuyen-mai-dung">' + sp.hienThiGia() + '</span>' + giamGiaHtml;
    }

    return '<div class="o-san-pham-dung" data-id="' + sp.id + '" onclick="window.location.href=\'' + sp.getLinkChiTiet() + '\'" style="cursor:pointer">' +
        badgeHtml +
        '<div class="vung-anh-dung"><img src="' + sp.img + '" alt="' + sp.ten + '" class="anh-san-pham-dung"></div>' +
        '<div class="vung-chi-tiet-dung">' +
            '<h4 class="ten-san-pham-dung">' + sp.ten + '</h4>' +
            giaGocHtml +
            '<div class="hang-gia-ban">' +
                giaHtml +
            '</div>' +
            '<div class="thong-tin-phu" style="margin-top:8px">' +
                '<span class="diem-danh-gia">⭐ ' + sp.rating + '</span>' +
                '<span class="luot-mua">(' + sp.luotMua + ')</span>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ===== HÀM CHUYỂN ĐỔI CHO BUILD PC =====
const CATEGORY_MAP_BUILD = {
    'CPU': 'cpu',
    'Cooler': 'cooler',
    'Mainboard': 'mainboard',
    'RAM': 'ram',
    'GPU': 'gpu',
    'Storage': 'storage',
    'Case': 'case',
    'PSU': 'psu',
    'Fans': 'fans',
    'Monitor': 'monitor',
    'Peripherals': 'peripherals'
};

function getBuildPCData() {
    var data = {};
    for (var key in CATEGORY_MAP_BUILD) {
        data[CATEGORY_MAP_BUILD[key]] = [];
    }
    cachedProducts.forEach(function(sp) {
        var buildKey = CATEGORY_MAP_BUILD[sp.danhMuc];
        if (buildKey && data[buildKey]) {
            data[buildKey].push({
                id: sp.id,
                ten: sp.ten,
                hang: sp.hang,
                formFactor: sp.formFactor,
                moTa: sp.moTa,
                gia: sp.gia,
                phoPhien: sp.luotMua,
                anh: sp.img,
                diemCpu: sp.diemCpu || 0,
                diemGpu: sp.diemGpu || 0
            });
        }
    });
    return data;
}

// ============================================================
// DỮ LIỆU DÀNH CHO ADMIN
// ============================================================

function convertToAdminProduct(sp) {
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
    status: sp.status || 'Còn hàng',
    date: new Date().toISOString().slice(0, 10),
  };
}

// Admin fallback: mảng rỗng, admin sẽ load từ API
var DEFAULT_PRODUCTS = [];

// ===== TỰ ĐỘNG KẾT NỐI BACKEND KHI TRANG LOAD =====
(function() {
    // Đợi DOM ready rồi mới load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        loadProductsFromAPI();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            loadProductsFromAPI();
        });
    }
})();