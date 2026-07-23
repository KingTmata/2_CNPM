// ============================================
// FPS-CALCULATOR.JS — Tính & so sánh FPS theo độ phân giải
// Dữ liệu build lấy từ localStorage (do buildpc.js lưu)
// ============================================

(function() {
try {

// Danh sách game (giống buildpc.js)
const DU_LIEU_FPS = [
    { game: "Counter-Strike 2", heSo: 3.2 },
    { game: "Valorant", heSo: 4.0 },
    { game: "GTA V", heSo: 1.8 },
    { game: "Cyberpunk 2077", heSo: 1.0 },
    { game: "Red Dead Redemption 2", heSo: 1.1 },
    { game: "Forza Horizon 5", heSo: 1.5 }
];

// Hệ số độ phân giải (scale factor so với 1080p)
const RESOLUTIONS = [
    { key: "720p", label: "720p", badge: "res-badge-720", scale: 1.4 },
    { key: "1080p", label: "1080p", badge: "res-badge-1080", scale: 1.0 },
    { key: "1440p", label: "1440p", badge: "res-badge-1440", scale: 0.65 },
    { key: "4K", label: "4K", badge: "res-badge-4k", scale: 0.35 }
];

// Linh kiện chính cần để tính FPS
const LINH_KIEN_CHINH = ["cpu", "gpu"];

// ===== HÀM FORMAT GIÁ =====
function formatGia(vnd) {
    return Number(vnd).toLocaleString("vi-VN") + "đ";
}

// ===== LẤY BUILD TỪ LOCALSTORAGE =====
function getBuildFromStorage() {
    try {
        var saved = localStorage.getItem('pczone_current_build');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch(e) {
        console.warn('FPS: Cannot read build from localStorage:', e);
    }
    return null;
}

// ===== KIỂM TRA BUILD CÓ ĐỦ LINH KIỆN CHÍNH KHÔNG =====
function hasEnoughParts(build) {
    if (!build) return false;
    return LINH_KIEN_CHINH.every(function(key) {
        return build[key] && build[key].id;
    });
}

// ===== TÍNH ĐIỂM HIỆU NĂNG =====
function tinhDiemHieuNang(build) {
    if (!hasEnoughParts(build)) return 0;
    var cpu = build.cpu.diemCpu || 70;
    var gpu = build.gpu.diemGpu || 60;
    var ramBonus = (build.ram && (build.ram.soLuong || 1) >= 2) ? 5 : 0;
    return Math.round(gpu * 0.75 + cpu * 0.2 + ramBonus);
}

// ===== TÍNH FPS CHO 1 GAME Ở 1 ĐỘ PHÂN GIẢI =====
function tinhFPSChoGame(gameHeSo, diem, scale) {
    var fps = Math.round(diem * gameHeSo * scale);
    return Math.max(0, fps);
}

// ===== LẤY LABEL ĐÁNH GIÁ FPS =====
function getFPSLabel(fps) {
    if (fps >= 144) return { text: "Tuyệt vời", cls: "fps-label-great", barCls: "fps-bar-great", pct: Math.min(100, fps / 3) };
    if (fps >= 60) return { text: "Tốt", cls: "fps-label-good", barCls: "fps-bar-good", pct: Math.min(100, fps / 2.5) };
    if (fps >= 30) return { text: "Tạm ổn", cls: "fps-label-ok", barCls: "fps-bar-ok", pct: Math.min(100, fps / 1.5) };
    return { text: "Thấp", cls: "fps-label-low", barCls: "fps-bar-low", pct: Math.min(100, fps * 2) };
}

// ===== TẠO DEMO BUILD NẾU CHƯA CÓ =====
function getDemoBuild() {
    // Tìm CPU và GPU từ ALL_PRODUCTS nếu có
    var cpu = null, gpu = null;
    if (typeof ALL_PRODUCTS !== 'undefined' && ALL_PRODUCTS.length > 0) {
        cpu = ALL_PRODUCTS.find(function(sp) { return sp.danhMuc === 'CPU' && sp.diemCpu > 0; });
        gpu = ALL_PRODUCTS.find(function(sp) { return sp.danhMuc === 'GPU' && sp.diemGpu > 0; });
    }
    if (!cpu) cpu = { id: 999, ten: 'CPU AMD Ryzen 5 5600', gia: 2790000, anh: '../assets/media/product/default.svg', diemCpu: 72, diemGpu: 0, soLuong: 1 };
    if (!gpu) gpu = { id: 888, ten: 'VGA MSI RTX 4060 VENTUS 8GB', gia: 7490000, anh: '../assets/media/product/default.svg', diemCpu: 0, diemGpu: 58, soLuong: 1 };
    
    return {
        cpu: { id: cpu.id, ten: cpu.ten, gia: cpu.gia, anh: cpu.img || cpu.anh, diemCpu: cpu.diemCpu || 0, diemGpu: 0, soLuong: 1 },
        gpu: { id: gpu.id, ten: gpu.ten, gia: gpu.gia, anh: gpu.img || gpu.anh, diemCpu: 0, diemGpu: gpu.diemGpu || 0, soLuong: 1 }
    };
}

// ===== RENDER BUILD INFO =====
function renderBuildInfo(build) {
    var container = document.getElementById('buildInfo');
    if (!container) return;
    container.innerHTML = '';

    if (!build) {
        container.innerHTML = '<div class="no-build-state" style="grid-column:1/-1"><span class="icon" style="font-size:64px;display:block;margin-bottom:16px">🔧</span><h3 style="font-size:20px;font-weight:800;margin-bottom:8px">Chưa có cấu hình PC</h3><p style="color:#6B7280;font-size:14px;margin-bottom:20px">Vui lòng tạo cấu hình PC tại trang Build PC, hoặc dùng cấu hình mẫu</p><button onclick="suDungCauHinhMau()" class="fps-btn fps-btn-primary" style="cursor:pointer;padding:10px 20px;border:2px solid #000;border-radius:12px;font-weight:700;font-size:13px;font-family:Nunito,sans-serif;background:linear-gradient(135deg,#60A5FA,#0EA5E9);color:white;box-shadow:4px 4px 0px 0px #000">🚀 Dùng cấu hình mẫu</button></div>';
        return;
    }

    var items = [
        { icon: '🔲', label: 'CPU', value: build.cpu ? build.cpu.ten : 'Chưa chọn' },
        { icon: '🎮', label: 'GPU', value: build.gpu ? build.gpu.ten : 'Chưa chọn' },
        { icon: '💾', label: 'RAM', value: build.ram ? build.ram.ten : 'Chưa chọn' },
        { icon: '💿', label: 'SSD', value: build.storage ? build.storage.ten : 'Chưa chọn' }
    ];

    items.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'build-selector-item' + (item.value !== 'Chưa chọn' ? ' selected' : '');
        div.innerHTML =
            '<span class="icon" style="font-size:28px">' + item.icon + '</span>' +
            '<div class="info" style="flex:1;min-width:0">' +
                '<div class="label" style="font-size:11px;color:#6B7280;font-weight:600;text-transform:uppercase">' + item.label + '</div>' +
                '<div class="value" style="font-size:14px;font-weight:700;color:#1c1c2e">' + item.value + '</div>' +
            '</div>';
        container.appendChild(div);
    });
}

// ===== RENDER BUILD STATUS =====
function renderBuildStatus(build) {
    var container = document.getElementById('buildStatus');
    if (!container) return;
    container.innerHTML = '';

    if (!build) return;

    if (hasEnoughParts(build)) {
        container.innerHTML =
            '<div class="build-status ready" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:16px;background:#D1FAE5;color:#065F46;border:2px solid #10B981">' +
                '✅ Đã đủ CPU & GPU — Có thể tính FPS' +
            '</div>';
    } else {
        var missing = LINH_KIEN_CHINH.filter(function(k) {
            return !build[k] || !build[k].id;
        });
        container.innerHTML =
            '<div class="build-status missing" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:16px;background:#FEF3C7;color:#92400E;border:2px solid #F59E0B">' +
                '⚠️ Còn thiếu: ' + missing.join(', ') + ' — Không thể tính FPS' +
            '</div>';
    }
}

// ===== RENDER BẢNG FPS =====
function renderFPSTable(build) {
    var container = document.getElementById('fpsTableContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!build || !hasEnoughParts(build)) {
        container.innerHTML =
            '<div class="no-build-state" style="text-align:center;padding:80px 24px;background:white;border:2px solid #000;border-radius:12px;box-shadow:4px 4px 0px 0px #000">' +
                '<span class="icon" style="font-size:64px;display:block;margin-bottom:16px">📊</span>' +
                '<h3 style="font-size:20px;font-weight:800;margin-bottom:8px">Chưa thể tính FPS</h3>' +
                '<p style="color:#6B7280;font-size:14px">Vui lòng chọn đầy đủ CPU và GPU tại trang Build PC để xem kết quả</p>' +
            '</div>';
        return;
    }

    var diem = tinhDiemHieuNang(build);
    var tongTien = tinhTongTien(build);

    var html = '';

    // Header
    html += '<div class="fps-table-header" style="padding:16px 24px;background:linear-gradient(135deg,#1E293B,#0F172A);color:white;display:flex;justify-content:space-between;align-items:center">' +
        '<h2 style="font-size:16px;font-weight:800">📊 FPS Estimated — So sánh độ phân giải</h2>' +
        '<span class="note" style="font-size:11px;color:#94A3B8">Điểm hiệu năng: ' + diem + '/100 | Tổng: ' + formatGia(tongTien) + '</span>' +
    '</div>';

    // Table
    html += '<table class="fps-table" style="width:100%;border-collapse:collapse">' +
        '<thead><tr>' +
            '<th style="background:#F8FAFC;padding:14px 16px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#6B7280;border-bottom:2px solid #000;text-align:left;padding-left:24px">Game</th>';

    RESOLUTIONS.forEach(function(res) {
        html += '<th style="background:#F8FAFC;padding:14px 16px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#6B7280;border-bottom:2px solid #000;text-align:center"><span class="res-badge ' + res.badge + '" style="display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;background:#D1FAE5;color:#065F46">' + res.label + '</span></th>';
    });

    html += '</tr></thead><tbody>';

    // Data rows
    DU_LIEU_FPS.forEach(function(game) {
        html += '<tr>' +
            '<td style="padding:12px 16px;font-size:14px;font-weight:700;border-bottom:1px solid #E5E7EB;padding-left:24px">' + game.game + '</td>';

        RESOLUTIONS.forEach(function(res) {
            var fps = tinhFPSChoGame(game.heSo, diem, res.scale);
            var label = getFPSLabel(fps);
            html += '<td style="padding:12px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #E5E7EB;text-align:center">' +
                '<div class="fps-value" style="display:inline-flex;align-items:center;gap:6px;font-weight:800">' +
                    '<span class="fps-bar ' + label.barCls + '" style="display:inline-block;height:8px;border-radius:4px;min-width:20px;width:' + label.pct + 'px;background:linear-gradient(90deg,#10B981,#059669);transition:width 0.4s ease"></span>' +
                    fps + ' FPS' +
                '</div>' +
                '<br><span class="fps-label ' + label.cls + '" style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:700;background:#D1FAE5;color:#065F46">' + label.text + '</span>' +
            '</td>';
        });

        html += '</tr>';
    });

    html += '</tbody></table>';

    container.innerHTML = html;
}

// ===== TÍNH TỔNG TIỀN BUILD =====
function tinhTongTien(build) {
    var tong = 0;
    for (var key in build) {
        var comp = build[key];
        if (comp && comp.gia) {
            tong += comp.gia * (comp.soLuong || 1);
        }
    }
    return tong;
}

// ===== DÙNG CẤU HÌNH MẪU (gọi từ HTML) =====
function suDungCauHinhMau() {
    var build = getDemoBuild();
    // Lưu vào localStorage
    try {
        localStorage.setItem('pczone_current_build', JSON.stringify(build));
    } catch(e) {}
    // Render lại
    renderBuildInfo(build);
    renderBuildStatus(build);
    renderFPSTable(build);
}

// ===== CHUYỂN ĐẾN BUILD PC =====
function goToBuildPC() {
    window.location.href = ROOT_PATH()+'pages/buildpc.html';
}

// ===== KHỞI TẠO =====
function init() {
    var build = getBuildFromStorage();
    renderBuildInfo(build);
    renderBuildStatus(build);
    renderFPSTable(build);
}

// Chạy khi DOM sẵn sàng
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// Export for inline onclick
window.suDungCauHinhMau = suDungCauHinhMau;
window.goToBuildPC = goToBuildPC;

} catch(e) {
    console.error('FPS Calculator error:', e);
    document.addEventListener('DOMContentLoaded', function() {
        var container = document.getElementById('fpsTableContainer');
        if (container) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#EF4444;font-weight:700">⚠️ Đã xảy ra lỗi: ' + e.message + '</div>';
        }
    });
}
})();