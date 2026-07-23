/* ============================================
   AI-CHAT.JS - Popup chat Build PC AI
   Gọi API backend /api/AI thay vì dữ liệu cứng
   Lưu lịch sử chat vào localStorage theo phiên
   ============================================ */

const CHAT_STORAGE_KEY = 'pczone_chat_history';

// ===== BIẾN TRẠNG THÁI =====
let chatHistory = [];
let isProcessing = false;

// ===== LƯU / LOAD LỊCH SỬ =====
function luuChatHistory() {
    try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    } catch(e) {}
}

function loadChatHistory() {
    try {
        var saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
            chatHistory = JSON.parse(saved);
            if (!Array.isArray(chatHistory)) chatHistory = [];
        }
    } catch(e) {
        chatHistory = [];
    }
}

function xoaChatHistory() {
    chatHistory = [];
    localStorage.removeItem(CHAT_STORAGE_KEY);
}

// ===== MỞ POPUP =====
function openAIChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (!overlay) return;
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Load lịch sử và hiển thị lại
    loadChatHistory();
    renderChatHistory();

    // Focus input
    setTimeout(function() {
        const input = document.getElementById('aiChatInput');
        if (input) input.focus();
    }, 300);
}

// ===== ĐÓNG POPUP =====
function closeAIChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== CHAT MỚI =====
function newAIChat() {
    if (isProcessing) return;
    xoaChatHistory();
    const body = document.getElementById('aiChatBody');
    if (body) {
        body.innerHTML = '';
        // Thêm tin nhắn chào mừng
        addChatMessage('ai', '👋 Xin chào! Mình là trợ lý Build PC AI.\n\nBạn muốn build PC với mục đích gì?\n\n💬 Hãy nhập yêu cầu của bạn, ví dụ:\n• "build PC gaming 20 triệu"\n• "PC văn phòng 10 triệu"\n• "PC đồ họa 30 triệu"');
    }
}

// ===== GỬI TIN NHẮN =====
function sendAIChatMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    if (!message || isProcessing) return;

    // Thêm tin nhắn user
    addChatMessage('user', message);
    input.value = '';
    isProcessing = true;

    // Hiển thị typing indicator
    showTypingIndicator();

    // Detect intent
    const msg = message.toLowerCase();
    const isBuildRequest = /build|tư vấn|cấu hình|build pc|chọn giúp|giúp em|gaming|văn phòng|đồ họa/i.test(msg);
    const isSuggestRequest = /gợi ý|sản phẩm|nên mua|tìm|giới thiệu/i.test(msg);

    // Gọi API backend
    let apiPromise;
    if (isBuildRequest) {
        apiPromise = apiAIBuildPC(message);
    } else if (isSuggestRequest) {
        apiPromise = apiAISuggestProduct(message);
    } else {
        apiPromise = apiAIChat(message);
    }

    apiPromise
        .then(function(result) {
            removeTypingIndicator();
            var response = result.response || 'Xin lỗi, tôi không thể trả lời ngay lúc này.';
            addChatMessage('ai', response);
        })
        .catch(function(error) {
            removeTypingIndicator();
            var errorMsg = '❌ Lỗi kết nối: ' + error.message;
            addChatMessage('ai', errorMsg + '\n\n⚠️ Vui lòng kiểm tra kết nối backend hoặc thử lại sau.');
        })
        .finally(function() {
            isProcessing = false;
            scrollChatToBottom();
        });
}

// ===== TYPING INDICATOR =====
function showTypingIndicator() {
    removeTypingIndicator();
    const body = document.getElementById('aiChatBody');
    if (!body) return;

    const div = document.createElement('div');
    div.className = 'ai-chat-msg msg-ai';
    div.id = 'typingIndicator';
    div.innerHTML = '<div class="msg-avatar-ai">🤖</div>' +
        '<div class="msg-bubble ai-bubble">' +
            '<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>' +
        '</div>';
    body.appendChild(div);
    scrollChatToBottom();
}

