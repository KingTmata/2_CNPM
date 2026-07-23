document.addEventListener('DOMContentLoaded', function() {
    const total = localStorage.getItem('temp_total');
    if (total) {
        const formatted = new Intl.NumberFormat('vi-VN').format(total) + ' ₫';
        document.getElementById('displayTotal').textContent = formatted;
    }
});
function confirmPaid() {
    alert('Cảm ơn bạn! PCZONE đã tiếp nhận yêu cầu thanh toán.');
    localStorage.removeItem('temp_total');
    window.location.href = ROOT_PATH()+'main+ds+sp.html';
}