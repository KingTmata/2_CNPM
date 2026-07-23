# BÁO CÁO CHI TIẾT DỰ ÁN PCZONE

> **Phiên bản:** 1.0  
> **Ngày báo cáo:** 04/07/2026  
> **Tác giả:** Senior Software Architect  
> **Loại tài liệu:** Báo cáo phân tích kiến trúc & kỹ thuật toàn diện

---

# MỤC LỤC

1. [Tổng quan dự án](#phần-1-tổng-quan-dự-án)
2. [Tiến độ dự án](#phần-2-tiến-độ-dự-án)
3. [Cấu trúc thư mục](#phần-3-cấu-trúc-thư-mục)
4. [Phân tích từng file](#phần-4-phân-tích-từng-file)
5. [Controller](#phần-5-controller)
6. [Service](#phần-6-service)
7. [Repository](#phần-7-repository)
8. [Model](#phần-8-model)
9. [DTO](#phần-9-dto)
10. [Database](#phần-10-database)
11. [Dependency Injection](#phần-11-dependency-injection)
12. [Middleware](#phần-12-middleware)
13. [Helpers](#phần-13-helpers)
14. [Luồng dữ liệu](#phần-14-luồng-dữ-liệu)
15. [Biến](#phần-15-biến)
16. [Hàm](#phần-16-hàm)
17. [API](#phần-17-api)
18. [Frontend](#phần-18-frontend)
19. [Đánh giá Clean Code](#phần-19-đánh-giá-clean-code)
20. [Những gì còn thiếu](#phần-20-những-gì-còn-thiếu)
21. [Roadmap](#phần-21-roadmap)
22. [Danh sách câu hỏi bảo vệ đồ án](#phần-22-danh-sách-câu-hỏi-bảo-vệ-đồ-án)
23. [Đánh giá cuối](#phần-23-đánh-giá-cuối)

---

# PHẦN 1: TỔNG QUAN DỰ ÁN

## 1.1. Mục tiêu

Xây dựng website thương mại điện tử **PCZONE** chuyên bán máy tính và linh kiện PC. Dự án hướng đến việc cung cấp một nền tảng hoàn chỉnh cho phép:

- Khách hàng xem, tìm kiếm, so sánh sản phẩm linh kiện PC
- Xây dựng cấu hình PC (Build PC) với kiểm tra tương thích
- Đặt hàng trực tuyến, quản lý giỏ hàng, thanh toán
- Quản trị viên quản lý sản phẩm, đơn hàng, khách hàng, doanh thu
- Tích hợp AI tư vấn cấu hình PC

## 1.2. Chức năng chính

### Nhóm chức năng khách hàng (Frontend)
| STT | Chức năng | Trạng thái |
|-----|-----------|------------|
| 1 | Xem danh sách sản phẩm theo danh mục | ✅ Hoàn thành |
| 2 | Xem chi tiết sản phẩm | ✅ Hoàn thành |
| 3 | Tìm kiếm sản phẩm | ✅ Hoàn thành |
| 4 | Lọc sản phẩm theo giá, thương hiệu | ✅ Hoàn thành |
| 5 | So sánh sản phẩm | ✅ Hoàn thành |
| 6 | Giỏ hàng (localStorage) | ✅ Hoàn thành |
| 7 | Build PC - Xây dựng cấu hình | ✅ Hoàn thành |
| 8 | Kiểm tra tương thích linh kiện | ✅ Hoàn thành |
| 9 | Tính FPS cho cấu hình game | ✅ Hoàn thành |
| 10 | AI tư vấn cấu hình | ✅ Hoàn thành |
| 11 | Đăng ký / Đăng nhập | ✅ Hoàn thành (Backend) |
| 12 | Đặt hàng | ✅ Hoàn thành (Backend) |
| 13 | Thanh toán (QR) | ✅ Hoàn thành (Frontend) |
| 14 | Đánh giá sản phẩm | ✅ Hoàn thành (Backend) |
| 15 | Xem đơn mua | ✅ Hoàn thành (Frontend) |
| 16 | Coupon/Giảm giá | ✅ Hoàn thành (Backend) |

### Nhóm chức năng quản trị (Admin)
| STT | Chức năng | Trạng thái |
|-----|-----------|------------|
| 1 | Dashboard thống kê | ✅ Hoàn thành |
| 2 | Quản lý sản phẩm (CRUD) | ✅ Hoàn thành |
| 3 | Quản lý danh mục | ✅ Hoàn thành |
| 4 | Quản lý đơn hàng | ✅ Hoàn thành |
| 5 | Quản lý khách hàng | ✅ Hoàn thành |
| 6 | Quản lý đánh giá | ✅ Hoàn thành |
| 7 | Quản lý coupon | ✅ Hoàn thành |
| 8 | Quản lý cấu hình Build PC | ✅ Hoàn thành |
| 9 | Quản lý kho hàng | ✅ Hoàn thành |
| 10 | Quản lý nhập hàng | ✅ Hoàn thành |

## 1.3. Đối tượng sử dụng

| Đối tượng | Mô tả |
|-----------|-------|
| **Khách vãng lai** | Xem sản phẩm, build PC, so sánh, tính FPS |
| **Khách hàng (đã đăng ký)** | Đặt hàng, quản lý đơn hàng, đánh giá, dùng coupon |
| **Quản trị viên (Admin)** | Quản lý toàn bộ hệ thống qua admin panel |

## 1.4. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (HTML/CSS/JS)                    │
│  main+ds+sp.html  │  admin.html  │  buildpc.html  │  ...    │
│  js/api.js (fetch → localhost:5000)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (ASP.NET Core Web API)                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Controller │→│ Service  │→│Repository│→│ DbContext│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │              │              │              │         │
│      DTO           DTO           Entity          EF         │
│       │              │              │              │         │
│  Validation      Nghiệp vụ      CRUD LINQ      Mapping     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────┐
              │    SQL SERVER       │
              │  PCZoneDB           │
              └─────────────────────┘
```

**Kiến trúc:** Layered Architecture (Phân lớp)
- **Controller Layer:** Tiếp nhận request HTTP, trả về response
- **Service Layer:** Xử lý nghiệp vụ, gọi Repository
- **Repository Layer:** CRUD với database qua Entity Framework Core
- **Data Layer:** DbContext, Migration, Seed Data

## 1.5. Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| ASP.NET Core | 8.0 | Web API framework |
| C# | 12.0 | Ngôn ngữ lập trình |
| Entity Framework Core | 8.0 | ORM |
| SQL Server | 2022 | Database |
| JWT Bearer | 8.0 | Authentication |
| Swagger/OpenAPI | 6.0 | API Documentation |
| DotNetEnv | 2.5 | Environment variables |

### Frontend
| Công nghệ | Mục đích |
|-----------|----------|
| HTML5 | Cấu trúc trang |
| CSS3 | Giao diện, responsive |
| JavaScript (ES6+) | Xử lý logic, DOM, API fetch |
| Chart.js | Biểu đồ admin dashboard |
| Google Fonts (Nunito) | Font chữ |
| Google Material Icons | Icon |

### Công cụ phát triển
| Công cụ | Mục đích |
|---------|----------|
| Visual Studio Code | IDE |
| .NET SDK 8.0 | Build & run |
| npm | Quản lý package (nếu có) |

## 1.6. Lý do chọn công nghệ

| Công nghệ | Lý do |
|-----------|-------|
| **ASP.NET Core** | Hiệu năng cao, bảo mật tốt, hỗ trợ Dependency Injection sẵn, phù hợp với kiến trúc doanh nghiệp |
| **Entity Framework Core** | ORM mạnh mẽ, tự động migration, LINQ queries, giảm thời gian phát triển |
| **SQL Server** | Ổn định, bảo mật, phù hợp với hệ thống thương mại điện tử |
| **JWT** | Authentication stateless, phù hợp với REST API |
| **Layered Architecture** | Dễ bảo trì, dễ mở rộng, tách biệt rõ ràng các tầng |
| **HTML/CSS/JS thuần** | Phù hợp với đồ án, không cần học framework mới, dễ demo |

---

# PHẦN 2: TIẾN ĐỘ DỰ ÁN

## 2.1. Đã hoàn thành

### Backend (API)
- [x] Cấu trúc dự án ASP.NET Core Web API
- [x] Entity Framework Core + DbContext (UngDungDbContext)
- [x] Migration tự động khi chạy
- [x] Seed Data (6 file JSON: danh-muc, san-pham, khach-hang, don-hang, chi-tiet-don-hang, danh-gia, coupon)
- [x] 11 Models đầy đủ quan hệ
- [x] 8 Repositories (Interface + Implementation)
- [x] 12 Services (Interface + Implementation)
- [x] 15 Controllers
- [x] 17 DTOs
- [x] JWT Authentication (đã cấu hình nhưng tạm tắt)
- [x] Swagger UI
- [x] CORS
- [x] Dependency Injection đầy đủ
- [x] Upload file (UploadController)
- [x] AI Service (gọi API ngoài)
- [x] Build PC + Kiểm tra tương thích
- [x] Dashboard thống kê

### Frontend
- [x] Trang chủ (main+ds+sp.html) - Danh sách sản phẩm, banner, danh mục
- [x] Trang chi tiết sản phẩm (chi-tiet-sp.html)
- [x] Trang giỏ hàng (gio-hang.html)
- [x] Trang thanh toán (thanh-toan.html)
- [x] Trang Build PC (buildpc.html)
- [x] Trang so sánh sản phẩm (so-sanh-sp.html)
- [x] Trang FPS Calculator (fps-calculator.html)
- [x] Trang Best Sellers (best-sellers.html)
- [x] Trang Admin (admin.html)
- [x] Trang đơn mua (don-mua.html)
- [x] Trang QR Payment (qr-payment.html)
- [x] Trang danh mục: GPU (gpu.html), Laptop (laptop.html), Màn hình (man-hinh.html), Linh kiện (peripherals.html), PC bộ (pc-bo-mixi.html)
- [x] AI Chat (ai-chat.js)
- [x] Tìm kiếm (search.js)
- [x] API client (api.js) - kết nối backend

## 2.2. Đang làm / Còn tồn tại

- [ ] **JWT Authentication đang tắt** - Dòng `app.UseAuthentication()` và `app.UseAuthorization()` bị comment trong Program.cs
- [ ] **ThanhToanService.cs** - File rỗng (0 bytes), chưa có implementation
- [ ] **Frontend chưa kết nối hoàn toàn với Backend** - Nhiều chức năng frontend dùng localStorage thay vì gọi API
- [ ] **Admin frontend dùng localStorage** - ADMIN.JS dùng data-products.js và data-customers.js (dữ liệu giả) thay vì gọi API backend
- [ ] **Chưa có Exception Handling Middleware**
- [ ] **Chưa có Logging** (ngoại trừ mặc định)
- [ ] **Chưa có Validation toàn diện** (chỉ có Data Annotation trong DTO)
- [ ] **Chưa có Pagination/Search/Filter/Sort API**
- [ ] **Chưa có Soft Delete**
- [ ] **Chưa có Rate Limiting**
- [ ] **Chưa có Role-based Authorization** (AdminController có [Authorize(Roles = "Admin")] nhưng JWT đang tắt)

## 2.3. Mức độ hoàn thành %

| Module | % Hoàn thành | Ghi chú |
|--------|-------------|---------|
| **Backend Models** | 100% | 11 models đầy đủ |
| **Backend Repositories** | 100% | 8 repository đầy đủ CRUD |
| **Backend Services** | 95% | 12/13 service hoạt động (ThanhToanService rỗng) |
| **Backend Controllers** | 100% | 15 controllers đầy đủ endpoint |
| **Backend DTOs** | 100% | 17 DTOs |
| **Backend Database** | 90% | Migration + Seed Data, thiếu index |
| **Backend Auth** | 40% | JWT cấu hình nhưng đang tắt |
| **Frontend Pages** | 95% | 16/16 trang HTML |
| **Frontend JavaScript** | 85% | Nhiều chức năng dùng localStorage |
| **Frontend CSS** | 90% | 5 file CSS responsive |
| **Kết nối FE-BE** | 50% | api.js có nhưng chưa dùng hết |
| **Admin Panel** | 80% | Giao diện đẹp nhưng dùng dữ liệu giả |
| **Build PC** | 90% | Frontend + Backend, thiếu kết nối |
| **AI Chat** | 85% | Frontend + Backend |
| **Kiểm thử** | 5% | Chưa có unit test, integration test |

**Tổng thể dự án: ~75%**

## 2.4. Đánh giá chất lượng hiện tại

| Tiêu chí | Điểm (1-10) | Nhận xét |
|----------|-------------|----------|
| Kiến trúc | 8 | Layered Architecture rõ ràng, DI tốt |
| Mã nguồn Backend | 7 | Clean code, tách biệt interface/implementation |
| Mã nguồn Frontend | 6 | Còn nhiều code lặp, thiếu tổ chức |
| Database | 7 | Quan hệ tốt, thiếu index |
| Bảo mật | 4 | JWT tắt, thiếu validation |
| Giao diện | 8 | Đẹp, responsive |
| Tính năng | 7 | Nhiều tính năng nhưng chưa kết nối |

## 2.5. Những phần cần ưu tiên tiếp theo

1. **Bật JWT Authentication** - Bỏ comment `app.UseAuthentication()` và `app.UseAuthorization()`
2. **Kết nối Admin Frontend với Backend API** - Thay localStorage bằng api.js
3. **Hoàn thiện ThanhToanService** - Implement xử lý thanh toán
4. **Thêm Exception Handling Middleware**
5. **Thêm Pagination cho API sản phẩm**
6. **Kết nối Frontend Cart với Backend Cart API**
7. **Thêm Logging (Serilog)**
8. **Viết Unit Test**

---

# PHẦN 3: CẤU TRÚC THƯ MỤC

## 3.1. Tổng quan cấu trúc

```
web lan cuoi/
├── backend/
│   └── PCZone.API/
│       ├── Controllers/          # 15 files - API endpoints
│       ├── Services/             # 24 files - Business logic
│       ├── Repositories/         # 16 files - Data access
│       ├── Models/               # 11 files - Entities
│       ├── DTOs/                 # 17 files - Data transfer objects
│       ├── Data/
│       │   ├── SeedData/         # 7 JSON files + SeedData.cs
│       │   └── UngDungDbContext.cs
│       ├── Helpers/              # (chưa có)
│       ├── Middleware/            # (chưa có)
│       ├── Program.cs
│       ├── appsettings.json
│       ├── .env
│       └── PCZone.API.csproj
├── css/                          # 5 files
├── js/                           # 15 files
├── media/product/                # Product images
├── README/                       # 3 files
├── database/                     # (chưa có nội dung)
├── *.html                        # 16 files
├── PCZone.sln
└── test-api.html
```

## 3.2. Phân tích từng thư mục

### Thư mục: `backend/PCZone.API/Controllers/`
- **Vai trò:** Tiếp nhận HTTP request, trả về HTTP response
- **Quan hệ:** Gọi Service layer, nhận DTO từ request, trả DTO ra response
- **Số file:** 15 files (14 controller + 1 TestController)
- **File quan trọng nhất:** `SanPhamController.cs` - API chính cho sản phẩm

### Thư mục: `backend/PCZone.API/Services/`
- **Vai trò:** Xử lý nghiệp vụ, orchestrate các Repository
- **Quan hệ:** Controller gọi Service, Service gọi Repository
- **Số file:** 24 files (12 Interface + 12 Implementation)
- **File quan trọng nhất:** `SanPhamService.cs` - Xử lý nghiệp vụ sản phẩm

### Thư mục: `backend/PCZone.API/Repositories/`
- **Vai trò:** CRUD với database qua Entity Framework
- **Quan hệ:** Service gọi Repository, Repository dùng DbContext
- **Số file:** 16 files (8 Interface + 8 Implementation)
- **File quan trọng nhất:** `SanPhamRepository.cs` - Query sản phẩm

### Thư mục: `backend/PCZone.API/Models/`
- **Vai trò:** Định nghĩa entity mapping với database
- **Quan hệ:** DbContext dùng Model để tạo database
- **Số file:** 11 files
- **File quan trọng nhất:** `SanPham.cs` - Entity trung tâm

### Thư mục: `backend/PCZone.API/DTOs/`
- **Vai trò:** Data Transfer Object - truyền dữ liệu giữa client và server
- **Quan hệ:** Controller nhận DTO từ request, Service xử lý DTO
- **Số file:** 17 files
- **File quan trọng nhất:** `TaoSanPhamDto.cs`

### Thư mục: `backend/PCZone.API/Data/`
- **Vai trò:** DbContext, Seed Data, Migration
- **Quan hệ:** Trung tâm kết nối database
- **Số file:** 8 files (1 DbContext, 1 SeedData.cs, 6 JSON)
- **File quan trọng nhất:** `UngDungDbContext.cs`

### Thư mục: `css/`
- **Vai trò:** Stylesheet cho toàn bộ frontend
- **Số file:** 5 files
- **File quan trọng nhất:** `style.css` - Style chính

### Thư mục: `js/`
- **Vai trò:** JavaScript cho toàn bộ frontend
- **Số file:** 15 files
- **File quan trọng nhất:** `api.js` - Kết nối backend API

### Thư mục: `README/`
- **Vai trò:** Tài liệu dự án
- **Số file:** 3 files
- **File quan trọng nhất:** `target.md`

---

# PHẦN 4: PHÂN TÍCH TỪNG FILE

## 4.1. BACKEND FILES

### 4.1.1. Program.cs
- **Đường dẫn:** `backend/PCZone.API/Program.cs`
- **Vai trò:** Entry point của ứng dụng, cấu hình toàn bộ hệ thống
- **Được dùng ở đâu:** Khởi chạy ứng dụng
- **Ai gọi:** .NET Runtime
- **File này gọi tới:** Tất cả Repository, Service, DbContext, Middleware
- **Quan hệ:** Trung tâm cấu hình DI, Middleware Pipeline
- **Đánh giá thiết kế:** Tốt, cấu trúc rõ ràng, có comment phân chia
- **Đề xuất cải tiến:**
  - Bỏ comment `app.UseAuthentication()` và `app.UseAuthorization()`
  - Thêm Exception Handling Middleware
  - Thêm Logging (Serilog)
  - Tách cấu hình ra file riêng nếu quá dài

### 4.1.2. UngDungDbContext.cs
- **Đường dẫn:** `backend/PCZone.API/Data/UngDungDbContext.cs`
- **Vai trò:** DbContext chính, định nghĩa DbSet và mapping
- **Được dùng ở đâu:** Tất cả Repository
- **File này gọi tới:** Tất cả Model entities
- **Quan hệ:** Bridge giữa code và database
- **Đánh giá thiết kế:** Tốt, có Fluent API mapping
- **Đề xuất cải tiến:** Thêm index cho các cột thường query (TenSanPham, Gia, MaCoupon)

### 4.1.3. SeedData.cs
- **Đường dẫn:** `backend/PCZone.API/Data/SeedData.cs`
- **Vai trò:** Khởi tạo dữ liệu mẫu
- **Được dùng ở đâu:** Program.cs gọi sau Migrate
- **File này gọi tới:** 6 file JSON trong SeedData/
- **Đánh giá thiết kế:** Tốt, dùng JSON file để dễ quản lý
- **Đề xuất cải tiến:** Kiểm tra dữ liệu đã tồn tại trước khi seed

### 4.1.4. appsettings.json
- **Đường dẫn:** `backend/PCZone.API/appsettings.json`
- **Vai trò:** Cấu hình ứng dụng
- **Nội dung chính:** ConnectionStrings, Jwt (Key, Issuer, Audience)
- **Đánh giá:** Thiếu cấu hình cho AI Service URL

### 4.1.5. .env
- **Đường dẫn:** `backend/PCZone.API/.env`
- **Vai trò:** Biến môi trường (AI API Key, JWT Key)
- **Đánh giá:** Tốt, không hardcode secret

### 4.1.6. PCZone.API.csproj
- **Đường dẫn:** `backend/PCZone.API/PCZone.API.csproj`
- **Vai trò:** File project, định nghĩa dependencies
- **Package chính:**
  - Microsoft.EntityFrameworkCore.SqlServer (8.0.11)
  - Microsoft.EntityFrameworkCore.Tools (8.0.11)
  - Microsoft.AspNetCore.Authentication.JwtBearer (8.0.11)
  - Swashbuckle.AspNetCore (6.6.2)
  - DotNetEnv (2.5.0)
  - System.Linq.Dynamic.Core (1.6.0.2)

## 4.2. MODEL FILES

### 4.2.1. SanPham.cs
- **Đường dẫn:** `backend/PCZone.API/Models/SanPham.cs`
- **Vai trò:** Entity sản phẩm trung tâm
- **Thuộc tính:** Id, TenSanPham, ThuongHieu, DanhMucId, Gia, GiaKhuyenMai, SoLuongTon, HinhAnh, TrangThai, MoTaNgan, ThongSoKyThuat, NgayTao
- **Navigation:** DanhMuc, ChiTietGioHangs, ChiTietDonHangs, DanhGias, ChiTietCauHinhs
- **Quan hệ:** N-1 với DanhMuc, 1-N với các bảng con

### 4.2.2. DanhMuc.cs
- **Đường dẫn:** `backend/PCZone.API/Models/DanhMuc.cs`
- **Vai trò:** Entity danh mục sản phẩm
- **Thuộc tính:** Id, TenDanhMuc, MoTa, HinhAnh
- **Navigation:** SanPhams
- **Quan hệ:** 1-N với SanPham

### 4.2.3. KhachHang.cs
- **Đường dẫn:** `backend/PCZone.API/Models/KhachHang.cs`
- **Vai trò:** Entity khách hàng
- **Thuộc tính:** Id, HoTen, Email, MatKhauHash, SoDienThoai, DiaChi, VaiTro, NgayTao
- **Navigation:** GioHangs, DonHangs, DanhGias, CauHinhs
- **Quan hệ:** 1-N với nhiều bảng

### 4.2.4. GioHang.cs
- **Đường dẫn:** `backend/PCZone.API/Models/GioHang.cs`
- **Vai trò:** Entity giỏ hàng
- **Thuộc tính:** Id, KhachHangId, NgayTao
- **Navigation:** KhachHang, ChiTietGioHangs
- **Quan hệ:** 1-1 với KhachHang, 1-N với ChiTietGioHang

### 4.2.5. ChiTietGioHang.cs
- **Đường dẫn:** `backend/PCZone.API/Models/ChiTietGioHang.cs`
- **Vai trò:** Chi tiết giỏ hàng (sản phẩm trong giỏ)
- **Thuộc tính:** Id, GioHangId, SanPhamId, SoLuong
- **Navigation:** GioHang, SanPham
- **Quan hệ:** N-1 với GioHang, N-1 với SanPham

### 4.2.6. DonHang.cs
- **Đường dẫn:** `backend/PCZone.API/Models/DonHang.cs`
- **Vai trò:** Entity đơn hàng
- **Thuộc tính:** Id, KhachHangId, NgayDat, TrangThai, TongTien, CouponId, MaCoupon, PhanTramGiam, TienGiam, PhiVanChuyen, ThanhTien, DiaChiGiao, GhiChu
- **Navigation:** KhachHang, Coupon, ChiTietDonHangs
- **Quan hệ:** N-1 với KhachHang, N-1 với Coupon, 1-N với ChiTietDonHang

### 4.2.7. ChiTietDonHang.cs
- **Đường dẫn:** `backend/PCZone.API/Models/ChiTietDonHang.cs`
- **Vai trò:** Chi tiết đơn hàng
- **Thuộc tính:** Id, DonHangId, SanPhamId, SoLuong, DonGia
- **Navigation:** DonHang, SanPham
- **Quan hệ:** N-1 với DonHang, N-1 với SanPham

### 4.2.8. DanhGia.cs
- **Đường dẫn:** `backend/PCZone.API/Models/DanhGia.cs`
- **Vai trò:** Entity đánh giá sản phẩm
- **Thuộc tính:** Id, SanPhamId, KhachHangId, SoSao, NoiDung, NgayTao
- **Navigation:** SanPham, KhachHang
- **Quan hệ:** N-1 với SanPham, N-1 với KhachHang

### 4.2.9. Coupon.cs
- **Đường dẫn:** `backend/PCZone.API/Models/Coupon.cs`
- **Vai trò:** Entity mã giảm giá
- **Thuộc tính:** Id, MaCoupon, MoTa, PhanTramGiam, SoTienGiamToiDa, DieuKienToiThieu, NgayBatDau, NgayHetHan, SoLuong, DaSuDung, DangHoatDong
- **Navigation:** DonHangs
- **Quan hệ:** 1-N với DonHang

### 4.2.10. CauHinh.cs
- **Đường dẫn:** `backend/PCZone.API/Models/CauHinh.cs`
- **Vai trò:** Entity cấu hình PC (Build PC)
- **Thuộc tính:** Id, Ten, KhachHangId, TongTien, MucDich, GhiChu, NgayTao, MaChiaSe
- **Navigation:** KhachHang, ChiTietCauHinhs
- **Quan hệ:** N-1 với KhachHang, 1-N với ChiTietCauHinh

### 4.2.11. ChiTietCauHinh.cs
- **Đường dẫn:** `backend/PCZone.API/Models/ChiTietCauHinh.cs`
- **Vai trò:** Chi tiết cấu hình (linh kiện trong build)
- **Thuộc tính:** Id, CauHinhId, SanPhamId, SoLuong
- **Navigation:** CauHinh, SanPham
- **Quan hệ:** N-1 với CauHinh, N-1 với SanPham

## 4.3. CONTROLLER FILES

### 4.3.1. SanPhamController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/SanPhamController.cs`
- **Vai trò:** API cho sản phẩm
- **Route:** `api/SanPham`
- **Endpoints:** GET (all, byId, byDanhMuc), POST, PUT, DELETE
- **Dependency:** ISanPhamService

### 4.3.2. DanhMucController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/DanhMucController.cs`
- **Vai trò:** API cho danh mục
- **Route:** `api/DanhMuc`
- **Endpoints:** GET (all, byId), POST, PUT, DELETE
- **Dependency:** IDanhMucService

### 4.3.3. KhachHangController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/KhachHangController.cs`
- **Vai trò:** API cho khách hàng (đăng ký, cập nhật)
- **Route:** `api/KhachHang`
- **Endpoints:** POST (register), GET (byId), PUT, DELETE
- **Dependency:** IKhachHangService

### 4.3.4. DangNhapController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/DangNhapController.cs`
- **Vai trò:** API đăng nhập, trả JWT token
- **Route:** `api/DangNhap`
- **Endpoints:** POST (login)
- **Dependency:** IDangNhapService

### 4.3.5. GioHangController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/GioHangController.cs`
- **Vai trò:** API giỏ hàng
- **Route:** `api/GioHang`
- **Endpoints:** GET (byKhachHangId), POST (add), PUT (update), DELETE (remove)
- **Dependency:** IGioHangService

### 4.3.6. DonHangController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/DonHangController.cs`
- **Vai trò:** API đơn hàng
- **Route:** `api/DonHang`
- **Endpoints:** GET (byKhachHangId, byId), POST, PUT (cancel)
- **Dependency:** IDonHangService

### 4.3.7. DanhGiaController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/DanhGiaController.cs`
- **Vai trò:** API đánh giá sản phẩm
- **Route:** `api/DanhGia`
- **Endpoints:** GET (bySanPhamId), POST, PUT, DELETE
- **Dependency:** IDanhGiaService

### 4.3.8. CouponController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/CouponController.cs`
- **Vai trò:** API mã giảm giá
- **Route:** `api/Coupon`
- **Endpoints:** GET (all, byId, byMa), POST, PUT, DELETE
- **Dependency:** ICouponService

### 4.3.9. AdminController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/AdminController.cs`
- **Vai trò:** API quản trị
- **Route:** `api/Admin`
- **Endpoints:** GET (orders, dashboard), PUT (order status)
- **Authorize:** [Authorize(Roles = "Admin")]
- **Dependency:** IDonHangService, IDashboardService

### 4.3.10. DashboardController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/DashboardController.cs`
- **Vai trò:** API thống kê dashboard
- **Route:** `api/Dashboard`
- **Endpoints:** GET (thongKe)
- **Dependency:** IDashboardService

### 4.3.11. AIController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/AIController.cs`
- **Vai trò:** API AI tư vấn
- **Route:** `api/AI`
- **Endpoints:** POST (chat, tu-van-build)
- **Dependency:** IAIService

### 4.3.12. BuildPCController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/BuildPCController.cs`
- **Vai trò:** API Build PC
- **Route:** `api/BuildPC`
- **Endpoints:** GET (all, byId, byMaChiaSe, byKhachHang), POST, PUT, DELETE, POST (kiem-tra-tuong-thich)
- **Dependency:** IBuildPCService

### 4.3.13. UploadController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/UploadController.cs`
- **Vai trò:** API upload file (hình ảnh)
- **Route:** `api/Upload`
- **Endpoints:** POST (upload image)
- **Dependency:** IWebHostEnvironment

### 4.3.14. TestController.cs
- **Đường dẫn:** `backend/PCZone.API/Controllers/TestController.cs`
- **Vai trò:** Kiểm tra kết nối
- **Route:** `api/Test`
- **Endpoints:** GET (test)
- **Ghi chú:** File rỗng hoặc chỉ có test cơ bản

## 4.4. SERVICE FILES

### 4.4.1. SanPhamService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/SanPhamService.cs`
- **Vai trò:** Xử lý nghiệp vụ sản phẩm
- **Interface:** ISanPhamService
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByDanhMucAsync, CreateAsync, UpdateAsync, DeleteAsync
- **Gọi Repository:** ISanPhamRepository, IDanhMucRepository

### 4.4.2. DanhMucService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/DanhMucService.cs`
- **Vai trò:** Xử lý nghiệp vụ danh mục
- **Interface:** IDanhMucService
- **Các hàm:** GetAllAsync, GetByIdAsync, CreateAsync, UpdateAsync, DeleteAsync
- **Gọi Repository:** IDanhMucRepository

### 4.4.3. KhachHangService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/KhachHangService.cs`
- **Vai trò:** Xử lý nghiệp vụ khách hàng
- **Interface:** IKhachHangService
- **Các hàm:** DangKyAsync, GetByIdAsync, UpdateAsync, DeleteAsync
- **Gọi Repository:** IKhachHangRepository

### 4.4.4. DangNhapService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/DangNhapService.cs`
- **Vai trò:** Xử lý đăng nhập, tạo JWT token
- **Interface:** IDangNhapService
- **Các hàm:** DangNhapAsync
- **Gọi Repository:** IKhachHangRepository
- **Đặc biệt:** Tạo JWT token với claims (id, email, role)

### 4.4.5. GioHangService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/GioHangService.cs`
- **Vai trò:** Xử lý nghiệp vụ giỏ hàng
- **Interface:** IGioHangService
- **Các hàm:** GetByKhachHangIdAsync, AddAsync, UpdateAsync, RemoveAsync
- **Gọi Repository:** IGioHangRepository, ISanPhamRepository

### 4.4.6. DonHangService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/DonHangService.cs`
- **Vai trò:** Xử lý nghiệp vụ đơn hàng
- **Interface:** IDonHangService
- **Các hàm:** GetByKhachHangIdAsync, GetByIdAsync, CreateAsync, CancelAsync, GetAllAsync, UpdateTrangThaiAsync
- **Gọi Repository:** IDonHangRepository, IGioHangRepository, ICouponRepository

### 4.4.7. DanhGiaService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/DanhGiaService.cs`
- **Vai trò:** Xử lý nghiệp vụ đánh giá
- **Interface:** IDanhGiaService
- **Các hàm:** GetBySanPhamIdAsync, CreateAsync, UpdateAsync, DeleteAsync
- **Gọi Repository:** IDanhGiaRepository

### 4.4.8. CouponService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/CouponService.cs`
- **Vai trò:** Xử lý nghiệp vụ coupon
- **Interface:** ICouponService
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByMaAsync, CreateAsync, UpdateAsync, DeleteAsync
- **Gọi Repository:** ICouponRepository

### 4.4.9. DashboardService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/DashboardService.cs`
- **Vai trò:** Thống kê dashboard
- **Interface:** IDashboardService
- **Các hàm:** GetThongKeAsync
- **Gọi Repository:** IDonHangRepository, ISanPhamRepository, IKhachHangRepository

### 4.4.10. AIService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/AIService.cs`
- **Vai trò:** Gọi API AI bên ngoài (Google Gemini)
- **Interface:** IAIService
- **Các hàm:** ChatAsync, TuVanBuildAsync
- **Gọi:** HttpClient (gọi API Gemini)
- **Đặc biệt:** Dùng HttpClientFactory, đọc API key từ .env

### 4.4.11. BuildPCService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/BuildPCService.cs`
- **Vai trò:** Xử lý nghiệp vụ Build PC
- **Interface:** IBuildPCService
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByMaChiaSeAsync, GetByKhachHangAsync, CreateAsync, UpdateAsync, DeleteAsync, KiemTraTuongThichAsync
- **Gọi Repository:** ICauHinhRepository, ISanPhamRepository

### 4.4.12. ThanhToanService.cs
- **Đường dẫn:** `backend/PCZone.API/Services/ThanhToanService.cs`
- **Vai trò:** Xử lý thanh toán
- **Trạng thái:** **FILE RỖNG (0 bytes)** - Chưa triển khai

## 4.5. REPOSITORY FILES

### 4.5.1. SanPhamRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/SanPhamRepository.cs`
- **Vai trò:** CRUD sản phẩm
- **Interface:** ISanPhamRepository
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByDanhMucAsync, AddAsync, UpdateAsync, DeleteAsync
- **Query đặc biệt:** Include DanhMuc, OrderByDescending NgayTao

### 4.5.2. DanhMucRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/DanhMucRepository.cs`
- **Vai trò:** CRUD danh mục
- **Interface:** IDanhMucRepository
- **Các hàm:** GetAllAsync, GetByIdAsync, AddAsync, UpdateAsync, DeleteAsync

### 4.5.3. KhachHangRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/KhachHangRepository.cs`
- **Vai trò:** CRUD khách hàng
- **Interface:** IKhachHangRepository
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByEmailAsync, AddAsync, UpdateAsync, DeleteAsync

### 4.5.4. GioHangRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/GioHangRepository.cs`
- **Vai trò:** CRUD giỏ hàng
- **Interface:** IGioHangRepository
- **Các hàm:** GetByKhachHangIdAsync, GetByIdAsync, AddAsync, UpdateAsync, DeleteAsync, LuuAsync
- **Query đặc biệt:** Include ChiTietGioHangs → SanPham

### 4.5.5. DonHangRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/DonHangRepository.cs`
- **Vai trò:** CRUD đơn hàng
- **Interface:** IDonHangRepository
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByKhachHangIdAsync, AddAsync, UpdateAsync, DeleteAsync
- **Query đặc biệt:** Include KhachHang, ChiTietDonHangs → SanPham

### 4.5.6. DanhGiaRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/DanhGiaRepository.cs`
- **Vai trò:** CRUD đánh giá
- **Interface:** IDanhGiaRepository
- **Các hàm:** GetBySanPhamIdAsync, GetByIdAsync, AddAsync, UpdateAsync, DeleteAsync

### 4.5.7. CouponRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/CouponRepository.cs`
- **Vai trò:** CRUD coupon
- **Interface:** ICouponRepository
- **Các hàm:** GetAllAsync, GetByIdAsync, GetByMaAsync, AddAsync, UpdateAsync, DeleteAsync

### 4.5.8. CauHinhRepository.cs
- **Đường dẫn:** `backend/PCZone.API/Repositories/CauHinhRepository.cs`
- **Vai trò:** CRUD cấu hình Build PC
- **Interface:** ICauHinhRepository
- **Các hàm:** LayTatCaAsync, LayTheoIdAsync, LayTheoMaChiaSeAsync, LayTheoKhachHangAsync, ThemAsync, CapNhatAsync, XoaAsync, LuuAsync
- **Query đặc biệt:** Include ChiTietCauHinhs → SanPham

## 4.6. DTO FILES

### 4.6.1. TaoSanPhamDto.cs
- **Vai trò:** DTO tạo sản phẩm mới
- **Validation:** [Required] cho TenSanPham, Gia, DanhMucId; [Range] cho Gia, SoLuongTon

### 4.6.2. CapNhatSanPhamDto.cs
- **Vai trò:** DTO cập nhật sản phẩm
- **Validation:** Tương tự TaoSanPhamDto

### 4.6.3. TaoDanhMucDto.cs
- **Vai trò:** DTO tạo danh mục
- **Validation:** [Required] [StringLength(100, Min=2)] TenDanhMuc

### 4.6.4. CapNhatDanhMucDto.cs
- **Vai trò:** DTO cập nhật danh mục
- **Validation:** Tương tự TaoDanhMucDto

### 4.6.5. ThemGioHangDto.cs
- **Vai trò:** DTO thêm vào giỏ hàng
- **Thuộc tính:** KhachHangId, SanPhamId, SoLuong

### 4.6.6. CapNhatGioHangDto.cs
- **Vai trò:** DTO cập nhật giỏ hàng
- **Thuộc tính:** SoLuong

### 4.6.7. TaoDonHangDto.cs
- **Vai trò:** DTO tạo đơn hàng
- **Thuộc tính:** KhachHangId, DiaChiGiao, GhiChu, MaCoupon (optional), CacSanPham (List<ChiTietDonHangDto>)

### 4.6.8. CapNhatTrangThaiDto.cs
- **Vai trò:** DTO cập nhật trạng thái đơn hàng
- **Thuộc tính:** TrangThai (string)

### 4.6.9. TaoDanhGiaDto.cs
- **Vai trò:** DTO tạo đánh giá
- **Validation:** [Range(1,5)] SoSao, [Required] NoiDung

### 4.6.10. CapNhatDanhGiaDto.cs
- **Vai trò:** DTO cập nhật đánh giá
- **Validation:** Tương tự TaoDanhGiaDto

### 4.6.11. TaoCouponDto.cs
- **Vai trò:** DTO tạo coupon
- **Validation:** [Required] MaCoupon, [Range(1,100)] PhanTramGiam

### 4.6.12. CapNhatCouponDto.cs
- **Vai trò:** DTO cập nhật coupon
- **Validation:** Tương tự TaoCouponDto

### 4.6.13. DangKyDto.cs
- **Vai trò:** DTO đăng ký tài khoản
- **Validation:** [Required] [EmailAddress] Email, [Required] [MinLength(6)] MatKhau

### 4.6.14. DangNhapDto.cs
- **Vai trò:** DTO đăng nhập
- **Thuộc tính:** Email, MatKhau

### 4.6.15. CapNhatKhachHangDto.cs
- **Vai trò:** DTO cập nhật thông tin khách hàng
- **Thuộc tính:** HoTen, SoDienThoai, DiaChi

### 4.6.16. KiemTraTuongThichDto.cs
- **Vai trò:** DTO kiểm tra tương thích linh kiện
- **Thuộc tính:** SanPhamIds (List<int>)

## 4.7. FRONTEND FILES

### 4.7.1. main+ds+sp.html (Trang chủ)
- **Vai trò:** Trang chủ chính, hiển thị danh sách sản phẩm
- **Sections:** Navbar, Banner slider, Danh mục, Sản phẩm nổi bật, Footer
- **Scripts:** js/api.js, js/data-products.js, js/cart.js, js/search.js, js/loginbaner.js
- **CSS:** css/style.css

### 4.7.2. admin.html (Trang quản trị)
- **Vai trò:** Admin panel
- **Sections:** Header, Sidebar, Main content (dashboard, products, orders, customers, reviews, coupons, builds, warehouse, settings)
- **Scripts:** js/data-products.js, js/data-customers.js, js/ADMIN.JS
- **CSS:** css/ADMIN.CSS

### 4.7.3. buildpc.html (Build PC)
- **Vai trò:** Công cụ xây dựng cấu hình PC
- **Sections:** Chọn linh kiện theo slot (CPU, Mainboard, RAM, VGA, SSD, HDD, PSU, Case, Monitor, Keyboard, Mouse), Kiểm tra tương thích, Tổng tiền
- **Scripts:** js/buildpc.js, js/ai-chat.js
- **CSS:** css/BUILDPC.css

### 4.7.4. chi-tiet-sp.html (Chi tiết sản phẩm)
- **Vai trò:** Xem chi tiết sản phẩm
- **Scripts:** js/chi-tiet.js, js/cart.js
- **CSS:** css/chi-tiet.css

### 4.7.5. gio-hang.html (Giỏ hàng)
- **Vai trò:** Quản lý giỏ hàng
- **Scripts:** js/cart.js
- **CSS:** css/style.css

### 4.7.6. thanh-toan.html (Thanh toán)
- **Vai trò:** Trang thanh toán
- **Scripts:** js/thanh toan.js
- **CSS:** css/thanh-toan.css

### 4.7.7. so-sanh-sp.html (So sánh sản phẩm)
- **Vai trò:** So sánh 2 sản phẩm
- **Scripts:** js/so-sanh.js
- **CSS:** css/style.css

### 4.7.8. best-sellers.html (Bán chạy)
- **Vai trò:** Sản phẩm bán chạy
- **Scripts:** js/best-sellers.js, js/data-products.js
- **CSS:** css/style.css

### 4.7.9. fps-calculator.html (Tính FPS)
- **Vai trò:** Tính toán FPS cho game
- **Scripts:** js/fps-calculator.js
- **CSS:** css/style.css

### 4.7.10. don-mua.html (Đơn mua)
- **Vai trò:** Xem lịch sử đơn hàng
- **Scripts:** js/cart.js
- **CSS:** css/style.css

### 4.7.11. qr-payment.html (QR Payment)
- **Vai trò:** Hiển thị mã QR thanh toán
- **CSS:** css/style.css

### 4.7.12-16. Các trang danh mục (gpu.html, laptop.html, man-hinh.html, peripherals.html, pc-bo-mixi.html)
- **Vai trò:** Trang danh mục sản phẩm theo loại
- **Scripts:** js/data-products.js, js/cart.js
- **CSS:** css/style.css

## 4.8. JAVASCRIPT FILES

### 4.8.1. api.js (257 dòng)
- **Vai trò:** API client kết nối backend ASP.NET Core
- **Base URL:** `https://localhost:5000/api`
- **Token:** Lấy từ localStorage('token')
- **Các hàm chính:**
  - `apiGet(url)`, `apiPost(url, data)`, `apiPut(url, data)`, `apiDelete(url)`
  - `getProducts()`, `getProduct(id)`, `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`
  - `getCategories()`, `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)`
  - `getCart(khachHangId)`, `addToCart(data)`, `updateCart(id, data)`, `removeFromCart(id)`
  - `createOrder(data)`, `getOrders(khachHangId)`, `cancelOrder(id)`
  - `getReviews(sanPhamId)`, `createReview(data)`, `updateReview(id, data)`, `deleteReview(id)`
  - `getCoupons()`, `createCoupon(data)`, `updateCoupon(id, data)`, `deleteCoupon(id)`
  - `getCustomers()`, `register(data)`, `login(data)`, `updateCustomer(id, data)`, `deleteCustomer(id)`
  - `getDashboard()`
  - `aiChat(message)`, `aiTuVanBuild(message)`
  - `uploadImage(file)`

### 4.8.2. ADMIN.JS (1283 dòng)
- **Vai trò:** Logic admin panel
- **Các hàm chính:**
  - `renderDashboard()` - Thống kê dashboard
  - `renderProducts()` - Quản lý sản phẩm
  - `renderOrders()` - Quản lý đơn hàng
  - `renderCustomers()` - Quản lý khách hàng
  - `renderReviews()` - Quản lý đánh giá
  - `renderCoupons()` - Quản lý coupon
  - `renderBuilds()` - Quản lý cấu hình
  - `renderWarehouse()` - Quản lý kho
  - `renderSettings()` - Cài đặt
  - `showAddProductModal()`, `showEditProductModal(id)` - Modal sản phẩm
  - `saveProduct()` - Lưu sản phẩm
  - `deleteProduct(id)` - Xóa sản phẩm
  - `updateOrderStatus(id, status)` - Cập nhật trạng thái đơn
  - `renderChart()` - Vẽ biểu đồ (Chart.js)
- **Dữ liệu:** Dùng localStorage (data-products.js, data-customers.js)

### 4.8.3. cart.js (khoảng 400 dòng)
- **Vai trò:** Quản lý giỏ hàng frontend
- **Các hàm chính:**
  - `addToCart(product)` - Thêm vào giỏ (localStorage)
  - `removeFromCart(id)` - Xóa khỏi giỏ
  - `updateQuantity(id, qty)` - Cập nhật số lượng
  - `getCart()` - Lấy giỏ hàng
  - `getCartCount()` - Đếm số lượng
  - `renderCart()` - Hiển thị giỏ hàng
  - `clearCart()` - Xóa giỏ hàng
  - `checkout()` - Thanh toán

### 4.8.4. buildpc.js (724 dòng)
- **Vai trò:** Logic Build PC configurator
- **Các hàm chính:**
  - `renderBuildPC()` - Render giao diện build
  - `selectComponent(slot, product)` - Chọn linh kiện
  - `removeComponent(slot)` - Bỏ linh kiện
  - `checkCompatibility()` - Kiểm tra tương thích
  - `calculateTotal()` - Tính tổng tiền
  - `saveBuild()` - Lưu cấu hình
  - `shareBuild()` - Chia sẻ cấu hình
  - `loadBuild(id)` - Tải cấu hình

### 4.8.5. ai-chat.js (260 dòng)
- **Vai trò:** AI Chat popup cho Build PC
- **Các hàm chính:**
  - `toggleChat()` - Mở/đóng chat
  - `sendMessage()` - Gửi tin nhắn
  - `generateResponse(userInput)` - Tạo phản hồi (dùng template)
  - `addMessage(text, isUser)` - Thêm tin nhắn vào chat

### 4.8.6. chi-tiet.js (khoảng 300 dòng)
- **Vai trò:** Logic trang chi tiết sản phẩm
- **Các hàm chính:**
  - `loadProductDetail(id)` - Tải chi tiết sản phẩm
  - `renderProductDetail(product)` - Render chi tiết
  - `loadRelatedProducts(categoryId)` - Tải sản phẩm liên quan

### 4.8.7. search.js (khoảng 150 dòng)
- **Vai trò:** Tìm kiếm sản phẩm
- **Các hàm chính:**
  - `searchProducts(keyword)` - Tìm kiếm
  - `renderSearchResults(results)` - Hiển thị kết quả
  - `filterByPrice(min, max)` - Lọc theo giá

### 4.8.8. so-sanh.js (khoảng 200 dòng)
- **Vai trò:** So sánh sản phẩm
- **Các hàm chính:**
  - `addToCompare(product)` - Thêm vào so sánh
  - `removeFromCompare(id)` - Xóa khỏi so sánh
  - `renderCompare()` - Hiển thị so sánh

### 4.8.9. best-sellers.js (428 dòng)
- **Vai trò:** Logic trang bán chạy
- **Các hàm chính:**
  - `renderBestSellers()` - Render sản phẩm bán chạy
  - `filterProducts(filters)` - Lọc sản phẩm
  - `sortProducts(sortBy)` - Sắp xếp

### 4.8.10. fps-calculator.js (khoảng 250 dòng)
- **Vai trò:** Tính FPS cho game
- **Các hàm chính:**
  - `calculateFPS(cpu, gpu, game)` - Tính FPS
  - `renderFPSResult(result)` - Hiển thị kết quả

### 4.8.11. data-products.js (khoảng 500 dòng)
- **Vai trò:** Dữ liệu sản phẩm giả (dùng cho frontend khi chưa kết nối backend)
- **Nội dung:** Mảng ALL_PRODUCTS chứa ~50+ sản phẩm mẫu

### 4.8.12. data-customers.js (khoảng 100 dòng)
- **Vai trò:** Dữ liệu khách hàng giả
- **Nội dung:** Mảng ALL_CUSTOMERS chứa ~10 khách hàng mẫu

### 4.8.13. loginbaner.js (khoảng 100 dòng)
- **Vai trò:** Xử lý đăng nhập/đăng xuất trên banner
- **Các hàm chính:**
  - `checkLoginStatus()` - Kiểm tra trạng thái đăng nhập
  - `renderLoginBanner()` - Render banner đăng nhập

### 4.8.14. testweb2.js (khoảng 50 dòng)
- **Vai trò:** Test JavaScript cơ bản

### 4.8.15. thanh toan.js (khoảng 200 dòng)
- **Vai trò:** Logic trang thanh toán
- **Các hàm chính:**
  - `renderPaymentPage()` - Render trang thanh toán
  - `processPayment(method)` - Xử lý thanh toán
  - `applyCoupon(code)` - Áp dụng mã giảm giá

## 4.9. CSS FILES

### 4.9.1. style.css (khoảng 2000+ dòng)
- **Vai trò:** Style chính cho toàn bộ frontend
- **Nội dung:** Reset CSS, Navbar, Banner, Product grid, Product card, Footer, Responsive, Animations

### 4.9.2. ADMIN.CSS (837 dòng)
- **Vai trò:** Style cho admin panel
- **Nội dung:** Admin layout, Sidebar, Dashboard stats, Charts, Tables, Modals, Forms, Responsive

### 4.9.3. BUILDPC.css (khoảng 500 dòng)
- **Vai trò:** Style cho trang Build PC
- **Nội dung:** Component slots, Compatibility check, Price summary

### 4.9.4. chi-tiet.css (khoảng 300 dòng)
- **Vai trò:** Style cho trang chi tiết sản phẩm
- **Nội dung:** Product images, Specifications, Reviews

### 4.9.5. thanh-toan.css (khoảng 200 dòng)
- **Vai trò:** Style cho trang thanh toán
- **Nội dung:** Payment form, Order summary

---

# PHẦN 5: CONTROLLER

## 5.1. SanPhamController
- **Route:** `api/SanPham`
- **Dependency:** ISanPhamService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/SanPham` | - | List<SanPham> | 200 |
| GET | `/api/SanPham/{id}` | id (int) | SanPham | 200/404 |
| GET | `/api/SanPham/danhmuc/{danhMucId}` | danhMucId (int) | List<SanPham> | 200 |
| POST | `/api/SanPham` | TaoSanPhamDto | SanPham | 201/400 |
| PUT | `/api/SanPham/{id}` | id, CapNhatSanPhamDto | IActionResult | 200/400/404 |
| DELETE | `/api/SanPham/{id}` | id (int) | IActionResult | 200/404 |

## 5.2. DanhMucController
- **Route:** `api/DanhMuc`
- **Dependency:** IDanhMucService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/DanhMuc` | - | List<DanhMuc> | 200 |
| GET | `/api/DanhMuc/{id}` | id (int) | DanhMuc | 200/404 |
| POST | `/api/DanhMuc` | TaoDanhMucDto | DanhMuc | 201/400 |
| PUT | `/api/DanhMuc/{id}` | id, CapNhatDanhMucDto | IActionResult | 200/400/404 |
| DELETE | `/api/DanhMuc/{id}` | id (int) | IActionResult | 200/404 |

## 5.3. KhachHangController
- **Route:** `api/KhachHang`
- **Dependency:** IKhachHangService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| POST | `/api/KhachHang/dang-ky` | DangKyDto | IActionResult | 200/400 |
| GET | `/api/KhachHang/{id}` | id (int) | KhachHang | 200/404 |
| PUT | `/api/KhachHang/{id}` | id, CapNhatKhachHangDto | IActionResult | 200/400/404 |
| DELETE | `/api/KhachHang/{id}` | id (int) | IActionResult | 200/404 |

## 5.4. DangNhapController
- **Route:** `api/DangNhap`
- **Dependency:** IDangNhapService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| POST | `/api/DangNhap` | DangNhapDto | { token, khachHang } | 200/401 |

## 5.5. GioHangController
- **Route:** `api/GioHang`
- **Dependency:** IGioHangService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/GioHang/{khachHangId}` | khachHangId (int) | GioHang | 200/404 |
| POST | `/api/GioHang` | ThemGioHangDto | ChiTietGioHang | 201/400 |
| PUT | `/api/GioHang/{id}` | id, CapNhatGioHangDto | IActionResult | 200/400/404 |
| DELETE | `/api/GioHang/{id}` | id (int) | IActionResult | 200/404 |

## 5.6. DonHangController
- **Route:** `api/DonHang`
- **Dependency:** IDonHangService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/DonHang/khach-hang/{khachHangId}` | khachHangId (int) | List<DonHang> | 200 |
| GET | `/api/DonHang/{id}` | id (int) | DonHang | 200/404 |
| POST | `/api/DonHang` | TaoDonHangDto | DonHang | 201/400 |
| PUT | `/api/DonHang/{id}/huy` | id (int) | IActionResult | 200/400/404 |

## 5.7. DanhGiaController
- **Route:** `api/DanhGia`
- **Dependency:** IDanhGiaService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/DanhGia/san-pham/{sanPhamId}` | sanPhamId (int) | List<DanhGia> | 200 |
| POST | `/api/DanhGia` | TaoDanhGiaDto | DanhGia | 201/400 |
| PUT | `/api/DanhGia/{id}` | id, CapNhatDanhGiaDto | IActionResult | 200/400/404 |
| DELETE | `/api/DanhGia/{id}` | id (int) | IActionResult | 200/404 |

## 5.8. CouponController
- **Route:** `api/Coupon`
- **Dependency:** ICouponService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/Coupon` | - | List<Coupon> | 200 |
| GET | `/api/Coupon/{id}` | id (int) | Coupon | 200/404 |
| GET | `/api/Coupon/ma/{maCoupon}` | maCoupon (string) | Coupon | 200/404 |
| POST | `/api/Coupon` | TaoCouponDto | Coupon | 201/400 |
| PUT | `/api/Coupon/{id}` | id, CapNhatCouponDto | IActionResult | 200/400/404 |
| DELETE | `/api/Coupon/{id}` | id (int) | IActionResult | 200/404 |

## 5.9. AdminController
- **Route:** `api/Admin`
- **Dependency:** IDonHangService, IDashboardService
- **Authorize:** [Authorize(Roles = "Admin")]

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/Admin/orders` | - | List<DonHang> | 200 |
| PUT | `/api/Admin/orders/{id}/status` | id, CapNhatTrangThaiDto | IActionResult | 200/404 |
| GET | `/api/Admin/dashboard` | - | DashboardDto | 200 |

## 5.10. DashboardController
- **Route:** `api/Dashboard`
- **Dependency:** IDashboardService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/Dashboard/thong-ke` | - | DashboardDto | 200 |

## 5.11. AIController
- **Route:** `api/AI`
- **Dependency:** IAIService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| POST | `/api/AI/chat` | { message } | { response } | 200 |
| POST | `/api/AI/tu-van-build` | { message } | { response } | 200 |

## 5.12. BuildPCController
- **Route:** `api/BuildPC`
- **Dependency:** IBuildPCService

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| GET | `/api/BuildPC` | - | List<CauHinh> | 200 |
| GET | `/api/BuildPC/{id}` | id (int) | CauHinh | 200/404 |
| GET | `/api/BuildPC/ma-chia-se/{maChiaSe}` | maChiaSe (string) | CauHinh | 200/404 |
| GET | `/api/BuildPC/khach-hang/{khachHangId}` | khachHangId (int) | List<CauHinh> | 200 |
| POST | `/api/BuildPC` | CauHinh | CauHinh | 201 |
| PUT | `/api/BuildPC/{id}` | id, CauHinh | IActionResult | 200/404 |
| DELETE | `/api/BuildPC/{id}` | id (int) | IActionResult | 200/404 |
| POST | `/api/BuildPC/kiem-tra-tuong-thich` | KiemTraTuongThichDto | { result } | 200 |

## 5.13. UploadController
- **Route:** `api/Upload`
- **Dependency:** IWebHostEnvironment

| Method | Endpoint | Input | Output | Status Code |
|--------|----------|-------|--------|-------------|
| POST | `/api/Upload/image` | IFormFile | { url } | 200/400 |

---

# PHẦN 6: SERVICE

## 6.1. SanPhamService
- **Interface:** ISanPhamService
- **Repository:** ISanPhamRepository, IDanhMucRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetAllAsync | - | Task<List<SanPham>> | Lấy tất cả sản phẩm |
| GetByIdAsync | int id | Task<SanPham?> | Lấy sản phẩm theo ID |
| GetByDanhMucAsync | int danhMucId | Task<List<SanPham>> | Lấy sản phẩm theo danh mục |
| CreateAsync | TaoSanPhamDto dto | Task<SanPham> | Tạo sản phẩm mới |
| UpdateAsync | int id, CapNhatSanPhamDto dto | Task<bool> | Cập nhật sản phẩm |
| DeleteAsync | int id | Task<bool> | Xóa sản phẩm |

## 6.2. DanhMucService
- **Interface:** IDanhMucService
- **Repository:** IDanhMucRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetAllAsync | - | Task<List<DanhMuc>> | Lấy tất cả danh mục |
| GetByIdAsync | int id | Task<DanhMuc?> | Lấy danh mục theo ID |
| CreateAsync | TaoDanhMucDto dto | Task<DanhMuc> | Tạo danh mục mới |
| UpdateAsync | int id, CapNhatDanhMucDto dto | Task<bool> | Cập nhật danh mục |
| DeleteAsync | int id | Task<bool> | Xóa danh mục |

## 6.3. KhachHangService
- **Interface:** IKhachHangService
- **Repository:** IKhachHangRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| DangKyAsync | DangKyDto dto | Task<KhachHang> | Đăng ký tài khoản (hash password) |
| GetByIdAsync | int id | Task<KhachHang?> | Lấy thông tin khách hàng |
| UpdateAsync | int id, CapNhatKhachHangDto dto | Task<bool> | Cập nhật thông tin |
| DeleteAsync | int id | Task<bool> | Xóa tài khoản |

## 6.4. DangNhapService
- **Interface:** IDangNhapService
- **Repository:** IKhachHangRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| DangNhapAsync | DangNhapDto dto | Task<(string token, KhachHang? khachHang)> | Đăng nhập, trả JWT token |

## 6.5. GioHangService
- **Interface:** IGioHangService
- **Repository:** IGioHangRepository, ISanPhamRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetByKhachHangIdAsync | int khachHangId | Task<GioHang?> | Lấy giỏ hàng của khách |
| AddAsync | ThemGioHangDto dto | Task<ChiTietGioHang> | Thêm sản phẩm vào giỏ |
| UpdateAsync | int id, CapNhatGioHangDto dto | Task<bool> | Cập nhật số lượng |
| RemoveAsync | int id | Task<bool> | Xóa sản phẩm khỏi giỏ |

## 6.6. DonHangService
- **Interface:** IDonHangService
- **Repository:** IDonHangRepository, IGioHangRepository, ICouponRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetByKhachHangIdAsync | int khachHangId | Task<List<DonHang>> | Lấy đơn hàng của khách |
| GetByIdAsync | int id | Task<DonHang?> | Lấy đơn hàng theo ID |
| CreateAsync | TaoDonHangDto dto | Task<DonHang> | Tạo đơn hàng mới (xử lý coupon, xóa giỏ hàng) |
| CancelAsync | int id | Task<bool> | Hủy đơn hàng |
| GetAllAsync | - | Task<List<DonHang>> | Lấy tất cả đơn hàng (admin) |
| UpdateTrangThaiAsync | int id, string trangThai | Task<bool> | Cập nhật trạng thái (admin) |

## 6.7. DanhGiaService
- **Interface:** IDanhGiaService
- **Repository:** IDanhGiaRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetBySanPhamIdAsync | int sanPhamId | Task<List<DanhGia>> | Lấy đánh giá theo sản phẩm |
| CreateAsync | TaoDanhGiaDto dto | Task<DanhGia> | Tạo đánh giá mới |
| UpdateAsync | int id, CapNhatDanhGiaDto dto | Task<bool> | Cập nhật đánh giá |
| DeleteAsync | int id | Task<bool> | Xóa đánh giá |

## 6.8. CouponService
- **Interface:** ICouponService
- **Repository:** ICouponRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetAllAsync | - | Task<List<Coupon>> | Lấy tất cả coupon |
| GetByIdAsync | int id | Task<Coupon?> | Lấy coupon theo ID |
| GetByMaAsync | string maCoupon | Task<Coupon?> | Lấy coupon theo mã |
| CreateAsync | TaoCouponDto dto | Task<Coupon> | Tạo coupon mới |
| UpdateAsync | int id, CapNhatCouponDto dto | Task<bool> | Cập nhật coupon |
| DeleteAsync | int id | Task<bool> | Xóa coupon |

## 6.9. DashboardService
- **Interface:** IDashboardService
- **Repository:** IDonHangRepository, ISanPhamRepository, IKhachHangRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetThongKeAsync | - | Task<DashboardDto> | Thống kê tổng quan (đơn hàng, doanh thu, sản phẩm, khách hàng) |

## 6.10. AIService
- **Interface:** IAIService
- **Gọi:** HttpClient (Google Gemini API)

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| ChatAsync | string message | Task<string> | Chat với AI |
| TuVanBuildAsync | string message | Task<string> | Tư vấn cấu hình PC |

## 6.11. BuildPCService
- **Interface:** IBuildPCService
- **Repository:** ICauHinhRepository, ISanPhamRepository

| Hàm | Tham số | Trả về | Chức năng |
|-----|---------|--------|-----------|
| GetAllAsync | - | Task<List<CauHinh>> | Lấy tất cả cấu hình |
| GetByIdAsync | int id | Task<CauHinh?> | Lấy cấu hình theo ID |
| GetByMaChiaSeAsync | string maChiaSe | Task<CauHinh?> | Lấy cấu hình theo mã chia sẻ |
| GetByKhachHangAsync | int khachHangId | Task<List<CauHinh>> | Lấy cấu hình của khách |
| CreateAsync | CauHinh cauHinh | Task<CauHinh> | Tạo cấu hình mới |
| UpdateAsync | int id, CauHinh cauHinh | Task<bool> | Cập nhật cấu hình |
| DeleteAsync | int id | Task<bool> | Xóa cấu hình |
| KiemTraTuongThichAsync | List<int> sanPhamIds | Task<object> | Kiểm tra tương thích linh kiện |

## 6.12. ThanhToanService
- **Trạng thái:** FILE RỖNG - Chưa triển khai

---

# PHẦN 7: REPOSITORY

## 7.1. SanPhamRepository
- **Interface:** ISanPhamRepository
- **DbContext:** UngDungDbContext

| Hàm | Query | Async | Include |
|-----|-------|-------|---------|
| GetAllAsync | .SanPhams.OrderByDescending(s => s.NgayTao).ToListAsync() | ✅ | DanhMuc |
| GetByIdAsync | .SanPhams.FirstOrDefaultAsync(s => s.Id == id) | ✅ | DanhMuc |
| GetByDanhMucAsync | .SanPhams.Where(s => s.DanhMucId == danhMucId).ToListAsync() | ✅ | DanhMuc |
| AddAsync | .SanPhams.AddAsync(sanPham) | ✅ | - |
| UpdateAsync | .SanPhams.Update(sanPham) | ❌ (sync) | - |
| DeleteAsync | .SanPhams.Remove(sanPham) | ❌ (sync) | - |

## 7.2. DanhMucRepository
- **Interface:** IDanhMucRepository

| Hàm | Query | Async |
|-----|-------|-------|
| GetAllAsync | .DanhMucs.ToListAsync() | ✅ |
| GetByIdAsync | .DanhMucs.FirstOrDefaultAsync(d => d.Id == id) | ✅ |
| AddAsync | .DanhMucs.AddAsync(danhMuc) | ✅ |
| UpdateAsync | .DanhMucs.Update(danhMuc) | ❌ |
| DeleteAsync | .DanhMucs.Remove(danhMuc) | ❌ |

## 7.3. KhachHangRepository
- **Interface:** IKhachHangRepository

| Hàm | Query | Async |
|-----|-------|-------|
| GetAllAsync | .KhachHangs.ToListAsync() | ✅ |
| GetByIdAsync | .KhachHangs.FirstOrDefaultAsync(k => k.Id == id) | ✅ |
| GetByEmailAsync | .KhachHangs.FirstOrDefaultAsync(k => k.Email == email) | ✅ |
| AddAsync | .KhachHangs.AddAsync(khachHang) | ✅ |
| UpdateAsync | .KhachHangs.Update(khachHang) | ❌ |
| DeleteAsync | .KhachHangs.Remove(khachHang) | ❌ |

## 7.4. GioHangRepository
- **Interface:** IGioHangRepository

| Hàm | Query | Async | Include |
|-----|-------|-------|---------|
| GetByKhachHangIdAsync | .GioHangs.Include(...).FirstOrDefaultAsync(g => g.KhachHangId == khachHangId) | ✅ | ChiTietGioHangs → SanPham |
| GetByIdAsync | .ChiTietGioHangs.FirstOrDefaultAsync(c => c.Id == id) | ✅ | - |
| AddAsync | .ChiTietGioHangs.AddAsync(chiTiet) | ✅ | - |
| UpdateAsync | .ChiTietGioHangs.Update(chiTiet) | ❌ | - |
| DeleteAsync | .ChiTietGioHangs.Remove(chiTiet) | ❌ | - |
| LuuAsync | .SaveChangesAsync() | ✅ | - |

## 7.5. DonHangRepository
- **Interface:** IDonHangRepository

| Hàm | Query | Async | Include |
|-----|-------|-------|---------|
| GetAllAsync | .DonHangs.OrderByDescending(d => d.NgayDat).ToListAsync() | ✅ | KhachHang, ChiTietDonHangs → SanPham |
| GetByIdAsync | .DonHangs.FirstOrDefaultAsync(d => d.Id == id) | ✅ | KhachHang, ChiTietDonHangs → SanPham |
| GetByKhachHangIdAsync | .DonHangs.Where(d => d.KhachHangId == khachHangId).OrderByDescending(d => d.NgayDat).ToListAsync() | ✅ | ChiTietDonHangs → SanPham |
| AddAsync | .DonHangs.AddAsync(donHang) | ✅ | - |
| UpdateAsync | .DonHangs.Update(donHang) | ❌ | - |
| DeleteAsync | .DonHangs.Remove(donHang) | ❌ | - |

## 7.6. DanhGiaRepository
- **Interface:** IDanhGiaRepository

| Hàm | Query | Async | Include |
|-----|-------|-------|---------|
| GetBySanPhamIdAsync | .DanhGias.Where(d => d.SanPhamId == sanPhamId).OrderByDescending(d => d.NgayTao).ToListAsync() | ✅ | KhachHang |
| GetByIdAsync | .DanhGias.FirstOrDefaultAsync(d => d.Id == id) | ✅ | - |
| AddAsync | .DanhGias.AddAsync(danhGia) | ✅ | - |
| UpdateAsync | .DanhGias.Update(danhGia) | ❌ | - |
| DeleteAsync | .DanhGias.Remove(danhGia) | ❌ | - |

## 7.7. CouponRepository
- **Interface:** ICouponRepository

| Hàm | Query | Async |
|-----|-------|-------|
| GetAllAsync | .Coupons.ToListAsync() | ✅ |
| GetByIdAsync | .Coupons.FirstOrDefaultAsync(c => c.Id == id) | ✅ |
| GetByMaAsync | .Coupons.FirstOrDefaultAsync(c => c.MaCoupon == maCoupon) | ✅ |
| AddAsync | .Coupons.AddAsync(coupon) | ✅ |
| UpdateAsync | .Coupons.Update(coupon) | ❌ |
| DeleteAsync | .Coupons.Remove(coupon) | ❌ |

## 7.8. CauHinhRepository
- **Interface:** ICauHinhRepository

| Hàm | Query | Async | Include |
|-----|-------|-------|---------|
| LayTatCaAsync | .CauHinhs.ToListAsync() | ✅ | ChiTietCauHinhs → SanPham |
| LayTheoIdAsync | .CauHinhs.FirstOrDefaultAsync(c => c.Id == id) | ✅ | ChiTietCauHinhs → SanPham |
| LayTheoMaChiaSeAsync | .CauHinhs.FirstOrDefaultAsync(c => c.MaChiaSe == maChiaSe) | ✅ | ChiTietCauHinhs → SanPham |
| LayTheoKhachHangAsync | .CauHinhs.Where(c => c.KhachHangId == khachHangId).ToListAsync() | ✅ | ChiTietCauHinhs → SanPham |
| ThemAsync | .CauHinhs.AddAsync(cauHinh) | ✅ | - |
| CapNhatAsync | .CauHinhs.Update(cauHinh) | ❌ | - |
| XoaAsync | .CauHinhs.Remove(cauHinh) | ❌ | - |
| LuuAsync | .SaveChangesAsync() | ✅ | - |

---

# PHẦN 8: MODEL

## 8.1. DanhMuc (Category)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| TenDanhMuc | string | Required |
| MoTa | string? | Nullable |
| HinhAnh | string? | Nullable |

**Navigation:** ICollection<SanPham> SanPhams
**Quan hệ:** 1 → N (DanhMuc → SanPham)

## 8.2. SanPham (Product)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| TenSanPham | string | Required |
| ThuongHieu | string? | Nullable |
| DanhMucId | int | FK → DanhMuc |
| Gia | decimal | Required |
| GiaKhuyenMai | decimal? | Nullable |
| SoLuongTon | int | Required |
| HinhAnh | string? | Nullable |
| TrangThai | string | Default: "Còn hàng" |
| MoTaNgan | string? | Nullable |
| ThongSoKyThuat | string? | Nullable (JSON string) |
| NgayTao | DateTime | Default: DateTime.Now |

**Navigation:**
- DanhMuc (N-1)
- ICollection<ChiTietGioHang> ChiTietGioHangs (1-N)
- ICollection<ChiTietDonHang> ChiTietDonHangs (1-N)
- ICollection<DanhGia> DanhGias (1-N)
- ICollection<ChiTietCauHinh> ChiTietCauHinhs (1-N)

## 8.3. KhachHang (Customer)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| HoTen | string | Required |
| Email | string | Required, unique |
| MatKhauHash | string | Required (BCrypt hash) |
| SoDienThoai | string? | Nullable |
| DiaChi | string? | Nullable |
| VaiTro | string | Default: "KhachHang" |
| NgayTao | DateTime | Default: DateTime.Now |

**Navigation:**
- ICollection<GioHang> GioHangs (1-N)
- ICollection<DonHang> DonHangs (1-N)
- ICollection<DanhGia> DanhGias (1-N)
- ICollection<CauHinh> CauHinhs (1-N)

## 8.4. GioHang (Cart)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| KhachHangId | int | FK → KhachHang |
| NgayTao | DateTime | Default: DateTime.Now |

**Navigation:**
- KhachHang (N-1)
- ICollection<ChiTietGioHang> ChiTietGioHangs (1-N)

## 8.5. ChiTietGioHang (Cart Item)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| GioHangId | int | FK → GioHang |
| SanPhamId | int | FK → SanPham |
| SoLuong | int | Required |

**Navigation:**
- GioHang (N-1)
- SanPham (N-1)

## 8.6. DonHang (Order)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| KhachHangId | int | FK → KhachHang |
| NgayDat | DateTime | Default: DateTime.Now |
| TrangThai | string | Default: "Chờ xác nhận" |
| TongTien | decimal | Required |
| CouponId | int? | FK → Coupon (nullable) |
| MaCoupon | string? | Nullable |
| PhanTramGiam | int | Default: 0 |
| TienGiam | decimal | Default: 0 |
| PhiVanChuyen | decimal | Default: 0 |
| ThanhTien | decimal | Required |
| DiaChiGiao | string | Required |
| GhiChu | string? | Nullable |

**Navigation:**
- KhachHang (N-1)
- Coupon (N-1)
- ICollection<ChiTietDonHang> ChiTietDonHangs (1-N)

## 8.7. ChiTietDonHang (Order Item)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| DonHangId | int | FK → DonHang |
| SanPhamId | int | FK → SanPham |
| SoLuong | int | Required |
| DonGia | decimal | Required |

**Navigation:**
- DonHang (N-1)
- SanPham (N-1)

## 8.8. DanhGia (Review)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| SanPhamId | int | FK → SanPham |
| KhachHangId | int | FK → KhachHang |
| SoSao | int | Range: 1-5 |
| NoiDung | string | Required |
| NgayTao | DateTime | Default: DateTime.Now |

**Navigation:**
- SanPham (N-1)
- KhachHang (N-1)

## 8.9. Coupon
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| MaCoupon | string | Required, unique |
| MoTa | string? | Nullable |
| PhanTramGiam | int | Range: 1-100 |
| SoTienGiamToiDa | decimal? | Nullable |
| DieuKienToiThieu | decimal | Default: 0 |
| NgayBatDau | DateTime | Required |
| NgayHetHan | DateTime | Required |
| SoLuong | int | Default: 100 |
| DaSuDung | int | Default: 0 |
| DangHoatDong | bool | Default: true |

**Navigation:** ICollection<DonHang> DonHangs (1-N)

## 8.10. CauHinh (Build Configuration)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| Ten | string | Required |
| KhachHangId | int? | FK → KhachHang (nullable) |
| TongTien | decimal | Required |
| MucDich | string | gaming/van-phong/do-hoa/stream |
| GhiChu | string | Optional |
| NgayTao | DateTime | Default: DateTime.Now |
| MaChiaSe | string | For sharing |

**Navigation:**
- KhachHang (N-1, nullable)
- ICollection<ChiTietCauHinh> ChiTietCauHinhs (1-N)

## 8.11. ChiTietCauHinh (Build Configuration Item)
| Thuộc tính | Kiểu | Ghi chú |
|------------|------|---------|
| Id | int | PK, auto-increment |
| CauHinhId | int | FK → CauHinh |
| SanPhamId | int | FK → SanPham |
| SoLuong | int | Default: 1 |

**Navigation:**
- CauHinh (N-1)
- SanPham (N-1)

---

# PHẦN 9: DTO

## 9.1. Phân loại DTO

### DTO Tạo (Create)
| DTO | Dùng cho | Validation |
|-----|----------|------------|
| TaoSanPhamDto | POST /api/SanPham | [Required] TenSanPham, Gia, DanhMucId; [Range] |
| TaoDanhMucDto | POST /api/DanhMuc | [Required] [StringLength(100, Min=2)] |
| ThemGioHangDto | POST /api/GioHang | Các trường cơ bản |
| TaoDonHangDto | POST /api/DonHang | Các trường + List<ChiTietDonHangDto> |
| TaoDanhGiaDto | POST /api/DanhGia | [Range(1,5)] SoSao, [Required] NoiDung |
| TaoCouponDto | POST /api/Coupon | [Required] MaCoupon, [Range(1,100)] PhanTramGiam |
| DangKyDto | POST /api/KhachHang/dang-ky | [Required] [EmailAddress] Email, [MinLength(6)] MatKhau |

### DTO Sửa (Update)
| DTO | Dùng cho | Ghi chú |
|-----|----------|---------|
| CapNhatSanPhamDto | PUT /api/SanPham/{id} | Tương tự TaoSanPhamDto |
| CapNhatDanhMucDto | PUT /api/DanhMuc/{id} | Tương tự TaoDanhMucDto |
| CapNhatGioHangDto | PUT /api/GioHang/{id} | Chỉ có SoLuong |
| CapNhatTrangThaiDto | PUT /api/Admin/orders/{id}/status | Chỉ có TrangThai |
| CapNhatDanhGiaDto | PUT /api/DanhGia/{id} | Tương tự TaoDanhGiaDto |
| CapNhatCouponDto | PUT /api/Coupon/{id} | Tương tự TaoCouponDto |
| CapNhatKhachHangDto | PUT /api/KhachHang/{id} | HoTen, SoDienThoai, DiaChi |

### DTO Khác
| DTO | Dùng cho | Ghi chú |
|-----|----------|---------|
| DangNhapDto | POST /api/DangNhap | Email, MatKhau |
| KiemTraTuongThichDto | POST /api/BuildPC/kiem-tra-tuong-thich | SanPhamIds (List<int>) |

## 9.2. Thiếu DTO nào?

| Thiếu DTO | Lý do cần |
|-----------|-----------|
| **SanPhamResponseDto** | Trả dữ liệu sản phẩm không kèm navigation cycle |
| **DonHangResponseDto** | Trả đơn hàng đã format |
| **PagedResultDto<T>** | Phân trang |
| **ApiResponseDto** | Response chuẩn (success, message, data, errors) |
| **LoginResponseDto** | Token + user info |
| **DashboardDto** | Đã có trong IDashboardService.cs |

---

# PHẦN 10: DATABASE

## 10.1. Sơ đồ ERD (Văn bản)

```
DanhMuc (1) ──────< (N) SanPham (1) ──────< (N) ChiTietGioHang (N) >────── (1) GioHang (1) >────── (1) KhachHang
                            │                                                              │
                            │                                                              │
                            ├────────< (N) ChiTietDonHang (N) >──────── DonHang (N) >──────┘
                            │                                          │
                            │                                          └──────< (1) Coupon
                            │
                            └────────< (N) DanhGia (N) >────────────── KhachHang
                            
                            └────────< (N) ChiTietCauHinh (N) >─────── CauHinh (N) >──────── KhachHang
```

## 10.2. Danh sách bảng

| Bảng | PK | FK | Quan hệ |
|------|----|----|---------|
| DanhMucs | Id | - | 1-N → SanPhams |
| SanPhams | Id | DanhMucId → DanhMucs | N-1 ← DanhMucs, 1-N → ChiTietGioHangs, ChiTietDonHangs, DanhGias, ChiTietCauHinhs |
| KhachHangs | Id | - | 1-N → GioHangs, DonHangs, DanhGias, CauHinhs |
| GioHangs | Id | KhachHangId → KhachHangs | N-1 ← KhachHangs, 1-N → ChiTietGioHangs |
| ChiTietGioHangs | Id | GioHangId → GioHangs, SanPhamId → SanPhams | N-1 ← GioHangs, N-1 ← SanPhams |
| DonHangs | Id | KhachHangId → KhachHangs, CouponId → Coupons | N-1 ← KhachHangs, N-1 ← Coupons, 1-N → ChiTietDonHangs |
| ChiTietDonHangs | Id | DonHangId → DonHangs, SanPhamId → SanPhams | N-1 ← DonHangs, N-1 ← SanPhams |
| DanhGias | Id | SanPhamId → SanPhams, KhachHangId → KhachHangs | N-1 ← SanPhams, N-1 ← KhachHangs |
| Coupons | Id | - | 1-N → DonHangs |
| CauHinhs | Id | KhachHangId → KhachHangs | N-1 ← KhachHangs, 1-N → ChiTietCauHinhs |
| ChiTietCauHinhs | Id | CauHinhId → CauHinhs, SanPhamId → SanPhams | N-1 ← CauHinhs, N-1 ← SanPhams |

## 10.3. Migration

- **Tự động:** `db.Database.Migrate()` trong Program.cs
- **Trạng thái:** Đã có migration (chưa rõ tên file migration cụ thể)
- **Đánh giá:** Tốt, tự động tạo DB khi chạy

## 10.4. DbContext (UngDungDbContext)

- **DbSet:** 11 DbSet tương ứng 11 models
- **Fluent API:** Cấu hình quan hệ trong OnModelCreating
- **Đánh giá:** Thiếu cấu hình index, thiếu cấu hình unique constraint cho Email, MaCoupon

## 10.5. Seed Data

- **File:** 6 JSON files trong Data/SeedData/
  - danh-muc.json (8 danh mục: CPU, GPU, RAM, SSD, Mainboard, PSU, Case, Laptop)
  - san-pham.json (Sản phẩm mẫu)
  - khach-hang.json (Tài khoản admin + khách hàng)
  - don-hang.json (Đơn hàng mẫu)
  - chi-tiet-don-hang.json (Chi tiết đơn hàng mẫu)
  - danh-gia.json (Đánh giá mẫu)
  - coupon.json (Mã giảm giá mẫu)
- **SeedData.cs:** Đọc JSON, deserialize, thêm vào DbContext
- **Đánh giá:** Tốt, dễ quản lý dữ liệu mẫu

---

# PHẦN 11: DEPENDENCY INJECTION

## 11.1. Program.cs - Service Registration

### Repository Registration (Scoped)
```csharp
builder.Services.AddScoped<ISanPhamRepository, SanPhamRepository>();
builder.Services.AddScoped<IDanhMucRepository, DanhMucRepository>();
builder.Services.AddScoped<IGioHangRepository, GioHangRepository>();
builder.Services.AddScoped<IDonHangRepository, DonHangRepository>();
builder.Services.AddScoped<IDanhGiaRepository, DanhGiaRepository>();
builder.Services.AddScoped<ICouponRepository, CouponRepository>();
builder.Services.AddScoped<IKhachHangRepository, KhachHangRepository>();
builder.Services.AddScoped<ICauHinhRepository, CauHinhRepository>();
```

### Service Registration (Scoped)
```csharp
builder.Services.AddScoped<ISanPhamService, SanPhamService>();
builder.Services.AddScoped<IDanhMucService, DanhMucService>();
builder.Services.AddScoped<IGioHangService, GioHangService>();
builder.Services.AddScoped<IDonHangService, DonHangService>();
builder.Services.AddScoped<IDanhGiaService, DanhGiaService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
builder.Services.AddScoped<IDangNhapService, DangNhapService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddHttpClient<IAIService, AIService>();
builder.Services.AddScoped<IBuildPCService, BuildPCService>();
```

### DbContext Registration
```csharp
builder.Services.AddDbContext<UngDungDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
```

### Authentication Registration
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { ... });
```

### Swagger Registration
```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
```

### CORS Registration
```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## 11.2. Đánh giá DI

| Tiêu chí | Đánh giá |
|----------|----------|
| **Interface/Implementation tách biệt** | ✅ Tốt |
| **Scoped lifetime phù hợp** | ✅ Đúng (mỗi request một instance) |
| **HttpClientFactory cho AIService** | ✅ Tốt, tránh socket exhaustion |
| **Thiếu đăng ký** | ⚠️ ThanhToanService chưa đăng ký (file rỗng) |
| **Thiếu Middleware** | ⚠️ ExceptionHandler, Logging chưa đăng ký |

---

# PHẦN 12: MIDDLEWARE

## 12.1. Pipeline hiện tại

```
app.UseHttpsRedirection();
app.UseCors();
// app.UseAuthentication();  // TẠM THỜI TẮT
// app.UseAuthorization();   // TẠM THỜI TẮT
app.UseStaticFiles();
app.MapControllers();
```

## 12.2. Phân tích Middleware

| Middleware | Trạng thái | Vai trò |
|-----------|-----------|---------|
| HttpsRedirection | ✅ Hoạt động | Chuyển HTTP → HTTPS |
| CORS | ✅ Hoạt động | Cho phép frontend gọi API |
| Authentication | ❌ Tắt | JWT authentication |
| Authorization | ❌ Tắt | Role-based authorization |
| StaticFiles | ✅ Hoạt động | Phục vụ file tĩnh (upload) |
| MapControllers | ✅ Hoạt động | Route request đến controller |

## 12.3. Middleware cần thêm

| Middleware | Mức độ ưu tiên | Lý do |
|-----------|----------------|-------|
| ExceptionHandlerMiddleware | 🔴 Cao | Bắt lỗi toàn cục, trả response chuẩn |
| Serilog RequestLogging | 🟡 Trung bình | Ghi log request/response |
| RateLimiting | 🟡 Trung bình | Chống spam API |
| RequestValidation | 🟢 Thấp | Validate request trước khi vào controller |

---

# PHẦN 13: HELPERS

## 13.1. Hiện tại

**Không có thư mục Helpers** trong dự án. Các helper function được viết trực tiếp trong Service.

## 13.2. Helper cần tạo

| Helper | Chức năng | Được dùng ở đâu |
|--------|-----------|----------------|
| **PasswordHelper** | Hash/Verify password (BCrypt) | KhachHangService, DangNhapService |
| **JwtHelper** | Tạo JWT token | DangNhapService |
| **ImageHelper** | Xử lý upload/resize image | UploadController |
| **ValidationHelper** | Validate dữ liệu | Tất cả Service |
| **PaginationHelper** | Phân trang | SanPhamService |

---

# PHẦN 14: LUỒNG DỮ LIỆU

## 14.1. Luồng cơ bản (Ví dụ: Lấy danh sách sản phẩm)

```
1. Browser (main+ds+sp.html)
   ↓ fetch('https://localhost:5000/api/SanPham')
2. SanPhamController.GetAll()
   ↓ Gọi ISanPhamService.GetAllAsync()
3. SanPhamService.GetAllAsync()
   ↓ Gọi ISanPhamRepository.GetAllAsync()
4. SanPhamRepository.GetAllAsync()
   ↓ _context.SanPhams.Include(s => s.DanhMuc).OrderByDescending(s => s.NgayTao).ToListAsync()
5. SQL Server
   ↓ SELECT * FROM SanPhams JOIN DanhMucs ORDER BY NgayTao DESC
6. SanPhamRepository trả List<SanPham>
   ↓
7. SanPhamService trả List<SanPham>
   ↓
8. SanPhamController trả Ok(List<SanPham>) → JSON
   ↓
9. Browser nhận JSON, render HTML
```

## 14.2. Luồng tạo đơn hàng (Phức tạp)

```
1. Browser (thanh-toan.html)
   ↓ fetch POST /api/DonHang (TaoDonHangDto)
2. DonHangController.Create(TaoDonHangDto)
   ↓ Gọi IDonHangService.CreateAsync(dto)
3. DonHangService.CreateAsync(dto)
   ├── Kiểm tra coupon (nếu có MaCoupon)
   │   └── Gọi ICouponRepository.GetByMaAsync(maCoupon)
   │       └── Kiểm tra hạn, số lượng, điều kiện
   ├── Tính toán tiền
   ├── Tạo DonHang entity
   │   └── Gọi IDonHangRepository.AddAsync(donHang)
   ├── Tạo ChiTietDonHang cho từng sản phẩm
   ├── Cập nhật số lượng tồn kho
   ├── Xóa giỏ hàng
   │   └── Gọi IGioHangRepository
   └── Trả DonHang
4. DonHangController trả CreatedAtAction(DonHang)
5. Browser nhận response, chuyển trang thành công
```

## 14.3. Luồng đăng nhập (JWT)

```
1. Browser (login form)
   ↓ fetch POST /api/DangNhap (DangNhapDto)
2. DangNhapController.DangNhap(DangNhapDto)
   ↓ Gọi IDangNhapService.DangNhapAsync(dto)
3. DangNhapService.DangNhapAsync(dto)
   ├── Gọi IKhachHangRepository.GetByEmailAsync(email)
   ├── Verify password (BCrypt)
   ├── Tạo JWT token (claims: id, email, role)
   └── Trả (token, khachHang)
4. DangNhapController trả Ok({ token, khachHang })
5. Browser lưu token vào localStorage
6. Các request sau gửi kèm Authorization: Bearer {token}
```

---

# PHẦN 15: BIẾN

## 15.1. Biến toàn cục (Backend)

| Biến | File | Kiểu | Ý nghĩa |
|------|------|------|---------|
| builder | Program.cs | WebApplicationBuilder | Xây dựng ứng dụng |
| app | Program.cs | WebApplication | Ứng dụng chạy |
| jwtSettings | Program.cs | IConfigurationSection | Cấu hình JWT |
| jwtKey | Program.cs | byte[] | Key ký JWT |

## 15.2. Biến trong Controller

| Biến | Controller | Kiểu | Ý nghĩa |
|------|------------|------|---------|
| _sanPhamService | SanPhamController | ISanPhamService | Service sản phẩm (DI) |
| _danhMucService | DanhMucController | IDanhMucService | Service danh mục (DI) |
| _khachHangService | KhachHangController | IKhachHangService | Service khách hàng (DI) |
| _dangNhapService | DangNhapController | IDangNhapService | Service đăng nhập (DI) |
| _gioHangService | GioHangController | IGioHangService | Service giỏ hàng (DI) |
| _donHangService | DonHangController | IDonHangService | Service đơn hàng (DI) |
| _danhGiaService | DanhGiaController | IDanhGiaService | Service đánh giá (DI) |
| _couponService | CouponController | ICouponService | Service coupon (DI) |
| _dashboardService | DashboardController | IDashboardService | Service dashboard (DI) |
| _aiService | AIController | IAIService | Service AI (DI) |
| _buildPCService | BuildPCController | IBuildPCService | Service Build PC (DI) |
| _environment | UploadController | IWebHostEnvironment | Môi trường host |

## 15.3. Biến trong Service

| Biến | Service | Kiểu | Ý nghĩa |
|------|---------|------|---------|
| _repository | Các Service | I*Repository | Repository tương ứng (DI) |
| _httpClient | AIService | HttpClient | Gọi API Gemini |
| _apiKey | AIService | string | API key từ .env |
| _configuration | DangNhapService | IConfiguration | Đọc cấu hình JWT |

## 15.4. Biến trong Repository

| Biến | Repository | Kiểu | Ý nghĩa |
|------|------------|------|---------|
| _context | Tất cả Repository | UngDungDbContext | DbContext (DI) |

## 15.5. Biến Frontend (JavaScript)

| Biến | File | Kiểu | Ý nghĩa |
|------|------|------|---------|
| ALL_PRODUCTS | data-products.js | Array | Dữ liệu sản phẩm giả |
| ALL_CUSTOMERS | data-customers.js | Array | Dữ liệu khách hàng giả |
| API_URL | api.js | string | Base URL backend |
| token | api.js | string | JWT token từ localStorage |
| cart | cart.js | Array | Giỏ hàng (localStorage) |
| compareList | so-sanh.js | Array | Danh sách so sánh |

---

# PHẦN 16: HÀM

## 16.1. Hàm Backend - Controller

| Hàm | Controller | Tham số | Trả về | Độ phức tạp |
|-----|-----------|---------|--------|-------------|
| GetAll | SanPhamController | - | Task<IActionResult> | O(1) |
| GetById | SanPhamController | int id | Task<IActionResult> | O(1) |
| GetByDanhMuc | SanPhamController | int danhMucId | Task<IActionResult> | O(1) |
| Create | SanPhamController | TaoSanPhamDto dto | Task<IActionResult> | O(1) |
| Update | SanPhamController | int id, CapNhatSanPhamDto dto | Task<IActionResult> | O(1) |
| Delete | SanPhamController | int id | Task<IActionResult> | O(1) |
| DangNhap | DangNhapController | DangNhapDto dto | Task<IActionResult> | O(1) |
| DangKy | KhachHangController | DangKyDto dto | Task<IActionResult> | O(1) |
| Chat | AIController | AiRequest request | Task<IActionResult> | O(n) - gọi API ngoài |
| KiemTraTuongThich | BuildPCController | KiemTraTuongThichDto dto | Task<IActionResult> | O(n²) - kiểm tra cặp linh kiện |

## 16.2. Hàm Backend - Service

| Hàm | Service | Độ phức tạp | Cần tối ưu? |
|-----|---------|-------------|-------------|
| GetAllAsync | SanPhamService | O(n) | Cần thêm pagination |
| CreateAsync | DonHangService | O(n) với số sản phẩm | OK |
| DangNhapAsync | DangNhapService | O(1) | OK |
| KiemTraTuongThichAsync | BuildPCService | O(n²) | Có thể cache kết quả |
| ChatAsync | AIService | O(1) + network | OK |
| GetThongKeAsync | DashboardService | O(n) | Có thể cache |

## 16.3. Hàm Frontend

| Hàm | File | Chức năng | Được gọi ở đâu |
|-----|------|-----------|----------------|
| addToCart | cart.js | Thêm vào giỏ | Tất cả trang sản phẩm |
| renderCart | cart.js | Hiển thị giỏ | gio-hang.html |
| renderDashboard | ADMIN.JS | Dashboard admin | admin.html |
| renderProducts | ADMIN.JS | Quản lý sản phẩm | admin.html |
| renderBuildPC | buildpc.js | Build PC UI | buildpc.html |
| checkCompatibility | buildpc.js | Kiểm tra tương thích | buildpc.html |
| toggleChat | ai-chat.js | Mở/đóng AI chat | buildpc.html |
| searchProducts | search.js | Tìm kiếm | main+ds+sp.html |
| addToCompare | so-sanh.js | Thêm so sánh | chi-tiet-sp.html |
| calculateFPS | fps-calculator.js | Tính FPS | fps-calculator.html |
| apiGet | api.js | GET request | Tất cả JS gọi API |
| apiPost | api.js | POST request | Tất cả JS gọi API |

---

# PHẦN 17: API

## 17.1. Bảng API tổng hợp

| Method | URL | Input | Output | Validation |
|--------|-----|-------|--------|------------|
| GET | /api/SanPham | - | SanPham[] | - |
| GET | /api/SanPham/{id} | id:int | SanPham | id > 0 |
| GET | /api/SanPham/danhmuc/{danhMucId} | danhMucId:int | SanPham[] | danhMucId > 0 |
| POST | /api/SanPham | TaoSanPhamDto | SanPham | Data Annotation |
| PUT | /api/SanPham/{id} | id:int, CapNhatSanPhamDto | 200/400/404 | Data Annotation |
| DELETE | /api/SanPham/{id} | id:int | 200/404 | id > 0 |
| GET | /api/DanhMuc | - | DanhMuc[] | - |
| GET | /api/DanhMuc/{id} | id:int | DanhMuc | id > 0 |
| POST | /api/DanhMuc | TaoDanhMucDto | DanhMuc | Data Annotation |
| PUT | /api/DanhMuc/{id} | id:int, CapNhatDanhMucDto | 200/400/404 | Data Annotation |
| DELETE | /api/DanhMuc/{id} | id:int | 200/404 | id > 0 |
| POST | /api/KhachHang/dang-ky | DangKyDto | 200/400 | Email, Password |
| GET | /api/KhachHang/{id} | id:int | KhachHang | id > 0 |
| PUT | /api/KhachHang/{id} | id:int, CapNhatKhachHangDto | 200/400/404 | - |
| DELETE | /api/KhachHang/{id} | id:int | 200/404 | id > 0 |
| POST | /api/DangNhap | DangNhapDto | {token, khachHang} | Email, Password |
| GET | /api/GioHang/{khachHangId} | khachHangId:int | GioHang | khachHangId > 0 |
| POST | /api/GioHang | ThemGioHangDto | ChiTietGioHang | Data Annotation |
| PUT | /api/GioHang/{id} | id:int, CapNhatGioHangDto | 200/400/404 | id > 0 |
| DELETE | /api/GioHang/{id} | id:int | 200/404 | id > 0 |
| GET | /api/DonHang/khach-hang/{khachHangId} | khachHangId:int | DonHang[] | khachHangId > 0 |
| GET | /api/DonHang/{id} | id:int | DonHang | id > 0 |
| POST | /api/DonHang | TaoDonHangDto | DonHang | Data Annotation |
| PUT | /api/DonHang/{id}/huy | id:int | 200/400/404 | id > 0 |
| GET | /api/DanhGia/san-pham/{sanPhamId} | sanPhamId:int | DanhGia[] | sanPhamId > 0 |
| POST | /api/DanhGia | TaoDanhGiaDto | DanhGia | Data Annotation |
| PUT | /api/DanhGia/{id} | id:int, CapNhatDanhGiaDto | 200/400/404 | Data Annotation |
| DELETE | /api/DanhGia/{id} | id:int | 200/404 | id > 0 |
| GET | /api/Coupon | - | Coupon[] | - |
| GET | /api/Coupon/{id} | id:int | Coupon | id > 0 |
| GET | /api/Coupon/ma/{maCoupon} | maCoupon:string | Coupon | - |
| POST | /api/Coupon | TaoCouponDto | Coupon | Data Annotation |
| PUT | /api/Coupon/{id} | id:int, CapNhatCouponDto | 200/400/404 | Data Annotation |
| DELETE | /api/Coupon/{id} | id:int | 200/404 | id > 0 |
| GET | /api/Admin/orders | - | DonHang[] | [Authorize] |
| PUT | /api/Admin/orders/{id}/status | id:int, CapNhatTrangThaiDto | 200/404 | [Authorize] |
| GET | /api/Admin/dashboard | - | DashboardDto | [Authorize] |
| GET | /api/Dashboard/thong-ke | - | DashboardDto | - |
| POST | /api/AI/chat | {message:string} | {response:string} | - |
| POST | /api/AI/tu-van-build | {message:string} | {response:string} | - |
| GET | /api/BuildPC | - | CauHinh[] | - |
| GET | /api/BuildPC/{id} | id:int | CauHinh | id > 0 |
| GET | /api/BuildPC/ma-chia-se/{maChiaSe} | maChiaSe:string | CauHinh | - |
| GET | /api/BuildPC/khach-hang/{khachHangId} | khachHangId:int | CauHinh[] | khachHangId > 0 |
| POST | /api/BuildPC | CauHinh | CauHinh | - |
| PUT | /api/BuildPC/{id} | id:int, CauHinh | 200/404 | id > 0 |
| DELETE | /api/BuildPC/{id} | id:int | 200/404 | id > 0 |
| POST | /api/BuildPC/kiem-tra-tuong-thich | KiemTraTuongThichDto | {result} | - |
| POST | /api/Upload/image | IFormFile | {url:string} | File < 5MB |

---

# PHẦN 18: FRONTEND

## 18.1. Danh sách trang

| Trang | File | Chức năng chính | JS liên quan |
|-------|------|-----------------|--------------|
| Trang chủ | main+ds+sp.html | Banner, danh mục, sản phẩm | api.js, data-products.js, cart.js, search.js, loginbaner.js |
| Admin | admin.html | Quản trị toàn bộ | ADMIN.JS, data-products.js, data-customers.js |
| Build PC | buildpc.html | Xây dựng cấu hình PC | buildpc.js, ai-chat.js |
| Chi tiết SP | chi-tiet-sp.html | Xem chi tiết sản phẩm | chi-tiet.js, cart.js |
| Giỏ hàng | gio-hang.html | Quản lý giỏ hàng | cart.js |
| Thanh toán | thanh-toan.html | Thanh toán đơn hàng | thanh toan.js |
| So sánh | so-sanh-sp.html | So sánh 2 sản phẩm | so-sanh.js |
| Bán chạy | best-sellers.html | Sản phẩm bán chạy | best-sellers.js, data-products.js |
| FPS Calc | fps-calculator.html | Tính FPS game | fps-calculator.js |
| Đơn mua | don-mua.html | Lịch sử đơn hàng | cart.js |
| QR Payment | qr-payment.html | Mã QR thanh toán | - |
| GPU | gpu.html | Danh mục GPU | data-products.js, cart.js |
| Laptop | laptop.html | Danh mục Laptop | data-products.js, cart.js |
| Màn hình | man-hinh.html | Danh mục màn hình | data-products.js, cart.js |
| Linh kiện | peripherals.html | Danh mục linh kiện | data-products.js, cart.js |
| PC bộ | pc-bo-mixi.html | PC bộ mixi | data-products.js, cart.js |

## 18.2. Component chung

| Component | Mô tả | Xuất hiện ở |
|-----------|-------|-------------|
| **Navbar** | Logo, search, cart, login | Tất cả trang |
| **Product Card** | Hình ảnh, tên, giá, nút mua | main+ds+sp.html, best-sellers.html, các trang danh mục |
| **Footer** | Thông tin liên hệ | Tất cả trang |
| **Cart Popup** | Giỏ hàng thả xuống | Tất cả trang |
| **AI Chat** | Chat popup tư vấn | buildpc.html |

## 18.3. Event chính

| Event | File | Xử lý |
|-------|------|-------|
| click .add-to-cart | cart.js | Thêm vào giỏ hàng |
| click .remove-from-cart | cart.js | Xóa khỏi giỏ |
| change .quantity-input | cart.js | Cập nhật số lượng |
| submit #search-form | search.js | Tìm kiếm sản phẩm |
| click .compare-btn | so-sanh.js | Thêm vào so sánh |
| click #checkout-btn | thanh toan.js | Xử lý thanh toán |
| click #save-build | buildpc.js | Lưu cấu hình |
| click #check-compatibility | buildpc.js | Kiểm tra tương thích |
| click #send-chat | ai-chat.js | Gửi tin nhắn AI |
| click .nav-link | ADMIN.JS | Chuyển tab admin |

## 18.4. DOM Manipulation

| Thao tác | File | Mô tả |
|----------|------|-------|
| renderProductList | data-products.js | Render danh sách sản phẩm |
| renderCartItems | cart.js | Render giỏ hàng |
| renderDashboard | ADMIN.JS | Render thống kê |
| renderBuildSlots | buildpc.js | Render các slot linh kiện |
| renderCompareTable | so-sanh.js | Render bảng so sánh |
| renderChatMessages | ai-chat.js | Render tin nhắn chat |

## 18.5. LocalStorage

| Key | File | Mục đích |
|-----|------|----------|
| cart | cart.js | Lưu giỏ hàng |
| token | api.js | Lưu JWT token |
| compareList | so-sanh.js | Lưu danh sách so sánh |
| user | loginbaner.js | Lưu thông tin user |

## 18.6. API Fetch

| Hàm | File | Endpoint |
|-----|------|----------|
| getProducts | api.js | GET /api/SanPham |
| getProduct | api.js | GET /api/SanPham/{id} |
| createProduct | api.js | POST /api/SanPham |
| updateProduct | api.js | PUT /api/SanPham/{id} |
| deleteProduct | api.js | DELETE /api/SanPham/{id} |
| getCategories | api.js | GET /api/DanhMuc |
| getCart | api.js | GET /api/GioHang/{khachHangId} |
| addToCart | api.js | POST /api/GioHang |
| createOrder | api.js | POST /api/DonHang |
| getOrders | api.js | GET /api/DonHang/khach-hang/{khachHangId} |
| login | api.js | POST /api/DangNhap |
| register | api.js | POST /api/KhachHang/dang-ky |
| getDashboard | api.js | GET /api/Dashboard/thong-ke |
| aiChat | api.js | POST /api/AI/chat |
| uploadImage | api.js | POST /api/Upload/image |

---

# PHẦN 19: ĐÁNH GIÁ CLEAN CODE

## 19.1. Đánh giá chi tiết

| Tiêu chí | Điểm (1-10) | Nhận xét |
|----------|-------------|----------|
| **Tên biến** | 8 | Tên biến rõ ràng, có ý nghĩa (Tiếng Việt phù hợp với dự án Việt Nam) |
| **Tên hàm** | 8 | Tên hàm mô tả đúng chức năng (GetAllAsync, CreateAsync, DangNhapAsync) |
| **SOLID** | 7 | SRP, DI tốt. Thiếu OCP (không dùng interface mở rộng) |
| **DRY** | 6 | Code lặp trong Repository (các hàm CRUD giống nhau), lặp trong frontend |
| **KISS** | 7 | Đơn giản, dễ hiểu. Một số service hơi phức tạp (DonHangService.CreateAsync) |
| **SRP** | 7 | Controller chỉ làm nhiệm vụ HTTP, Service xử lý nghiệp vụ. Tốt |
| **Dependency Injection** | 9 | DI đầy đủ, interface/implementation tách biệt |
| **Repository Pattern** | 8 | Đúng pattern, tách biệt data access |
| **Service Pattern** | 8 | Đúng pattern, xử lý nghiệp vụ tập trung |
| **DTO Pattern** | 7 | Có DTO nhưng thiếu ResponseDTO, ApiResponseDTO |
| **Async/Await** | 9 | Toàn bộ backend dùng async/await đúng cách |
| **Exception Handling** | 4 | Thiếu try-catch trong controller, không có middleware bắt lỗi |
| **Validation** | 6 | Chỉ có Data Annotation trong DTO, thiếu validation phức tạp |
| **Comment** | 7 | Có comment trong Program.cs, thiếu comment trong service/repository |

## 19.2. Điểm tổng: **7.2/10**

---

# PHẦN 20: NHỮNG GÌ CÒN THIẾU

## 20.1. Bảng đánh giá mức độ hoàn thiện module

| Module | % | Ghi chú |
|--------|---|---------|
| **Authentication (JWT)** | 40% | Đã cấu hình nhưng đang tắt |
| **Authorization (Role)** | 30% | Có [Authorize(Roles = "Admin")] nhưng chưa dùng được |
| **Refresh Token** | 0% | Chưa triển khai |
| **Upload Image** | 70% | UploadController hoạt động, thiếu resize/validate |
| **Redis Cache** | 0% | Chưa triển khai |
| **Logging (Serilog)** | 0% | Chưa triển khai |
| **Validation** | 50% | Data Annotation cơ bản, thiếu FluentValidation |
| **Pagination** | 0% | API trả toàn bộ dữ liệu |
| **Search** | 30% | Frontend có search, backend chưa có API search |
| **Filter** | 20% | Frontend có filter, backend chưa có |
| **Sort** | 20% | Frontend có sort, backend chưa có |
| **Soft Delete** | 0% | Chưa triển khai |
| **Exception Handling** | 10% | Chưa có middleware |
| **Rate Limiting** | 0% | Chưa triển khai |
| **Review (Đánh giá)** | 80% | Backend đầy đủ, frontend chưa kết nối |
| **Wishlist (Yêu thích)** | 0% | Chưa triển khai |
| **Coupon** | 80% | Backend đầy đủ, frontend chưa kết nối |
| **Notification** | 0% | Chưa triển khai |
| **Dashboard** | 80% | Backend + Frontend admin, thiếu biểu đồ chi tiết |
| **Build PC** | 85% | Frontend + Backend, thiếu kết nối hoàn chỉnh |
| **AI Recommendation** | 70% | Có AI chat, thiếu recommendation sản phẩm |
| **Thanh toán** | 30% | ThanhToanService rỗng, frontend QR tĩnh |
| **Unit Test** | 0% | Chưa có test nào |
| **Integration Test** | 0% | Chưa có test nào |

---

# PHẦN 21: ROADMAP

## Phase A: Hoàn thiện Backend Core (1-2 tuần)

### Mục tiêu
- Bật JWT Authentication
- Hoàn thiện Exception Handling
- Thêm Pagination, Search, Filter, Sort

### File cần sửa
- `Program.cs` - Bỏ comment Authentication/Authorization
- `SanPhamController.cs` - Thêm pagination, search params
- `SanPhamService.cs` - Xử lý pagination
- `SanPhamRepository.cs` - Query có pagination

### File tạo mới
- `Middleware/ExceptionHandlerMiddleware.cs`
- `Helpers/PaginationHelper.cs`
- `DTOs/PagedResultDto.cs`
- `DTOs/ApiResponseDto.cs`

### API
- GET /api/SanPham?page=1&pageSize=20&search=ten&sortBy=gia&sortDir=asc

### Database
- Thêm index cho TenSanPham, Gia, MaCoupon, Email

## Phase B: Kết nối Frontend - Backend (1-2 tuần)

### Mục tiêu
- Chuyển Admin từ localStorage sang API
- Kết nối Cart frontend với Cart API
- Kết nối Order frontend với Order API

### File cần sửa
- `js/ADMIN.JS` - Thay localStorage bằng api.js
- `js/cart.js` - Thêm API calls
- `js/thanh toan.js` - Kết nối API đơn hàng
- `js/data-products.js` - Giảm phụ thuộc

### File tạo mới
- `js/admin-api.js` - API calls cho admin

## Phase C: Hoàn thiện Build PC & AI (1 tuần)

### Mục tiêu
- Kết nối Build PC frontend với Backend API
- Cải thiện AI recommendation
- Thêm kiểm tra tương thích chi tiết

### File cần sửa
- `js/buildpc.js` - Gọi API backend
- `js/ai-chat.js` - Gọi API AI backend
- `Services/BuildPCService.cs` - Cải thiện kiểm tra tương thích

## Phase D: Thanh toán & Coupon (1 tuần)

### Mục tiêu
- Hoàn thiện ThanhToanService
- Kết nối Coupon frontend với Backend
- Tích hợp cổng thanh toán (VNPay/Momo)

### File cần sửa
- `Services/ThanhToanService.cs` - Implement
- `Controllers/ThanhToanController.cs` - Tạo mới
- `js/thanh toan.js` - Kết nối API

## Phase E: Bảo mật & Performance (1 tuần)

### Mục tiêu
- Rate Limiting
- Soft Delete
- Redis Cache
- Logging (Serilog)

### File tạo mới
- `Middleware/RateLimitingMiddleware.cs`
- `Services/CacheService.cs`
- Cấu hình Serilog trong Program.cs

## Phase F: Kiểm thử & Triển khai (1-2 tuần)

### Mục tiêu
- Unit Test cho Service
- Integration Test cho API
- Deploy lên hosting

### File tạo mới
- `Tests/PCZone.API.Tests/` - Project test
- `Tests/SanPhamServiceTests.cs`
- `Tests/DonHangServiceTests.cs`
- `Tests/ControllersTests/`

---

# PHẦN 22: DANH SÁCH CÂU HỎI BẢO VỆ ĐỒ ÁN

## A. Kiến trúc & Tổng quan (10 câu)

1. Dự án sử dụng kiến trúc gì? Tại sao chọn kiến trúc này?
2. Vai trò của từng layer trong kiến trúc layered?
3. Luồng dữ liệu từ frontend đến database như thế nào?
4. Tại sao cần tách Service layer riêng?
5. Dependency Injection là gì? Lợi ích trong dự án?
6. Tại sao dùng Interface cho Repository và Service?
7. Scoped, Singleton, Transient khác nhau thế nào?
8. Tại sao chọn ASP.NET Core Web API thay vì MVC?
9. Kiến trúc monolith vs microservice, dự án này phù hợp với loại nào?
10. Làm thế nào để mở rộng dự án khi có thêm tính năng mới?

## B. Backend - C# (15 câu)

11. Tại sao dùng async/await? Lợi ích?
12. Task<T> và void khác nhau thế nào trong async?
13. IActionResult dùng để làm gì?
14. Các loại ActionResult thường dùng? (Ok, BadRequest, NotFound, CreatedAtAction)
15. Attribute routing là gì? So sánh với convention routing?
16. [FromBody], [FromRoute], [FromQuery] khác nhau thế nào?
17. Tại sao cần [ApiController] attribute?
18. Model binding trong ASP.NET Core hoạt động thế nào?
19. Middleware là gì? Thứ tự chạy của middleware?
20. Cách tạo custom middleware?
21. CORS là gì? Tại sao cần cấu hình CORS?
22. appsettings.json dùng để làm gì?
23. IConfiguration dùng để đọc cấu hình thế nào?
24. Environment variables khác gì appsettings.json?
25. Tại sao dùng DotNetEnv?

## C. Entity Framework Core (15 câu)

26. Entity Framework Core là gì? Ưu điểm so với ADO.NET?
27. Code-First vs Database-First khác nhau thế nào?
28. Migration là gì? Cách tạo và áp dụng migration?
29. DbContext là gì? Vòng đời của DbContext?
30. DbSet dùng để làm gì?
31. Fluent API vs Data Annotation khác nhau thế nào?
32. Include() và ThenInclude() dùng để làm gì?
33. Lazy Loading vs Eager Loading khác nhau thế nào?
34. Tại sao cần IgnoreCycles trong JSON serialization?
35. Navigation Property là gì? Các loại?
36. Foreign Key mapping trong EF Core?
37. Tại sao dùng FirstOrDefaultAsync thay vì FirstOrDefault?
38. SaveChangesAsync vs SaveChanges khác nhau?
39. Làm thế nào để tối ưu query EF Core?
40. AsNoTracking() dùng khi nào?

## D. Database - SQL Server (10 câu)

41. Thiết kế database của dự án gồm những bảng nào?
42. Quan hệ giữa SanPham và DanhMuc là gì?
43. Khóa chính, khóa ngoại là gì? Ví dụ trong dự án?
44. Tại sao cần index? Cột nào nên đánh index?
45. Seed Data dùng để làm gì?
46. Transaction là gì? Dùng trong tình huống nào?
47. SQL Injection là gì? EF Core có chống được không?
48. So sánh SQL Server và MySQL?
49. Tại sao dùng decimal cho tiền thay vì float?
50. N+1 query problem là gì? Cách khắc phục?

## E. Repository Pattern (10 câu)

51. Repository Pattern là gì? Lợi ích?
52. Tại sao cần Interface cho Repository?
53. Repository có nên trả về IQueryable không?
54. Unit of Work pattern là gì? Có dùng trong dự án không?
55. Generic Repository là gì? Có nên dùng không?
56. Repository có nên chứa business logic không?
57. Làm thế nào để test Repository?
58. Repository có nên dùng async không?
59. Include trong Repository có nên để ở Service không?
60. Khi nào cần tạo Repository mới?

## F. Service Layer (10 câu)

61. Service layer khác gì Repository layer?
62. Tại sao Service gọi Repository mà không gọi DbContext trực tiếp?
63. Service có nên trả về DTO hay Entity?
64. Validation nên để ở Controller hay Service?
65. Xử lý transaction trong Service thế nào?
66. Service có nên gọi Service khác không?
67. Làm thế nào để test Service?
68. AutoMapper có nên dùng không?
69. Service nên xử lý exception thế nào?
70. Khi nào cần tách Service thành nhiều Service nhỏ?

## G. Controller & API (10 câu)

71. RESTful API là gì? Nguyên tắc?
72. HTTP Methods (GET, POST, PUT, DELETE) khác nhau thế nào?
73. Status code thường dùng? (200, 201, 400, 401, 403, 404, 500)
74. Tại sao API nên trả về JSON?
75. Versioning API là gì? Có cần không?
76. Swagger dùng để làm gì?
77. Content Negotiation là gì?
78. API Response format chuẩn nên như thế nào?
79. Tại sao cần validate input ở Controller?
80. Rate limiting API là gì?

## H. Authentication & Authorization (10 câu)

81. JWT là gì? Cấu trúc của JWT?
82. Tại sao dùng JWT thay vì Session?
83. Access Token vs Refresh Token khác nhau?
84. Claims trong JWT là gì?
85. Tại sao JWT cần có expiration time?
86. [Authorize] attribute dùng để làm gì?
87. Role-based authorization là gì?
88. Làm thế nào để lưu token an toàn ở client?
89. Tại sao JWT đang tắt trong dự án?
90. BCrypt dùng để làm gì?

## I. Frontend (10 câu)

91. localStorage vs sessionStorage khác nhau?
92. fetch API là gì? So sánh với XMLHttpRequest?
93. Promise và async/await trong JavaScript?
94. DOM manipulation là gì? Các phương thức thường dùng?
95. Event delegation là gì?
96. Tại sao dùng HTML/CSS/JS thuần thay vì React/Vue?
97. Responsive design là gì? Media queries?
98. CORS error là gì? Cách fix?
99. Tối ưu frontend performance thế nào?
100. Chart.js dùng để làm gì?

## J. Bảo mật & Performance (10 câu)

101. Các lỗ hổng bảo mật thường gặp trong web?
102. XSS là gì? Cách phòng chống?
103. CSRF là gì? Cách phòng chống?
104. SQL Injection là gì? EF Core có bị không?
105. HTTPS tại sao quan trọng?
106. Caching là gì? Các loại cache?
107. Làm thế nào để tối ưu API response time?
108. Pagination tại sao quan trọng?
109. Load testing là gì?
110. Logging và Monitoring tại sao cần?

## K. Đồ án & Phát triển (10 câu)

111. Quy trình phát triển phần mềm đã áp dụng?
112. Khó khăn lớn nhất khi làm dự án?
113. Nếu làm lại, sẽ cải thiện điều gì?
114. Hướng phát triển tiếp theo của dự án?
115. So sánh dự án với các website thương mại điện tử thực tế?
116. Tại sao chọn đề tài này?
117. Phân công công việc trong nhóm thế nào?
118. Công cụ quản lý phiên bản (Git) sử dụng thế nào?
119. CI/CD là gì? Có áp dụng không?
120. Deploy dự án lên hosting nào? Quy trình?

---

# PHẦN 23: ĐÁNH GIÁ CUỐI

## 23.1. Điểm số

| Tiêu chí | Điểm (1-10) | Nhận xét |
|----------|-------------|----------|
| **Kiến trúc** | 8.0 | Layered Architecture rõ ràng, DI tốt, tách biệt interface/implementation |
| **Mở rộng** | 7.5 | Dễ thêm tính năng mới nhờ kiến trúc phân lớp, thiếu generic repository |
| **Bảo trì** | 7.0 | Code sạch, dễ đọc. Thiếu comment, thiếu unit test |
| **Trình bày** | 8.5 | Giao diện đẹp, responsive, UX tốt |
| **Chuẩn doanh nghiệp** | 6.5 | Thiếu logging, exception handling, unit test, CI/CD |
| **Bảo vệ đồ án** | 7.5 | Nhiều tính năng, kiến trúc tốt, dễ trình bày |

## 23.2. Điểm tổng kết: **7.5/10**

## 23.3. Rủi ro còn tồn tại

| Rủi ro | Mức độ | Mô tả | Giải pháp |
|--------|--------|-------|-----------|
| **JWT đang tắt** | 🔴 Cao | API không có bảo vệ | Bỏ comment trong Program.cs |
| **Không có Exception Handling** | 🔴 Cao | Lỗi không được bắt, trả về 500 mặc định | Thêm ExceptionHandlerMiddleware |
| **Frontend dùng localStorage** | 🟡 Trung bình | Dữ liệu không đồng bộ với server | Kết nối API backend |
| **ThanhToanService rỗng** | 🟡 Trung bình | Chức năng thanh toán chưa hoạt động | Implement service |
| **Không có Pagination** | 🟡 Trung bình | API trả toàn bộ dữ liệu, performance kém | Thêm pagination params |
| **Không có Unit Test** | 🟡 Trung bình | Không đảm bảo chất lượng code | Viết test cho Service |
| **Không có Logging** | 🟢 Thấp | Không trace được lỗi production | Thêm Serilog |
| **Soft Delete chưa có** | 🟢 Thấp | Xóa cứng mất dữ liệu | Thêm IsDeleted field |

## 23.4. Kết luận

Dự án **PCZONE** là một website thương mại điện tử bán máy tính và linh kiện PC được xây dựng với kiến trúc phân lớp (Layered Architecture) sử dụng ASP.NET Core Web API cho backend và HTML/CSS/JS thuần cho frontend. Dự án đã đạt khoảng **75%** tiến độ với hầu hết các chức năng chính đã được triển khai ở cả backend và frontend.

**Điểm mạnh:**
- Kiến trúc rõ ràng, đúng chuẩn
- Backend đầy đủ CRUD, quan hệ database tốt
- Frontend nhiều trang, giao diện đẹp
- Tính năng phong phú (Build PC, AI Chat, So sánh, FPS Calculator)

**Điểm yếu:**
- JWT Authentication đang tắt
- Frontend chưa kết nối hoàn toàn với Backend
- Thiếu Exception Handling, Logging, Unit Test
- ThanhToanService chưa triển khai

**Khuyến nghị:**
Ưu tiên hàng đầu là bật JWT, thêm Exception Handling Middleware, và kết nối Admin Frontend với Backend API. Sau đó hoàn thiện ThanhToanService và thêm Pagination cho API. Cuối cùng là viết Unit Test và triển khai lên hosting.

---

> **Tài liệu này được tạo tự động dựa trên phân tích toàn bộ source code dự án PCZONE.**
> 
> **Tổng số file đã phân tích:** ~80 files
> **Tổng số dòng code ước tính:** ~15,000+ dòng
> 
> *Hết báo cáo.*