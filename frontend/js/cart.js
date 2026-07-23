// ============================================
// CART.JS - Logic giỏ hàng dùng chung
// Dùng localStorage để lưu trữ giỏ hàng
// ============================================

const CART_KEY = 'pczone_cart';

// Lấy giỏ hàng từ localStorage
function getCart() {
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.name === product.name);
    
    // Luôn lưu price dạng số (number), giữ nguyên priceDisplay cho hiển thị
    var priceNum = (typeof product.price === 'number') ? product.price : 
                   parseInt(String(product.price).replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
    var displayPrice = (typeof product.price === 'number') ? 
                       product.price.toLocaleString('vi-VN') + 'đ' : product.price;
    
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += (product.quantity || 1);
    } else {
        cart.push({
            name: product.name,
            price: priceNum,
            priceDisplay: displayPrice,
            img: product.img || '../assets/media/product/default.svg',
            specs: product.specs || '',
            quantity: product.quantity || 1
        });
    }
    
    saveCart(cart);
    return true;
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

// Cập nhật số lượng
function updateQuantity(index, quantity) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity = Math.max(1, quantity);
        saveCart(cart);
    }
}

// Tính tổng tiền
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const price = (typeof item.price === 'number') ? item.price : 
                      parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;
        return total + (price * item.quantity);
    }, 0);
}

// Đếm tổng số lượng sản phẩm
function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Cập nhật badge trên navbar
function updateCartBadge() {
    const badge = document.getElementById('cartBadgeNav');
    if (badge) {
        badge.textContent = getCartCount();
    }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
}

// Format tiền VND
function formatVND(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// ===== TRANG GIỎ HÀNG (gio-hang.html) =====
let selectedCheckboxes = {};

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    const btnCheckout = document.getElementById('btnCheckout');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Giỏ hàng trống</h3>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <a href="` + ROOT_PATH() + `main+ds+sp.html" class="btn-shop">Mua sắm ngay</a>
            </div>
        `;
        if (btnCheckout) btnCheckout.disabled = true;
        document.getElementById('subtotalPrice').textContent = '0đ';
        document.getElementById('totalPrice').textContent = '0đ';
        return;
    }
    let html = '';
    let anyChecked = false;
    cart.forEach((item, index) => {
        const isChecked = selectedCheckboxes[index] === true;
        if (isChecked) anyChecked = true;
        html += `
            <div class="cart-item">
                <input type="checkbox" class="cart-item-checkbox" data-index="${index}" ${isChecked ? 'checked' : ''} onchange="updateSelection()">
                <img src="${item.img}" class="cart-img" alt="${item.name}">
                <div class="cart-info">
                    <span class="cart-name">${item.name}</span>
                    <span class="cart-price">${item.price}</span>
                    <div class="cart-qty">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                        <input type="text" class="qty-val" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-remove" onclick="removeItem(${index})">Xóa</button>
            </div>
        `;
    });
    html += `
        <div class="selected-info">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;flex:1">
                <input type="checkbox" id="selectAllCheckbox" ${anyChecked && Object.keys(selectedCheckboxes).length === cart.length ? 'checked' : ''} onchange="toggleSelectAll(this)">
                <span>Chọn tất cả</span>
            </label>
            <span>Đã chọn: <span class="count" id="selectedCount">${Object.keys(selectedCheckboxes).filter(k => selectedCheckboxes[k] !== false).length || cart.length}</span></span>
        </div>
    `;
    container.innerHTML = html;
    updateSelection();
}

function updateSelection() {
    const cart = getCart();
    const checkboxes = document.querySelectorAll('.cart-item-checkbox');
    let total = 0;
    let count = 0;
    checkboxes.forEach(cb => {
        const idx = parseInt(cb.dataset.index);
        selectedCheckboxes[idx] = cb.checked;
        if (cb.checked) {
            const item = cart[idx];
            if (item) {
                const price = parseInt(item.price.toString().replace(/\./g, '').replace(/[^0-9]/g, ''));
                total += price * (item.quantity || 1);
                count++;
            }
        }
    });
    const selectedCount = document.getElementById('selectedCount');
    if (selectedCount) selectedCount.textContent = count;
    const subtotalPrice = document.getElementById('subtotalPrice');
    const totalPrice = document.getElementById('totalPrice');
    const btnCheckout = document.getElementById('btnCheckout');
    if (subtotalPrice) subtotalPrice.textContent = formatVND(total);
    if (totalPrice) totalPrice.textContent = formatVND(total);
    if (btnCheckout) btnCheckout.disabled = count === 0;
}

function toggleSelectAll(master) {
    const checkboxes = document.querySelectorAll('.cart-item-checkbox');
    checkboxes.forEach(cb => cb.checked = master.checked);
    updateSelection();
}

function changeQty(index, delta) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + delta);
        saveCart(cart);
        renderCart();
    }
}

function removeItem(index) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        delete selectedCheckboxes[index];
        removeFromCart(index);
        renderCart();
    }
}

function goToCheckout() {
    const cart = getCart();
    const selected = [];
    const checkboxes = document.querySelectorAll('.cart-item-checkbox');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const idx = parseInt(cb.dataset.index);
            selected.push(cart[idx]);
        }
    });
    if (selected.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
        return;
    }
    localStorage.setItem('checkout_items', JSON.stringify(selected));
    window.location.href = ROOT_PATH()+'pages/thanh-toan.html';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    // Nếu đang ở trang giỏ hàng, render
    if (document.getElementById('cartItems')) {
        renderCart();
        document.getElementById('btnCheckout')?.addEventListener('click', goToCheckout);
    }
});
