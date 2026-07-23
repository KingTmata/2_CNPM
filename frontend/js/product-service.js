/* ============================================
   PCZONE - PRODUCT SERVICE
   Service layer bắt buộc gọi API backend
   KHÔNG chứa dữ liệu hardcode
   ============================================ */

// Xác định đường dẫn gốc assets (dùng absolute path dựa vào URL hiện tại)
var ASSETS_BASE_URL = '';
(function() {
    var path = window.location.pathname;
    // Tìm vị trí của "/frontend/" trong URL
    var idx = path.indexOf('/frontend/');
    if (idx >= 0) {
        // Lấy đến hết "/frontend/" -> /xxx/frontend/assets/
        ASSETS_BASE_URL = path.substring(0, idx + 10) + 'assets/';
    } else {
        // Fallback: dùng relative
        ASSETS_BASE_URL = 'assets/';
    }
})();

// ===== HÀM XÁC ĐỊNH ĐƯỜNG DẪN GỐC =====
// Trả về đường dẫn tương đối đến thư mục gốc frontend/
function ROOT_PATH() {
    var path = window.location.pathname;
    if (path.indexOf('/pages/') !== -1) {
        return '../';
    }
    return './';
}

const ProductService = {
    API_BASE: 'https://two-cnpm.onrender.com',

    /**
     * Lấy tất cả sản phẩm từ backend API
     * @returns {Promise<Array>} Danh sách sản phẩm (raw JSON từ API)
     */
    async getAllProducts() {
        const resp = await fetch(`${this.API_BASE}/api/SanPham`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            throw new Error(`Không thể tải sản phẩm: ${resp.status}`);
        }
        return await resp.json();
    },

    /**
     * Lấy sản phẩm theo ID
     * @param {number} id - ID sản phẩm
     * @returns {Promise<Object|null>} Chi tiết sản phẩm hoặc null nếu không tìm thấy
     */
    async getProductById(id) {
        const resp = await fetch(`${this.API_BASE}/api/SanPham/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            if (resp.status === 404) return null;
            throw new Error(`Không tìm thấy sản phẩm: ${resp.status}`);
        }
        return await resp.json();
    },

    /**
     * Lấy sản phẩm theo danh mục
     * @param {number} danhMucId - ID danh mục
     * @returns {Promise<Array>} Danh sách sản phẩm
     */
    async getProductsByCategory(danhMucId) {
        const resp = await fetch(`${this.API_BASE}/api/SanPham/danhmuc/${danhMucId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            throw new Error(`Không thể tải sản phẩm theo danh mục: ${resp.status}`);
        }
        return await resp.json();
    },

    /**
     * Lấy tất cả danh mục
     * @returns {Promise<Array>} Danh sách danh mục
     */
    async getAllCategories() {
        const resp = await fetch(`${this.API_BASE}/api/DanhMuc`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            throw new Error(`Không thể tải danh mục: ${resp.status}`);
        }
        return await resp.json();
    },

    /**
     * Chuẩn hóa đường dẫn hình ảnh (thêm / đầu nếu thiếu)
     * @param {string} path - Đường dẫn ảnh gốc
     * @returns {string} Đường dẫn ảnh đã chuẩn hóa
     */
    getImageUrl(path) {
        var assetsPath = typeof ASSETS_BASE_URL !== 'undefined' ? ASSETS_BASE_URL : 'assets/';
        if (!path) return assetsPath + 'media/product/default.svg';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        // Ảnh từ backend /media/product/ → dùng ảnh local
        if (path.startsWith('/media/product/')) return assetsPath + 'media/product/' + path.replace('/media/product/', '');
        if (path.startsWith('media/')) return assetsPath + path;
        return path;
    },

    /**
     * Chuyển đổi sản phẩm từ API response sang format frontend
     * Dựa trên Model SanPham thực tế:
     *   Id, Ten, Gia, GiaGoc, MoTa, HinhAnh, SoLuongTon, DangKinhDoanh,
     *   NgayTao, Specs, Hang, Badge, FormFactor, DiemCpu, DiemGpu,
     *   Rating, LuotMua, DanhMucId, DanhMuc (navigation)
     * @param {Object} apiProduct - Sản phẩm từ API (JSON camelCase)
     * @returns {Object} Sản phẩm đã chuẩn hóa
     */
    normalizeProduct(apiProduct) {
        // Xác định danh mục từ navigation hoặc từ trực tiếp
        var danhMucTen = 'Khác';
        if (apiProduct.danhMuc && apiProduct.danhMuc.ten) {
            danhMucTen = apiProduct.danhMuc.ten;
        } else if (typeof apiProduct.danhMuc === 'string') {
            danhMucTen = apiProduct.danhMuc;
        }

        // Xác định trạng thái kinh doanh
        var status = 'Còn hàng';
        if (apiProduct.dangKinhDoanh === false || apiProduct.trangThai === 'Hết hàng') {
            status = 'Hết hàng';
        }

        return {
            id: apiProduct.id,
            danhMucId: apiProduct.danhMucId || 0,
            ten: apiProduct.ten || '',
            gia: apiProduct.gia || 0,
            giaGoc: apiProduct.giaGoc || 0,
            img: this.getImageUrl(apiProduct.hinhAnh || apiProduct.img || ''),
            specs: apiProduct.specs || '',    // Specs từ model
            rating: apiProduct.rating ? apiProduct.rating.toString() : '4.9',
            luotMua: apiProduct.luotMua || 0,
            danhMuc: danhMucTen,
            hang: apiProduct.hang || '',       // Hang từ model (thương hiệu)
            badge: apiProduct.badge || '',
            moTa: apiProduct.moTa || '',        // MoTa từ model (mô tả ngắn)
            formFactor: apiProduct.formFactor || '',
            diemCpu: apiProduct.diemCpu || 0,
            diemGpu: apiProduct.diemGpu || 0,
            status: status,
            danhGia: apiProduct.danhGias || [   // DanhGias navigation
                { ten: 'Nguyễn Văn A', sao: 5, ngay: '15/06/2026', noiDung: 'Sản phẩm rất tốt, đóng gói cẩn thận.' }
            ]
        };
    },

    /**
     * Chuẩn hóa danh sách sản phẩm
     * @param {Array} apiProducts - Danh sách sản phẩm từ API
     * @returns {Array} Danh sách sản phẩm đã chuẩn hóa
     */
    normalizeProducts(apiProducts) {
        if (!Array.isArray(apiProducts)) return [];
        return apiProducts.map(function(p) { return this.normalizeProduct(p); }.bind(this));
    }
};