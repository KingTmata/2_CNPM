// ============================================
// BUILD-PC.JS — Logic trang chọn linh kiện
// Dữ liệu sản phẩm được lấy từ data-products.js (API backend)
// ============================================

const LINH_KIEN_CHINH = ["cpu", "mainboard", "ram", "storage", "psu", "gpu"];
const SO_SP_MOI_TRANG = 6;
let trangHienTai = 1;

const danhSachLoai = [
    { id: "cpu",         ten: "CPU",         tenVN: "Bộ vi xử lý",     icon: "🔲" },
    { id: "cooler",      ten: "COOLER",      tenVN: "Tản nhiệt",       icon: "❄️" },
    { id: "mainboard",   ten: "MAINBOARD",   tenVN: "Bo mạch chủ",     icon: "🖥️" },
    { id: "ram",         ten: "RAM",         tenVN: "RAM",             icon: "💾" },
    { id: "gpu",         ten: "GPU",         tenVN: "Card màn hình",   icon: "🎮" },
    { id: "storage",     ten: "STORAGE",     tenVN: "Ổ Cứng SSD",      icon: "💿" },
    { id: "case",        ten: "CASE",        tenVN: "Case",            icon: "🗄️" },
    { id: "psu",         ten: "PSU",         tenVN: "Nguồn",           icon: "🔌" },
    { id: "fans",        ten: "FANS",        tenVN: "Quạt",            icon: "💨" },
    { id: "monitor",     ten: "MONITOR",     tenVN: "Màn hình",        icon: "🖱️" },
    { id: "peripherals", ten: "PERIPHERALS", tenVN: "Phụ kiện",        icon: "⌨️" }
];

// ===== DỮ LIỆU SẢN PHẨM (được cập nhật từ API qua data-products.js) =====
var duLieuSanPham = {};

// Hàm cập nhật dữ liệu từ getBuildPCData()
function capNhatDuLieuSanPham() {
    if (typeof getBuildPCData === 'function') {
        var dataMoi = getBuildPCData();
        if (dataMoi && Object.keys(dataMoi).length > 0) {
            duLieuSanPham = dataMoi;
            return true;
        }
    }
    return false;
}

// Hàm render lại toàn bộ khi dữ liệu thay đổi
function lamMoiKhiCoDuLieu() {
    var coDuLieu = capNhatDuLieuSanPham();
    if (coDuLieu) {
        loadBuildFromStorage();
        capNhatBoLocHang();
        renderLuoiLinhKien();
        renderDanhSachSanPham();
        renderCauHinhDaChon();
        renderTomTatBuild();
    }
}

const duLieuFPS = [
    { game: "Counter-Strike 2", heSo: 3.2 },
    { game: "Valorant", heSo: 4.0 },
    { game: "GTA V", heSo: 1.8 },
    { game: "Cyberpunk 2077", heSo: 1.0 },
    { game: "Red Dead Redemption 2", heSo: 1.1 },
    { game: "Forza Horizon 5", heSo: 1.5 }
];

const BUILD_ADVICE_KEY = 'pczone_build_advice';

let buildHienTai = {};
let loaiDangChon = "cpu";
let boLoc = { formFactor: "tat-ca", hang: "tat-ca", gia: "tat-ca", sapXep: "pho-bien" };
let lastAIResponse = '';
let lastAIRequest = '';

// ===== LƯU / LOAD LỊCH SỬ TƯ VẤN AI =====
function luuBuildAdvice(request, response) {
    try {
        var history = JSON.parse(localStorage.getItem(BUILD_ADVICE_KEY) || '[]');
        if (!Array.isArray(history)) history = [];
        history.unshift({
            request: request,
            response: response,
            time: new Date().toLocaleString('vi-VN')
        });
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem(BUILD_ADVICE_KEY, JSON.stringify(history));
    } catch(e) {}
}

