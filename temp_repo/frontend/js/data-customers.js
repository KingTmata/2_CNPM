/* ============================================
   PCZONE - DATA KHÁCH HÀNG & ĐƠN HÀNG
   File chứa tất cả dữ liệu mẫu về khách hàng,
   đơn hàng, đánh giá, tài khoản, thống kê
   ============================================ */

// ===== TÀI KHOẢN ĐĂNG NHẬP =====
// role: 'admin' hoặc 'customer'
const ACCOUNTS = [
  { email: 'admin@pczone.vn',  password: 'admin123', name: 'Admin',    phone: '0987654321', role: 'admin'    },
  { email: 'user@pczone.vn',   password: 'user123',  name: 'Khách',    phone: '0912345678', role: 'customer' },
];

// ===== DỮ LIỆU MẪU ĐƠN HÀNG =====
const DEFAULT_ORDERS = [
  { id: 'ORD001', customer: 'Nguyễn Minh Anh', date: '2025-06-10', total: 17500000, payment: 'Chuyển khoản', status: 'Đã xác nhận', items: ['Intel Core i9-13900K'] },
  { id: 'ORD002', customer: 'Trần Hoàng Nam',  date: '2025-06-11', total: 44200000, payment: 'COD',          status: 'Đang giao',  items: ['NVIDIA RTX 4090 24GB', 'Samsung 990 Pro 1TB'] },
  { id: 'ORD003', customer: 'Lê Thị Bích',     date: '2025-06-12', total: 2500000,  payment: 'VNPAY',        status: 'Hoàn thành', items: ['Samsung 990 Pro 1TB'] },
  { id: 'ORD004', customer: 'Phạm Văn Đức',    date: '2025-06-13', total: 10400000, payment: 'Chuyển khoản', status: 'Chờ xác nhận', items: ['ASUS ROG Strix B760-F', 'Corsair Vengeance 32GB'] },
  { id: 'ORD005', customer: 'Võ Thị Thu',      date: '2025-06-14', total: 4900000,  payment: 'VNPAY',        status: 'Đã hủy',    items: ['ASUS ROG Strix B760-F'] },
];

// ===== DỮ LIỆU MẪU KHÁCH HÀNG =====
const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Nguyễn Minh Anh', email: 'anh@gmail.com',   phone: '0901234567', address: '123 Lê Lợi, Quận 1, TP.HCM', joined: '2024-11-01', orders: 3, spent: 25000000, status: 'Hoạt động' },
  { id: 2, name: 'Trần Hoàng Nam',  email: 'nam@gmail.com',   phone: '0912345678', address: '456 Nguyễn Huệ, Quận Bình Thạnh, TP.HCM', joined: '2024-12-15', orders: 1, spent: 44200000, status: 'Hoạt động' },
  { id: 3, name: 'Lê Thị Bích',    email: 'bich@gmail.com',  phone: '0923456789', address: '789 Trần Hưng Đạo, Quận 5, TP.HCM', joined: '2025-01-20', orders: 2, spent: 5000000,  status: 'Hoạt động' },
  { id: 4, name: 'Phạm Văn Đức',   email: 'duc@gmail.com',   phone: '0934567890', address: '321 Cách Mạng Tháng 8, Quận 10, TP.HCM', joined: '2025-02-05', orders: 1, spent: 10400000, status: 'Bị khóa' },
];

// ===== DỮ LIỆU MẪU ĐÁNH GIÁ =====
const DEFAULT_REVIEWS = [
  { id: 1, product: 'Intel Core i9-13900K', user: 'Trần Hoàng Nam', rating: 5, content: 'CPU cực kỳ mạnh, overclock tốt', date: '2025-06-05', reported: false },
  { id: 2, product: 'NVIDIA RTX 4090 24GB', user: 'Nguyễn Minh Anh', rating: 5, content: 'Card xịn nhất hiện tại, không cần bàn', date: '2025-06-08', reported: false },
  { id: 3, product: 'Samsung 990 Pro 1TB',  user: 'Lê Thị Bích',    rating: 4, content: 'Tốc độ nhanh, nhiệt độ hơi cao', date: '2025-06-10', reported: true },
];

// ===== THỐNG KÊ DOANH THU THEO THÁNG =====
const REVENUE_DATA = [12, 19, 15, 28, 23, 35, 29, 41, 38, 45, 39, 52]; // triệu VNĐ
const ORDER_DATA   = [8,  14, 11, 20, 18, 25, 21, 30, 27, 33, 28, 40];
const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];