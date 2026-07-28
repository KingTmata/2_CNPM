# PCZONE - Website bán máy tính và linh kiện PC

![.NET Build & Test](https://github.com/KingTmata/2_CNPM/actions/workflows/dotnet.yml/badge.svg)

## Giới thiệu

PCZONE là website thương mại điện tử chuyên bán máy tính, laptop, linh kiện và phụ kiện PC. Hệ thống được xây dựng theo kiến trúc Layered Monolithic với RESTful API, cho phép khách hàng tìm kiếm, so sánh, build PC và đặt mua sản phẩm trực tuyến. Quản trị viên có thể quản lý sản phẩm, đơn hàng và theo dõi doanh thu qua trang quản trị riêng.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | ASP.NET Core Web API (C#) |
| Database | SQLite (Entity Framework Core) |
| Xác thực | JWT (JSON Web Token) |
| Hash mật khẩu | BCrypt (BCrypt.Net-Next) |
| Kiểm thử | xUnit + Moq |
| Hosting Backend | Render |
| Hosting Frontend | GitHub Pages |
| CI/CD | GitHub Actions |

## Kiến trúc tổng quan

```
┌──────────────┐   HTTP/JSON    ┌────────────────────────┐   EF Core   ┌──────────┐
│  Frontend    │──────────────▶│  Backend (ASP.NET Core │────────────▶│  SQLite  │
│  (HTML/CSS/  │◀──────────────│  Web API)              │◀────────────│  (file)  │
│  JavaScript) │   RESTful API  │  Controller→Service→   │             │          │
└──────────────┘                │  Repository/DbContext  │             └──────────┘
                                └────────────────────────┘
```

## Tính năng chính

### Phía Khách hàng
- **Tìm kiếm & Lọc sản phẩm**: Theo tên, giá, danh mục, thương hiệu
- **Chi tiết sản phẩm**: Thông số kỹ thuật, hình ảnh, đánh giá
- **Build PC**: Chọn linh kiện, kiểm tra tương thích theo thời gian thực
- **AI tư vấn**: Trợ lý AI (Gemini) gợi ý cấu hình theo nhu cầu
- **Giỏ hàng & Đặt hàng**: Thêm/xóa sản phẩm, đặt hàng, xem lịch sử
- **Đăng ký / Đăng nhập**: Xác thực JWT

### Phía Quản trị viên
- **Dashboard**: Thống kê doanh thu, đơn hàng
- **Quản lý sản phẩm**: Thêm/sửa/xóa sản phẩm và danh mục
- **Quản lý đơn hàng**: Xem, duyệt, cập nhật trạng thái đơn hàng

## Hướng dẫn cài đặt & chạy local

### Yêu cầu
- .NET 9.0 SDK
- Git

### Backend

```bash
git clone https://github.com/KingTmata/2_CNPM.git
cd 2_CNPM/backend/PCZone.API

# Chạy với seed dữ liệu mẫu (lần đầu)
dotnet run -- --reseed

# Chạy bình thường (các lần sau)
dotnet run
```

Backend chạy tại `http://localhost:5042`. Swagger tại `http://localhost:5042/swagger`.

### Frontend

Mở file `frontend/main+ds+sp.html` trong trình duyệt (click chuột phải → Open with Live Server hoặc mở trực tiếp).

### Kiểm thử

```bash
dotnet test tests/PCZone.Tests
```

## API Endpoints

Tài liệu đầy đủ tại Swagger:
- Local: `http://localhost:5042/swagger`
- Deploy: `https://two-cnpm.onrender.com/swagger`

### Nhóm controller chính

| Controller | Mô tả |
|---|---|
| `/api/SanPham` | CRUD sản phẩm |
| `/api/DanhMuc` | CRUD danh mục |
| `/api/DangNhap` | Đăng nhập (JWT) |
| `/api/KhachHang` | Đăng ký & quản lý tài khoản |
| `/api/GioHang` | Giỏ hàng |
| `/api/DonHang` | Đơn hàng |
| `/api/BuildPC` | Build PC & kiểm tra tương thích |
| `/api/AI` | Trợ lý AI tư vấn cấu hình |
| `/api/Admin` | Quản trị hệ thống |

## Bảo mật

- **Hash mật khẩu**: BCrypt (BCrypt.Net-Next)
- **Xác thực**: JWT token 7 ngày
- **Phân quyền**: `[Authorize(Roles = "Admin")]` cho các endpoint quản trị
- **Xử lý lỗi**: Middleware tập trung trả JSON chuẩn
- **Chống SQL Injection**: Entity Framework Core (parameterized query)

## Demo

- **Frontend (GitHub Pages)**: [https://kingtmata.github.io/2_CNPM/frontend/main+ds+sp.html](https://kingtmata.github.io/2_CNPM/frontend/main+ds+sp.html)
- **Backend Swagger**: [https://two-cnpm.onrender.com/swagger](https://two-cnpm.onrender.com/swagger)

## Tài khoản mẫu

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@pczone.vn | admin123 |
| Khách hàng | user@pczone.vn | user123 |

## Giấy phép

Đồ án học phần Công nghệ Phần mềm.