function loadBuildAdvice() {
    try {
        var data = localStorage.getItem(BUILD_ADVICE_KEY);
        if (data) {
            var parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch(e) {}
    return [];
}

// Biến lưu danh sách lịch sử để dùng cho nút back
var _lichSuChatData = [];

function hienThiLichSuTuVan() {
    // Lấy từ shared chat history (pczone_chat_history) - đồng bộ với AI chat ở trang main
    var sharedHistory = [];
    try {
        var saved = localStorage.getItem('pczone_chat_history');
        if (saved) {
            sharedHistory = JSON.parse(saved);
            if (!Array.isArray(sharedHistory)) sharedHistory = [];
        }
    } catch(e) {}
    
    // Lọc chỉ lấy các cặp user + ai (5-7 đoạn chat gần nhất)
    var filtered = [];
    for (var i = 0; i < sharedHistory.length; i++) {
        var msg = sharedHistory[i];
        if (msg.role === 'user' || msg.role === 'ai') {
            filtered.push(msg);
        }
    }
    
    // Lấy 7 đoạn gần nhất (tương đương 3-4 cặp hỏi đáp)
    var recent = filtered.slice(-7);
    _lichSuChatData = recent;
    
    if (recent.length === 0) {
        hienThiModal('📋 Chưa có lịch sử chat với AI nào.');
        return;
    }

    var html = '<div style="font-weight:800;font-size:15px;margin-bottom:8px;text-align:center">📋 LỊCH SỬ CHAT VỚI AI</div>';
    html += '<div style="max-height:350px;overflow-y:auto">';
    for (var i = 0; i < recent.length; i++) {
        var msg = recent[i];
        var icon = msg.role === 'user' ? '👤' : '🤖';
        var label = msg.role === 'user' ? 'Bạn' : 'AI';
        var contentPreview = msg.content.substring(0, 120) + (msg.content.length > 120 ? '...' : '');
        html += '<div class="lich-su-item" style="border:1px solid #E2E8F0;border-radius:8px;padding:8px 10px;margin-bottom:6px;cursor:pointer;font-size:12px" onclick="hienThiLichSuChiTiet(' + i + ')">';
        html += '<div style="font-weight:700;color:#1a2848">' + icon + ' ' + label + ': ' + escapeHtml(contentPreview) + '</div>';
        html += '<div style="color:#718096;font-size:10px;margin-top:2px">🕐 ' + escapeHtml(msg.time || '') + '</div>';
        html += '</div>';
    }
    html += '</div>';
    html += '<div style="display:flex;gap:6px;margin-top:8px">';
    html += '<button onclick="xoaLichSuTuVan()" style="flex:1;padding:6px;background:#EF4444;color:white;border:2px solid #000;border-radius:8px;font-weight:700;font-size:11px;cursor:pointer">🗑️ Xóa lịch sử</button>';
    html += '</div>';

    document.getElementById("noiDungModal").innerHTML = html;
    document.getElementById("lopOverlay").classList.add("hien-thi");
}

function hienThiLichSuChiTiet(index) {
    var recent = _lichSuChatData;
    if (!recent || recent.length === 0) return;
    
    // Tìm cặp chat: lấy từ đầu cặp (user) đến hết cặp (ai) chứa index
    var startIdx = index;
    var endIdx = index;
    // Mở rộng về phía trước tìm user message
    for (var i = index; i >= 0; i--) {
        if (recent[i].role === 'user') {
            startIdx = i;
            break;
        }
    }
    // Mở rộng về phía sau tìm AI response
    for (var i = index; i < recent.length; i++) {
        if (recent[i].role === 'ai') {
            endIdx = i;
            break;
        }
    }
    
    var html = '<div style="display:flex;align-items:center;gap:6px;margin-bottom:12px">';
    html += '<button onclick="hienThiLichSuTuVan()" style="padding:4px 10px;background:linear-gradient(135deg,#60A5FA,#0EA5E9);color:white;border:2px solid #000;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">⬅️ Back</button>';
    html += '<span style="font-weight:800;font-size:13px;color:#1a2848">💬 CHAT</span>';
    html += '</div>';
    html += '<div style="max-height:350px;overflow-y:auto;display:flex;flex-direction:column;gap:10px">';
    
    for (var i = startIdx; i <= endIdx && i < recent.length; i++) {
        var msg = recent[i];
        var isUser = msg.role === 'user';
        var avatar = isUser ? '👤' : '🤖';
        var bubbleColor = isUser ? '#3B82F6' : '#1E293B';
        var textColor = isUser ? 'white' : '#E5E7EB';
        var align = isUser ? 'flex-end' : 'flex-start';
        var flexDir = isUser ? 'row-reverse' : 'row';
        
        // Format content with line breaks and bold
        var formattedContent = escapeHtml(msg.content);
        formattedContent = formattedContent.replace(/\*\*(.+?)\*\*/g, '<strong style="color:' + (isUser ? '#fff' : '#60A5FA') + '">$1</strong>');
        formattedContent = formattedContent.replace(/\n/g, '<br>');
        
        html += '<div style="display:flex;flex-direction:' + flexDir + ';align-items:flex-start;gap:6px;max-width:100%">';
        html += '<span style="font-size:20px;flex-shrink:0">' + avatar + '</span>';
        html += '<div style="background:' + bubbleColor + ';color:' + textColor + ';border-radius:12px 12px ' + (isUser ? '4px' : '12px') + ' ' + (isUser ? '12px' : '4px') + ';padding:10px 14px;font-size:12px;line-height:1.5;max-width:85%;word-wrap:break-word;border:2px solid #000">';
        html += formattedContent;
        html += '<div style="font-size:9px;opacity:0.6;margin-top:4px;text-align:' + (isUser ? 'right' : 'left') + '">' + escapeHtml(msg.time || '') + '</div>';
        html += '</div></div>';
    }
    
    html += '</div>';
    
    document.getElementById("noiDungModal").innerHTML = html;
}

function xoaLichSuTuVan() {
    localStorage.removeItem(BUILD_ADVICE_KEY);
    localStorage.removeItem('pczone_chat_history');
    // Reset chatHistory in memory if ai-chat.js is loaded
    if (typeof chatHistory !== 'undefined') {
        chatHistory = [];
    }
    hienThiModal('✅ Đã xóa toàn bộ lịch sử chat với AI.');
}

// ---------- TIỆN ÍCH ----------

function formatGia(vnd) {
    return vnd.toLocaleString("vi-VN") + "đ";
}

function daDuLinhKienChinh() {
    return LINH_KIEN_CHINH.every(function(key) {
        return buildHienTai[key] && buildHienTai[key].id;
    });
}

function layHangLoc() {
    const ds = duLieuSanPham[loaiDangChon] || [];
    const hangs = [...new Set(ds.map(function(sp) { return sp.hang; }))];
    return hangs.sort();
}

// ---------- RENDER CỘT TRÁI ----------

function renderLuoiLinhKien() {
    const luoi = document.getElementById("luoiLinhKien");
    if (!luoi) return;
    luoi.innerHTML = "";

    danhSachLoai.forEach(function(loai) {
        const oDiv = document.createElement("div");
        oDiv.className = "o-linhkien";
        const daChon = !!(buildHienTai[loai.id] && buildHienTai[loai.id].id);

        if (loai.id === loaiDangChon) oDiv.classList.add("dang-chon");
        if (daChon) oDiv.classList.add("da-chon");

        oDiv.innerHTML =
            '<span class="icon-linhkien">' + loai.icon + '</span>' +
            '<span class="ten-linhkien">' + loai.ten + '</span>';

        oDiv.addEventListener("click", function() {
            loaiDangChon = loai.id;
            trangHienTai = 1;
            capNhatBoLocHang();
            renderLuoiLinhKien();
            renderDanhSachSanPham();
        });

        luoi.appendChild(oDiv);
    });
}

function capNhatBoLocHang() {
    const select = document.getElementById("locHang");
    if (!select) return;
    const giaTriCu = select.value;
    select.innerHTML = '<option value="tat-ca">Hãng ▾</option>';
    layHangLoc().forEach(function(hang) {
        const opt = document.createElement("option");
        opt.value = hang;
        opt.textContent = hang;
        select.appendChild(opt);
    });
    if ([...select.options].some(function(o) { return o.value === giaTriCu; })) {
        select.value = giaTriCu;
    } else {
        select.value = "tat-ca";
        boLoc.hang = "tat-ca";
    }
}

// ---------- RENDER DANH SÁCH SẢN PHẨM ----------

function locVaSapXepSanPham() {
    let danhSach = duLieuSanPham[loaiDangChon];
    if (!danhSach) return [];

    let ketQua = danhSach.slice();

    if (boLoc.formFactor !== "tat-ca") {
        ketQua = ketQua.filter(function(sp) { return sp.formFactor.indexOf(boLoc.formFactor) !== -1; });
    }
    if (boLoc.hang !== "tat-ca") {
        ketQua = ketQua.filter(function(sp) { return sp.hang === boLoc.hang; });
    }
    if (boLoc.gia === "duoi-3") {
        ketQua = ketQua.filter(function(sp) { return sp.gia < 3000000; });
    } else if (boLoc.gia === "3-10") {
        ketQua = ketQua.filter(function(sp) { return sp.gia >= 3000000 && sp.gia <= 10000000; });
    } else if (boLoc.gia === "tren-10") {
        ketQua = ketQua.filter(function(sp) { return sp.gia > 10000000; });
    }

    if (boLoc.sapXep === "gia-tang") {
        ketQua.sort(function(a, b) { return a.gia - b.gia; });
    } else if (boLoc.sapXep === "gia-giam") {
        ketQua.sort(function(a, b) { return b.gia - a.gia; });
    } else {
        ketQua.sort(function(a, b) { return b.phoPhien - a.phoPhien; });
    }

    return ketQua;
}

function renderPhanTrang(tongKetQua, tongGoc) {
    const tongTrang = Math.max(1, Math.ceil(tongKetQua / SO_SP_MOI_TRANG));
    if (trangHienTai > tongTrang) trangHienTai = tongTrang;

    const batDau = tongKetQua === 0 ? 0 : (trangHienTai - 1) * SO_SP_MOI_TRANG + 1;
    const ketThuc = Math.min(trangHienTai * SO_SP_MOI_TRANG, tongKetQua);

    var demEl = document.getElementById("demKetQua");
    if (demEl) {
        demEl.textContent =
            tongKetQua === 0
                ? "Không có sản phẩm"
                : "Hiển thị " + batDau + "–" + ketThuc + " / " + tongGoc + " sản phẩm";
    }

    const nhom = document.getElementById("nhomSoTrang");
    if (!nhom) return;
    nhom.innerHTML = "";

    function taoNut(label, trang, extra) {
        const btn = document.createElement("button");
        btn.className = "nut-trang" + (trang === trangHienTai ? " active" : "") + (extra || "");
        btn.textContent = label;
        btn.addEventListener("click", function() {
            trangHienTai = trang;
            renderDanhSachSanPham();
        });
        nhom.appendChild(btn);
    }

    if (tongTrang > 1) {
        taoNut("‹", Math.max(1, trangHienTai - 1), " prev-btn");
        for (let i = 1; i <= tongTrang; i++) taoNut(String(i), i);
        taoNut("›", Math.min(tongTrang, trangHienTai + 1), " next-btn");
    }
}

function renderDanhSachSanPham() {
    const container = document.getElementById("danhSachSanPham");
    if (!container) return;
    container.innerHTML = "";

    const ketQua = locVaSapXepSanPham();
    const tongGoc = (duLieuSanPham[loaiDangChon] || []).length;

    if (ketQua.length === 0) {
        container.innerHTML = '<p class="thong-bao-trong">Chưa có sản phẩm phù hợp bộ lọc.</p>';
        renderPhanTrang(0, tongGoc);
        return;
    }

    renderPhanTrang(ketQua.length, tongGoc);

    const batDau = (trangHienTai - 1) * SO_SP_MOI_TRANG;
    const trangData = ketQua.slice(batDau, batDau + SO_SP_MOI_TRANG);

    trangData.forEach(function(sp) {
        const card = document.createElement("div");
        card.className = "card-sanpham";
        const dangChon = buildHienTai[loaiDangChon] && buildHienTai[loaiDangChon].id === sp.id;
        if (dangChon) card.classList.add("dang-chon");

        card.innerHTML =
            '<img class="anh-sanpham" src="' + sp.anh + '" alt="' + sp.ten + '">' +
            '<div class="thong-tin-sp">' +
                '<div class="ten-sanpham">' + sp.ten + '</div>' +
                '<span class="nhan-form-factor">' + sp.formFactor + '</span>' +
                '<div class="mo-ta-sp">' + sp.moTa + '</div>' +
                '<div class="gia-sanpham">' + formatGia(sp.gia) + '</div>' +
            '</div>' +
            '<button class="nut-chon-sp">' + (dangChon ? "✓" : "+") + '</button>';

        card.addEventListener("click", function() { chonSanPham(sp); });
        container.appendChild(card);
    });
}

// ---------- PANEL CẤU HÌNH ----------

let panelCauHinhDangMo = false;

function togglePanelCauHinh() {
    panelCauHinhDangMo = !panelCauHinhDangMo;
    document.getElementById("panelCauHinh").classList.toggle("dang-mo", panelCauHinhDangMo);
    document.getElementById("nutMoCauHinh").classList.toggle("dang-mo", panelCauHinhDangMo);
}

function renderCauHinhDaChon() {
    const container = document.getElementById("danhSachCauHinh");
    if (!container) return;
    container.innerHTML = "";

    danhSachLoai.forEach(function(loai) {
        const comp = buildHienTai[loai.id];
        const hang = document.createElement("div");
        hang.className = "hang-cau-hinh-don" + (comp ? " co-sp" : "");

        let noiDungSP = "";
        if (comp) {
            noiDungSP =
                '<div class="dong-sp-chon">' +
                    '<img class="anh-sp-chon" src="' + comp.anh + '" alt="" loading="lazy">' +
                    '<p class="ten-sp-chon">' + comp.ten + "</p>" +
                "</div>";
        }

        hang.innerHTML =
            '<span class="nhan-loai">' + loai.tenVN + "</span>" + noiDungSP;

        container.appendChild(hang);
    });
}

// ---------- CHỌN SẢN PHẨM ----------

function luuBuildVaoStorage() {
    try {
        var buildData = {};
        for (var key in buildHienTai) {
            if (buildHienTai.hasOwnProperty(key)) {
                var comp = buildHienTai[key];
                if (comp && comp.id) {
                    buildData[key] = {
                        id: comp.id,
                        ten: comp.ten,
                        hang: comp.hang,
                        gia: comp.gia,
                        anh: comp.anh,
                        diemCpu: comp.diemCpu || 0,
                        diemGpu: comp.diemGpu || 0,
                        soLuong: comp.soLuong || 1
                    };
                }
            }
        }
        localStorage.setItem('pczone_current_build', JSON.stringify(buildData));
    } catch(e) {}
}

function chonSanPham(sp) {
    const dangChon = buildHienTai[loaiDangChon] && buildHienTai[loaiDangChon].id === sp.id;

    if (dangChon) {
        delete buildHienTai[loaiDangChon];
    } else {
        buildHienTai[loaiDangChon] = {
            id: sp.id,
            ten: sp.ten,
            hang: sp.hang,
            formFactor: sp.formFactor,
            moTa: sp.moTa,
            gia: sp.gia,
            anh: sp.anh,
            diemCpu: sp.diemCpu,
            diemGpu: sp.diemGpu,
            soLuong: 1
        };
    }
    capNhatToanBo();
}

function capNhatToanBo() {
    renderDanhSachSanPham();
    renderLuoiLinhKien();
    renderCauHinhDaChon();
    renderTomTatBuild();
    luuBuildVaoStorage();
}

// ---------- TÍNH TOÁN ----------

function tinhTongGia() {
    let tong = 0;
    for (const key in buildHienTai) {
        const comp = buildHienTai[key];
        if (comp && comp.gia) tong += comp.gia * (comp.soLuong || 1);
    }
    return String(tong);
}

function tinhCongSuat() {
    const map = {
        cpu: 125, gpu: 250, cooler: 10, mainboard: 25,
        ram: 8, storage: 6, case: 5, psu: 15,
        fans: 10, monitor: 30, peripherals: 5
    };
    let tongW = 0;
    for (const key in map) {
        if (buildHienTai[key]) {
            let heSo = buildHienTai[key].soLuong || 1;
            if (key === "fans" || key === "ram") heSo = Math.min(heSo, 4);
            tongW += map[key] * (key === "fans" || key === "ram" ? heSo : 1);
        }
    }
    if (buildHienTai.gpu) {
        const diem = buildHienTai.gpu.diemGpu || 60;
        tongW += Math.round(diem * 1.5);
    }
    return tongW;
}

function tinhDiemHieuNang() {
    if (!daDuLinhKienChinh()) return 0;
    const cpu = buildHienTai.cpu.diemCpu || 70;
    const gpu = buildHienTai.gpu.diemGpu || 60;
    const ramBonus = (buildHienTai.ram.soLuong || 1) >= 2 ? 5 : 0;
    return Math.round(gpu * 0.75 + cpu * 0.2 + ramBonus);
}

function tinhFPS(diem) {
    return duLieuFPS.map(function(item) {
        const fps = Math.round(diem * item.heSo);
        const phanTram = Math.min(100, Math.round((fps / 300) * 100));
        return { game: item.game, fps: fps + " FPS", phanTram: phanTram };
    });
}

// ---------- CỘT PHẢI ----------

function renderTomTatBuild() {
    const tong = parseInt(tinhTongGia(), 10);
    const congSuat = tinhCongSuat();
    const chiPhiThang = Math.round(congSuat * 8 * 30 * 3500 / 1000 / 1000);

    var soTienEl = document.getElementById("soTienTong");
    var congSuatEl = document.getElementById("tongCongSuat");
    var chiPhiEl = document.getElementById("chiPhiThang");
    if (soTienEl) soTienEl.textContent = formatGia(tong);
    if (congSuatEl) congSuatEl.textContent = "~ " + congSuat + "W";
    if (chiPhiEl) chiPhiEl.textContent = "~ " + formatGia(chiPhiThang) + "/tháng";

    renderFPS();
}

function renderFPS() {
    const container = document.getElementById("danhSachFPS");
    const chuThich = document.getElementById("chuThichFPS");
    if (!container) return;
    container.innerHTML = "";

    if (!daDuLinhKienChinh()) {
        const thieu = LINH_KIEN_CHINH.filter(function(k) {
            return !buildHienTai[k] || !buildHienTai[k].id;
        });
        const tenThieu = thieu.map(function(k) {
            const loai = danhSachLoai.find(function(l) { return l.id === k; });
            return loai ? loai.tenVN : k;
        });
        container.innerHTML =
            '<div class="fps-chua-du">' +
                '<p>Chưa đủ linh kiện chính để ước tính FPS.</p>' +
                '<p class="thieu-lk">Còn thiếu: <strong>' + tenThieu.join(", ") + '</strong></p>' +
            '</div>';
        if (chuThich) chuThich.textContent = "* Cần đủ CPU, Mainboard, RAM, SSD, PSU và GPU.";
        return;
    }

    const diem = tinhDiemHieuNang();
    const fpsList = tinhFPS(diem);

    fpsList.forEach(function(item) {
        const hang = document.createElement("div");
        hang.className = "hang-fps";
        hang.innerHTML =
            '<div class="dong-fps-info">' +
                '<span class="ten-game">' + item.game + '</span>' +
                '<span class="so-fps">' + item.fps + '</span>' +
            '</div>' +
            '<div class="thanh-fps">' +
                '<div class="phan-fps" style="width:' + item.phanTram + '%"></div>' +
            '</div>';
        container.appendChild(hang);
    });

    if (chuThich) chuThich.textContent = "* FPS ước tính 1080p Ultra dựa trên CPU + GPU đã chọn.";
}

// ---------- LƯU / XÓA ----------

function luuBuildRaFile() {
    if (Object.keys(buildHienTai).length === 0) {
        hienThiModal("⚠️ Chưa có linh kiện nào trong cấu hình!");
        return;
    }

    let noiDung = "===== CẤU HÌNH PC - PCZone =====\n";
    noiDung += "Nguồn dữ liệu: pczone.vn\n\n";

    danhSachLoai.forEach(function(loai) {
        const comp = buildHienTai[loai.id];
        if (comp) {
            const sl = comp.soLuong || 1;
            noiDung += loai.tenVN.toUpperCase() + ": " + comp.ten +
                " x" + sl + " - " + formatGia(comp.gia * sl) + "\n";
        }
    });

    noiDung += "\nTỔNG CỘNG: " + formatGia(parseInt(tinhTongGia(), 10)) + "\n";
    noiDung += "Công suất ước tính: " + tinhCongSuat() + "W\n";

    if (daDuLinhKienChinh()) {
        noiDung += "Điểm hiệu năng: " + tinhDiemHieuNang() + "/100\n";
    }

    const blob = new Blob([noiDung], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cau-hinh-pc.txt";
    link.click();
    URL.revokeObjectURL(link.href);

    hienThiModal("✅ Đã lưu cấu hình thành file TXT!");
}

function xoaHetBuild() {
    buildHienTai = {};
    trangHienTai = 1;
    capNhatToanBo();
    localStorage.removeItem('pczone_current_build');
    hienThiModal("🗑️ Đã xóa toàn bộ cấu hình.");
}

// ---------- MODAL ----------

function hienThiModal(noiDung) {
    var formatted = noiDung;
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    var lines = formatted.split('\n');
    var inList = false;
    var html = '';
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var trimmed = line.trim();
        if (trimmed.match(/^-\s/)) {
            if (!inList) {
                html += '<ul style="margin:4px 0;padding-left:20px;list-style:disc">';
                inList = true;
            }
            html += '<li>' + trimmed.substring(2) + '</li>';
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (trimmed === '') {
                html += '<br>';
            } else {
                html += '<div>' + trimmed + '</div>';
            }
        }
    }
    if (inList) html += '</ul>';

    if (lastAIResponse && noiDung === lastAIResponse) {
        html += '<div style="display:flex;gap:6px;margin-top:10px">';
        html += '<button onclick="document.getElementById(\'buildRequest\').focus();anModal()" style="flex:1;padding:7px;background:#60A5FA;color:white;border:2px solid #000;border-radius:8px;font-weight:700;font-size:11px;cursor:pointer">🔄 Hỏi lại</button>';
        html += '<button onclick="hienThiLichSuTuVan()" style="flex:1;padding:7px;background:#1a2848;color:white;border:2px solid #000;border-radius:8px;font-weight:700;font-size:11px;cursor:pointer">📜 Lịch sử</button>';
        html += '</div>';
    }

    document.getElementById("noiDungModal").innerHTML = html;
    document.getElementById("lopOverlay").classList.add("hien-thi");
}

function anModal() {
    document.getElementById("lopOverlay").classList.remove("hien-thi");
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ---------- SỰ KIỆN ----------

document.getElementById("nutDongModal").addEventListener("click", anModal);
document.getElementById("lopOverlay").addEventListener("click", function(e) {
    if (e.target === this) anModal();
});

document.getElementById("nutMoCauHinh").addEventListener("click", togglePanelCauHinh);

document.getElementById("nutLuuBuild").addEventListener("click", luuBuildRaFile);
document.getElementById("nutLuuCauHinh").addEventListener("click", luuBuildRaFile);
document.getElementById("nutXoaHet").addEventListener("click", xoaHetBuild);
document.getElementById("nutLamMoi").addEventListener("click", xoaHetBuild);

document.getElementById("nutTaiExcel").addEventListener("click", function() {
    hienThiModal("📊 Tính năng xuất Excel đang phát triển.");
});

document.getElementById("nutThemGio").addEventListener("click", function() {
    if (Object.keys(buildHienTai).length === 0) {
        hienThiModal("⚠️ Vui lòng chọn linh kiện trước!");
        return;
    }
    var dem = 0;
    for (var key in buildHienTai) {
        if (buildHienTai.hasOwnProperty(key)) {
            var comp = buildHienTai[key];
            if (comp && comp.id) {
                // SỬA: truyền price là số (number) thay vì chuỗi đã format
                addToCart({
                    name: comp.ten,
                    price: comp.gia,
                    img: comp.anh || '../assets/media/product/default.svg',
                    specs: comp.moTa || '',
                    quantity: comp.soLuong || 1
                });
                dem++;
            }
        }
    }
    hienThiModal("🛒 Đã thêm " + dem + " linh kiện vào giỏ hàng!");
});

document.getElementById("nutChiaSe").addEventListener("click", function() {
    navigator.clipboard.writeText(window.location.href).catch(function() {});
    hienThiModal("🔗 Đã copy link cấu hình! (demo)");
});

// ---------- BUILD REQUEST INPUT ----------

// Đồng bộ với shared chat history (pczone_chat_history) dùng bởi ai-chat.js
function dongBoChatHistory(role, content) {
    try {
        var history = JSON.parse(localStorage.getItem('pczone_chat_history') || '[]');
        if (!Array.isArray(history)) history = [];
        history.push({
            role: role,
            content: content,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('pczone_chat_history', JSON.stringify(history));
    } catch(e) {}
}

function xuLyBuildRequest() {
    var input = document.getElementById("buildRequest");
    var text = input.value.trim();
    if (!text) {
        hienThiModal("✏️ Vui lòng nhập yêu cầu build PC của bạn!\nVí dụ: \"build PC gaming 20 triệu\", \"PC văn phòng 10 triệu\"");
        return;
    }

    lastAIRequest = text;
    hienThiModal("⏳ Đang phân tích yêu cầu của bạn...\n\nVui lòng đợi trong giây lát...");

    // Đồng bộ tin nhắn user vào shared chat history
    dongBoChatHistory('user', text);

    apiAIBuildPC(text)
        .then(function(result) {
            if (result && result.response) {
                lastAIResponse = result.response;
                luuBuildAdvice(text, result.response);
                // Đồng bộ phản hồi AI vào shared chat history
                dongBoChatHistory('ai', result.response);
                hienThiModal(result.response);
            } else {
                hienThiModal("❌ Không nhận được phản hồi từ AI. Vui lòng thử lại.");
            }
        })
        .catch(function(error) {
            apiAIChat(text)
                .then(function(result) {
                    if (result && result.response) {
                        lastAIResponse = result.response;
                        luuBuildAdvice(text, result.response);
                        // Đồng bộ phản hồi AI vào shared chat history
                        dongBoChatHistory('ai', result.response);
                        hienThiModal(result.response);
                    } else {
                        hienThiModal("❌ Lỗi kết nối AI: " + error.message + "\n\n⚠️ Vui lòng kiểm tra backend hoặc thử lại sau.");
                    }
                })
                .catch(function(fallbackError) {
                    hienThiModal("❌ Lỗi kết nối AI: " + fallbackError.message + "\n\n⚠️ Vui lòng kiểm tra kết nối backend hoặc thử lại sau.");
                });
        });
}

document.getElementById("buildRequestBtn").addEventListener("click", xuLyBuildRequest);
document.getElementById("buildRequest").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        xuLyBuildRequest();
    }
});

// ===== NÚT LỊCH SỬ CHAT VỚI AI =====
document.getElementById("lichSuChatBtn").addEventListener("click", function() {
    // Load shared history from ai-chat.js if available
    if (typeof loadChatHistory === 'function') {
        loadChatHistory();
    }
    hienThiLichSuTuVan();
});

document.getElementById("locFormFactor").addEventListener("change", function() {
    boLoc.formFactor = this.value;
    trangHienTai = 1;
    renderDanhSachSanPham();
});
document.getElementById("locHang").addEventListener("change", function() {
    boLoc.hang = this.value;
    trangHienTai = 1;
    renderDanhSachSanPham();
});
document.getElementById("locGia").addEventListener("change", function() {
    boLoc.gia = this.value;
    trangHienTai = 1;
    renderDanhSachSanPham();
});
document.getElementById("sapXep").addEventListener("change", function() {
    boLoc.sapXep = this.value;
    trangHienTai = 1;
    renderDanhSachSanPham();
});

// ===== LOAD BUILD TỪ LOCALSTORAGE =====
function loadBuildFromStorage() {
    try {
        var saved = localStorage.getItem('pczone_current_build');
        if (saved) {
            var buildData = JSON.parse(saved);
            for (var key in buildData) {
                if (buildData.hasOwnProperty(key)) {
                    var comp = buildData[key];
                    if (comp && comp.id) {
                        var original = null;
                        var list = duLieuSanPham[key] || [];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].id === comp.id) {
                                original = list[i];
                                break;
                            }
                        }
                        if (original) {
                            buildHienTai[key] = {
                                id: original.id,
                                ten: original.ten,
                                hang: original.hang,
                                formFactor: original.formFactor || '',
                                moTa: original.moTa || '',
                                gia: original.gia,
                                anh: original.anh,
                                diemCpu: original.diemCpu || 0,
                                diemGpu: original.diemGpu || 0,
                                soLuong: comp.soLuong || 1
                            };
                        } else {
                            buildHienTai[key] = {
                                id: comp.id,
                                ten: comp.ten,
                                hang: comp.hang || '',
                                formFactor: '',
                                moTa: '',
                                gia: comp.gia || 0,
                                anh: comp.anh || '../assets/media/product/default.svg',
                                diemCpu: comp.diemCpu || 0,
                                diemGpu: comp.diemGpu || 0,
                                soLuong: comp.soLuong || 1
                            };
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.warn('Cannot load build from localStorage:', e);
    }
}

// ===== LẮNG NGHE SỰ KIỆN KHI DỮ LIỆU API ĐƯỢC LOAD XONG =====
document.addEventListener('productsLoaded', function(e) {
    capNhatDuLieuSanPham();
    lamMoiKhiCoDuLieu();
});

// ===== KHỞI TẠO =====
// Thử lấy dữ liệu ngay nếu đã có
var coData = capNhatDuLieuSanPham();

loadBuildFromStorage();
loaiDangChon = "cpu";
capNhatBoLocHang();
renderLuoiLinhKien();
renderDanhSachSanPham();
renderCauHinhDaChon();
renderTomTatBuild();