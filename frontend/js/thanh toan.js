// ============================================
// THANH-TOAN.JS — Logic thanh toán & QR Payment
// Hỗ trợ nhận dữ liệu từ localStorage (checkout_items)
// ============================================

// Load dữ liệu từ localStorage (nếu có) hoặc dùng dữ liệu mẫu
function getCheckoutItems() {
    try {
        var items = localStorage.getItem('checkout_items');
        if (items) {
            return JSON.parse(items);
        }
    } catch(e) {}
    return null;
}

function renderOrder() {
    const listContainer = document.getElementById('orderItemsList');
    if (!listContainer) return;

    var items = getCheckoutItems();
    if (!items || items.length === 0) {
        items = [{
            name: "ASUS TUF Gaming RTX 4070 Ti 12GB",
            price: "28.990.000₫",
            img: '../assets/media/product/default.svg',
            qty: 1
        }];
    }

    let subtotal = 0;
    listContainer.innerHTML = items.map(item => {
        const priceStr = item.priceDisplay || item.price || '0';
        const priceNum = parseInt(priceStr.toString().replace(/[.₫₫]/g, ''));
        const qty = item.quantity || item.qty || 1;
        subtotal += priceNum * qty;

        return `
            <div class="item-mini">
                <img src="${item.img}" class="img-mini">
                <div class="info-mini">
                    <span class="name">${item.name}</span>
                    <span class="qty-price">SL: ${qty} × ${priceNum.toLocaleString('vi-VN')}₫</span>
                </div>
            </div>
        `;
    }).join('');

    // Cập nhật giá trị
    const subtotalEl = document.getElementById('subtotal');
    const finalTotalEl = document.getElementById('finalTotal');
    if (subtotalEl) subtotalEl.innerText = subtotal.toLocaleString('vi-VN') + '₫';
    if (finalTotalEl) finalTotalEl.innerText = subtotal.toLocaleString('vi-VN') + '₫';
}

// Xử lý nút Đặt hàng
function initCheckout() {
    var btnPlaceOrder = document.getElementById('btnPlaceOrder');
    if (btnPlaceOrder) {
        btnPlaceOrder.addEventListener('click', function() {
            const name = document.getElementById('orderName')?.value.trim();
            const phone = document.getElementById('orderPhone')?.value.trim();
            const address = document.getElementById('orderAddress')?.value.trim();

            if (!name || !phone || !address) {
                alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
                return;
            }

            const successModal = document.getElementById('successOrder');
            if (successModal) successModal.classList.add('show');

            setTimeout(() => {
                localStorage.removeItem('checkout_items');
                window.location.href = ROOT_PATH()+'main+ds+sp.html';
            }, 3500);
        });
    }
    renderOrder();
}

// ===== QR PAYMENT (qr-payment.html) =====
function initQRPayment() {
    if (!document.getElementById('qrPaymentInfo')) return;
    
    // Hiển thị thông tin đơn hàng trên QR page
    var items = getCheckoutItems();
    var total = 0;
    if (items && items.length > 0) {
        items.forEach(function(item) {
            var priceStr = item.priceDisplay || item.price || '0';
            var priceNum = parseInt(priceStr.toString().replace(/[.₫₫]/g, ''));
            var qty = item.quantity || item.qty || 1;
            total += priceNum * qty;
        });
    }
    var totalEl = document.getElementById('qrPaymentInfo');
    if (totalEl) {
        totalEl.innerHTML = '<strong>Tổng tiền:</strong> ' + total.toLocaleString('vi-VN') + '₫';
    }
}

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
    initQRPayment();
});