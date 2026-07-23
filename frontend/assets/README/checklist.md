# CODE REVIEW CHECKLIST - PCZONE

## Mức đánh giá tổng quan

| Tiêu chí | Điểm | Nhận xét |
|----------|------|----------|
| Kiến trúc | 9.5/10 | Layered Architecture rõ ràng |
| Clean Code | 8.5/10 | Tốt, còn vài điểm cần tối ưu |
| Readability | 9/10 | Dễ đọc |
| Maintainability | 9/10 | Dễ mở rộng |
| Reusability | 8/10 | Có thể tái sử dụng tốt hơn |
| Spaghetti Code | 2/10 | Rất ít, chủ yếu phía Frontend |
| Coupling | 8.5/10 | Khá thấp |
| Cohesion | 9/10 | Cao |
| Naming | 9/10 | Đồng nhất |
| Scalability | 8.5/10 | Có thể mở rộng |

=> Đánh giá tổng thể: 8.9/10

---

# I. Kiểm tra Spaghetti Code

## Controller

✅ Controller chỉ nên:

- Nhận Request
- Validate DTO
- Gọi Service
- Trả Response

Không nên:

- Query EF
- Business Logic
- if else quá nhiều
- foreach xử lý nghiệp vụ

Nếu có:

```csharp
public IActionResult TaoDonHang(...)
{
    // 150 dòng
}
```

=> Spaghetti.

Mỗi Action nên khoảng

20-40 dòng.

---

## Service

Service là nơi chứa Business Logic.

Đây là nơi được phép có:

- if
- switch
- foreach

Nhưng nên:

Tách thành các hàm nhỏ.

Ví dụ

Sai

XuLyDonHang()

300 dòng

Đúng

KiemTraTonKho()

TinhTien()

ApDungCoupon()

CapNhatKho()

GuiThongBao()

---

## Repository

Repository chỉ:

CRUD

Không Business Logic.

Nếu Repository bắt đầu:

Tính tiền

Áp coupon

Gửi Email

=> Sai.

---

## Frontend JS

Đây là nơi dễ bị Spaghetti nhất.

Ví dụ:

product.js

1500 dòng

=> nên chia:

api.js

product-service.js

product-ui.js

product-event.js

product-render.js

---

# II. SOLID

## S

Single Responsibility

Một class chỉ một nhiệm vụ.

Ví dụ

SanPhamService

chỉ xử lý sản phẩm.

Không xử lý:

Coupon

Order

Review

---

## O

Open Closed

Muốn thêm chức năng

Không sửa class cũ quá nhiều.

Ví dụ

ThanhToan

Sau này thêm

VNPay

MoMo

QR

=> tạo Strategy.

---

## L

Không override làm thay đổi hành vi.

---

## I

Interface nhỏ.

ISanPhamService

IDonHangService

Không tạo

IAllService

---

## D

Đã dùng Dependency Injection.

Đây là điểm cộng lớn.

---

# III. DRY

Don't Repeat Yourself

Kiểm tra:

Có copy cùng đoạn

Fetch API

Alert

Format tiền

Không?

Nếu có

=> Helper.

Ví dụ

formatCurrency()

showToast()

fetchApi()

---

# IV. KISS

Keep It Simple

Nếu

if

else

switch

lồng quá

=> Refactor.

Không nên:

if

 if

   if

     if

---

# V. YAGNI

Không viết trước:

AI

Realtime

Notification

...

nếu chưa dùng.

---

# VI. Naming

Tên class

DanhMucService

SanPhamRepository

...

Đúng.

Không nên

abc

temp

data1

newData

---

# VII. Function

Một hàm

Một việc.

Không quá

40-60 dòng.

Nếu hơn

=> chia.

---

# VIII. Magic Number

Sai

if(price>5000000)

Đúng

const GIA_TOI_THIEU...

---

# IX. Comment

Comment:

Tại sao.

Không comment:

price++

---

# X. Exception

Không

try catch

ở mọi nơi.

Nên:

Middleware.

---

# XI. Validation

Đã dùng DTO.

Nên thêm

Data Annotation.

Ví dụ

[Required]

[StringLength]

[Range]

---

# XII. Logging

Không

Console.WriteLine()

Nên

ILogger

hoặc

Serilog.

---

# XIII. Async

Database

API

đều

async await.

Không dùng

.Result

.Wait()

---

# XIV. Folder

Hiện tại

Controllers

Services

Repositories

Models

DTOs

Helpers

Middleware

Data

=> Chuẩn.

Không cần thêm.

Có thể bổ sung:

Common/

Constants/

Extensions/

Configurations/

nếu dự án lớn.

---

# XV. Frontend

Nên chia:

pages/

components/

services/

utils/

config/

assets/

Hiện tại

JS còn có thể chia nhỏ hơn.

---

# XVI. File quá lớn

Tiêu chí

>500 dòng

=> xem xét tách.

>1000 dòng

=> nên tách.

---

# XVII. Controller

Một Controller

5-10 API

là đẹp.

Nếu

20+

=> chia.

---

# XVIII. DTO

Create

Update

Response

nên tách riêng.

Không dùng Model trả trực tiếp.

---

# XIX. API

Chuẩn REST

GET

POST

PUT

DELETE

Đã ổn.

---

# XX. Security

Không Hardcode

Password

Connection String

API Key

Dùng

.env

hoặc Secret.

---

# XXI. Test

Nên kiểm tra

Build

Warning

Swagger

CRUD

404

400

500

Null

Duplicate

Empty Data

---

# XXII. Performance

Kiểm tra

N+1 Query

LINQ

Index

Pagination

Cache

---

# XXIII. SonarQube

Nếu dùng SonarQube

Các chỉ số đẹp:

Bugs = 0

Vulnerabilities = 0

Security Hotspots = Review

Duplications <3%

Coverage >70%

Maintainability = A

Reliability = A

Security = A

---

# XXIV. Code Metrics

Cyclomatic Complexity

<10

Method Lines

<40

Class Lines

<300

Parameters

<=4

Nesting

<=3

---

# XXV. Đề xuất cải tiến hiện tại

Ưu tiên cao

✔ Chia nhỏ các file JS lớn.

✔ Bật JWT.

✔ Hoàn thiện ThanhToanService.

✔ Thay localStorage bằng Backend API.

✔ Thêm Global Exception Middleware.

✔ Thêm Validation đầy đủ.

✔ Thêm Pagination.

✔ Thêm Logging.

Ưu tiên trung bình

✔ Constants.

✔ Extension Methods.

✔ Mapping (AutoMapper).

✔ Response Wrapper.

✔ Unit Test.

Ưu tiên thấp

✔ Cache.

✔ Rate Limiting.

✔ Health Check.

✔ Docker.

✔ CI/CD.