function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ===== RENDER LỊCH SỬ CHAT =====
function renderChatHistory() {
    const body = document.getElementById('aiChatBody');
    if (!body) return;
    body.innerHTML = '';

    if (!chatHistory || chatHistory.length === 0) {
        // Tin nhắn chào mừng
        addChatMessage('ai', '👋 Xin chào! Mình là trợ lý Build PC AI.\n\nBạn muốn build PC với mục đích gì?\n\n💬 Hãy nhập yêu cầu của bạn, ví dụ:\n• "build PC gaming 20 triệu"\n• "PC văn phòng 10 triệu"\n• "PC đồ họa 30 triệu"');
        return;
    }

    for (var i = 0; i < chatHistory.length; i++) {
        var msg = chatHistory[i];
        addChatMessageDOM(msg.role, msg.content);
    }
    scrollChatToBottom();
}

// ===== THÊM TIN NHẮN VÀO CHAT (có lưu history) =====
function addChatMessage(type, content) {
    // Lưu vào history
    chatHistory.push({
        role: type,
        content: content,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
    luuChatHistory();

    // Render lên DOM
    addChatMessageDOM(type, content);
}

function addChatMessageDOM(type, content) {
    const body = document.getElementById('aiChatBody');
    if (!body) return;

    const div = document.createElement('div');
    div.className = 'ai-chat-msg ' + (type === 'user' ? 'msg-user' : 'msg-ai');

    // Xử lý markdown đơn giản
    var formattedContent = escapeHtml(content);
    formattedContent = formattedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Xử lý gạch đầu dòng
    formattedContent = formattedContent.replace(/^- (.+)$/gm, '<li>$1</li>');
    formattedContent = formattedContent.replace(/(<li>.*<\/li>\n?)+/g, '<ul style="margin:4px 0;padding-left:16px;list-style:disc">$&</ul>');
    formattedContent = formattedContent.replace(/\n/g, '<br>');

    // Lấy thời gian từ history nếu có
    var timeStr = '';
    for (var i = 0; i < chatHistory.length; i++) {
        if (chatHistory[i].role === type && chatHistory[i].content === content) {
            timeStr = chatHistory[i].time || '';
            break;
        }
    }

    let html = '';
    if (type === 'user') {
        html = '<div class="msg-bubble user-bubble">' +
                   '<div class="msg-text">' + formattedContent + '</div>' +
                   (timeStr ? '<div class="msg-time" style="font-size:10px;opacity:0.7;margin-top:4px;text-align:right">' + timeStr + '</div>' : '') +
               '</div>';
    } else {
        html = '<div class="msg-avatar-ai">🤖</div>' +
               '<div class="msg-bubble ai-bubble">' +
                   '<div class="msg-text">' + formattedContent + '</div>' +
                   (timeStr ? '<div class="msg-time" style="font-size:10px;opacity:0.5;margin-top:4px">' + timeStr + '</div>' : '') +
               '</div>';
    }

    div.innerHTML = html;
    body.appendChild(div);
    scrollChatToBottom();
}

// ===== SCROLL XUỐNG CUỐI =====
function scrollChatToBottom() {
    const body = document.getElementById('aiChatBody');
    if (body) {
        body.scrollTop = body.scrollHeight;
    }
}

// ===== ESCAPE HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendAIChatMessage();
            }
        });
    }

    // Nút gửi
    const sendBtn = document.getElementById('aiChatSendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendAIChatMessage);
    }

    // Nút chat mới
    const newBtn = document.getElementById('aiChatNewBtn');
    if (newBtn) {
        newBtn.addEventListener('click', newAIChat);
    }

    // Đóng overlay khi click ra ngoài
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeAIChat();
        });
    }

    // Đóng bằng nút X
    const closeBtn = document.getElementById('aiChatClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAIChat);
    }
});