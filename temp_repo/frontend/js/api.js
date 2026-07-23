/* ============================================
   PCZONE - API CLIENT
   Kết nối frontend với backend ASP.NET Core
   Base URL: https://localhost:5000 (có thể thay đổi)
   ============================================ */

const API_BASE_URL = 'https://two-cnpm.onrender.com';

// ===== HÀM GỌI API CƠ BẢN =====

async function apiGet(url) {
    const response = await fetch(API_BASE_URL + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Lỗi kết nối' }));
        throw new Error(error.message || 'Lỗi kết nối');
    }
    return await response.json();
}

async function apiPost(url, data) {
    const response = await fetch(API_BASE_URL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Lỗi kết nối' }));
        throw new Error(error.message || 'Lỗi kết nối');
    }
    return await response.json();
}

async function apiPut(url, data) {
    const response = await fetch(API_BASE_URL + url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Lỗi kết nối' }));
        throw new Error(error.message || 'Lỗi kết nối');
    }
    return await response.json();
}

async function apiDelete(url) {
    const response = await fetch(API_BASE_URL + url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Lỗi kết nối' }));
        throw new Error(error.message || 'Lỗi kết nối');
    }
    return await response.json();
}

// ===== AUTH =====

function getAuthHeader() {
    const token = localStorage.getItem('pczone_token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function saveToken(token) {
    localStorage.setItem('pczone_token', token);
}

function clearToken() {
    localStorage.removeItem('pczone_token');
}

function isLoggedIn() {
    return !!localStorage.getItem('pczone_token');
}

// ===== API SẢN PHẨM =====

async function apiGetAllProducts() {
    return await apiGet('/api/SanPham');
}

async function apiGetProductById(id) {
    return await apiGet('/api/SanPham/' + id);
}

async function apiCreateProduct(data) {
    return await apiPost('/api/SanPham', data);
}

async function apiUpdateProduct(id, data) {
    return await apiPut('/api/SanPham/' + id, data);
}

async function apiDeleteProduct(id) {
    return await apiDelete('/api/SanPham/' + id);
}

// ===== API DANH MỤC =====

async function apiGetAllCategories() {
    return await apiGet('/api/DanhMuc');
}

async function apiGetCategoryById(id) {
    return await apiGet('/api/DanhMuc/' + id);
}

async function apiCreateCategory(data) {
    return await apiPost('/api/DanhMuc', data);
}

async function apiUpdateCategory(id, data) {
    return await apiPut('/api/DanhMuc/' + id, data);
}

async function apiDeleteCategory(id) {
    return await apiDelete('/api/DanhMuc/' + id);
}

// ===== API GIỎ HÀNG =====

async function apiGetCart(userId) {
    return await apiGet('/api/GioHang/khach-hang/' + userId);
}

async function apiAddToCart(data) {
    return await apiPost('/api/GioHang', data);
}

async function apiUpdateCartItem(id, data) {
    return await apiPut('/api/GioHang/' + id, data);
}

async function apiRemoveCartItem(id) {
    return await apiDelete('/api/GioHang/' + id);
}

// ===== API ĐƠN HÀNG =====

async function apiGetAllOrders() {
    return await apiGet('/api/DonHang');
}

async function apiGetOrderById(id) {
    return await apiGet('/api/DonHang/' + id);
}

async function apiGetOrdersByCustomer(khachHangId) {
    return await apiGet('/api/DonHang/khach-hang/' + khachHangId);
}

async function apiCreateOrder(data) {
    return await apiPost('/api/DonHang', data);
}

async function apiUpdateOrderStatus(id, data) {
    return await apiPut('/api/DonHang/' + id + '/trang-thai', data);
}

async function apiCancelOrder(id) {
    return await apiPut('/api/DonHang/' + id + '/huy', {});
}

// ===== API ĐÁNH GIÁ =====

async function apiGetReviewsByProduct(productId) {
    return await apiGet('/api/DanhGia/san-pham/' + productId);
}

async function apiCreateReview(data) {
    return await apiPost('/api/DanhGia', data);
}

async function apiUpdateReview(id, data) {
    return await apiPut('/api/DanhGia/' + id, data);
}

async function apiDeleteReview(id) {
    return await apiDelete('/api/DanhGia/' + id);
}

// ===== API COUPON =====

async function apiGetAllCoupons() {
    return await apiGet('/api/Coupon');
}

async function apiCreateCoupon(data) {
    return await apiPost('/api/Coupon', data);
}

async function apiUpdateCoupon(id, data) {
    return await apiPut('/api/Coupon/' + id, data);
}

async function apiDeleteCoupon(id) {
    return await apiDelete('/api/Coupon/' + id);
}

// ===== API KHÁCH HÀNG =====

async function apiGetAllCustomers() {
    return await apiGet('/api/KhachHang');
}

async function apiGetCustomerById(id) {
    return await apiGet('/api/KhachHang/' + id);
}

async function apiRegister(data) {
    return await apiPost('/api/KhachHang/dang-ky', data);
}

async function apiUpdateCustomer(id, data) {
    return await apiPut('/api/KhachHang/' + id, data);
}

async function apiDeleteCustomer(id) {
    return await apiDelete('/api/KhachHang/' + id);
}

// ===== API ĐĂNG NHẬP =====

async function apiLogin(email, password) {
    const result = await apiPost('/api/DangNhap', { email, matKhau: password });
    if (result.token) {
        saveToken(result.token);
    }
    return result;
}

function apiLogout() {
    clearToken();
    localStorage.removeItem('pczone_user');
}

// ===== API AI =====

async function apiAIChat(message) {
    return await apiPost('/api/AI/chat', { message });
}

async function apiAIBuildPC(yeuCau) {
    return await apiPost('/api/AI/tu-van-build', { message: yeuCau });
}

// ===== API DASHBOARD =====

async function apiGetDashboard() {
    return await apiGet('/api/Dashboard');
}
