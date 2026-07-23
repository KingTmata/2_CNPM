Phần 1. Phân tích Yêu cầu
1.1. Personas

Persona 1 – Sinh viên CNTT
Nguyễn Minh, 20 tuổi, sinh viên năm nhất ngành Công nghệ Thông tin.
Minh thường xuyên cần laptop để lập trình, học tập và làm đồ án. Tuy nhiên, Minh gặp khó khăn trong việc lựa chọn sản phẩm phù hợp với nhu cầu và ngân sách hạn hẹp của sinh viên.
Minh mong muốn có một website giúp dễ dàng tìm kiếm, so sánh cấu hình và nhận tư vấn sản phẩm phù hợp.

Persona 2 – Nhân viên văn phòng
Trần Hoàng, 28 tuổi, làm việc trong lĩnh vực kế toán.
Hoàng cần một bộ máy tính ổn định để phục vụ công việc hàng ngày. Tuy nhiên, anh không có nhiều kiến thức về phần cứng và thường bối rối khi lựa chọn sản phẩm giữa hàng trăm lựa chọn trên thị trường.
Hoàng mong muốn có một hệ thống giúp gợi ý cấu hình phù hợp với công việc và hỗ trợ đặt hàng nhanh chóng.

Persona 3 – Game thủ
Lê Quốc Anh, 22 tuổi, game thủ thường xuyên chơi các tựa game AAA đòi hỏi cấu hình cao.
Quốc Anh cần tìm kiếm linh kiện như VGA, CPU, RAM với hiệu năng cao, muốn xem đánh giá chi tiết. Anh cũng muốn kiểm tra tương thích trước khi mua.
Quốc Anh mong muốn một website cung cấp đầy đủ thông số kỹ thuật, benchmark hiệu năng, công cụ build PC và hỗ trợ so sánh cấu hình.

Persona 4 – IT doanh nghiệp
Thanh Hà, 35 tuổi, trưởng phòng IT của một công ty vừa, phụ trách mua sắm thiết bị định kỳ.
Hà phải liên hệ nhiều nhà cung cấp, lập bảng so sánh thủ công và xử lý thủ tục báo giá, hóa đơn VAT phức tạp khi mua số lượng lớn.
Hà mong muốn hệ thống hỗ trợ đặt hàng số lượng lớn, nhận báo giá nhanh, xuất hóa đơn VAT và quản lý đơn hàng doanh nghiệp hiệu quả.

1.2. User Stories

•	User Story 1: Là một game thủ, tôi muốn xem cấu hình chi tiết và đánh giá hiệu năng sản phẩm để đưa ra quyết định mua hàng chính xác và tối ưu ngân sách.
•	User Story 2: Là một khách hàng mua máy tính, tôi muốn so sánh sản phẩm và nhận thông báo về các chương trình giảm giá để không bỏ lỡ cơ hội mua hàng với giá tốt nhất.
•	User Story 3: Là một IT doanh nghiệp, tôi muốn đặt hàng số lượng lớn và nhận báo giá nhanh kèm hóa đơn VAT, để tiết kiệm thời gian xử lý hợp đồng mua sắm thiết bị.

1.3. User Journey

Khi Nguyễn Minh cần mua một chiếc laptop mới phục vụ học tập, Minh mở website.
Tại trang sản phẩm, Minh tìm kiếm laptop theo nhu cầu sử dụng, xem chi tiết cấu hình và thêm sản phẩm vào giỏ hàng. Hệ thống lưu sản phẩm trong giỏ hàng và đề xuất các sản phẩm tương tự.
Sau khi hoàn tất lựa chọn, Minh tiến hành đăng nhập vào hệ thống và thanh toán qua ví điện tử. Hệ thống cập nhật trạng thái đơn hàng và gửi email xác nhận.
Minh có thể theo dõi toàn bộ tiến trình đơn hàng trên Dashboard và đánh giá sản phẩm sau khi nhận hàng.

1.4. User Flow

[Mở Website] → [Đăng nhập / Đăng ký]
→ [Xem Trang Chủ] → [Tìm kiếm / Duyệt Danh mục]
→ [Xem Chi tiết Sản phẩm] → [So sánh Sản phẩm]
→ [PC Builder & Kiểm tra Tương thích] ← (nhánh riêng cho gamer/build PC)
→ [Thêm vào Giỏ hàng] → [Thanh toán (COD / Chuyển khoản / Ví điện tử)]
→ [Xác nhận Đơn hàng] → [Theo dõi Vận chuyển] → [Nhận hàng & Đánh giá]
→ [Dashboard Khách hàng] → [Thoát]
 
Phần 2. Product Vision

Sự phát triển của công nghệ khiến nhu cầu mua sắm máy tính và linh kiện ngày càng tăng. Tuy nhiên, nhiều khách hàng gặp khó khăn trong việc lựa chọn sản phẩm phù hợp với nhu cầu sử dụng và ngân sách. Mục tiêu của dự án là xây dựng một website thương mại điện tử chuyên bán máy tính, laptop và linh kiện PC với khả năng tư vấn thông minh và quản lý đơn hàng hiệu quả.

For	Khách hàng có nhu cầu mua máy tính, laptop và linh kiện công nghệ — bao gồm cá nhân, sinh viên, game thủ và doanh nghiệp.
Who	Thường gặp khó khăn trong việc lựa chọn sản phẩm, so sánh cấu hình, kiểm tra tương thích linh kiện và theo dõi đơn hàng.
The product	Một website bán máy tính và linh kiện công nghệ tích hợp công nghệ AI.
That	Hỗ trợ tìm kiếm sản phẩm, so sánh cấu hình, build PC, quản lý đơn hàng và tư vấn mua sắm thông minh.
Unlike	Các website thương mại điện tử thông thường chỉ tập trung vào việc bán hàng và quảng cáo, thiếu công cụ so sánh và kiểm tra tương thích linh kiện chuyên sâu.
Our product	Kết hợp thương mại điện tử với trợ lý AI tư vấn cấu hình, công cụ PC Builder và hỗ trợ đặt hàng doanh nghiệp trong một hệ thống thống nhất.

 
Phần 3. Tính năng Hệ thống

Module 1: Authentication System (Xác thực)
•	F01. Đăng ký & Kích hoạt tài khoản: Tạo tài khoản qua Email/Mật khẩu hoặc Google OAuth, xác thực email.
•	F02. Đăng nhập & Bảo mật: Xác thực người dùng, hỗ trợ 'Ghi nhớ đăng nhập', 'Quên mật khẩu', phân quyền Admin / Khách hàng / Doanh nghiệp.

Module 2: Product Management (Quản lý Sản phẩm)
•	F03. Quản lý sản phẩm (Admin): Thêm, sửa, xóa sản phẩm (linh kiện rời, PC nguyên bộ, laptop), upload hình ảnh, nhập thông số kỹ thuật.
•	F04. Quản lý danh mục: Phân cấp danh mục — CPU, GPU, RAM, Mainboard, Storage, PSU, Case, Laptop, PC nguyên bộ.

Module 3: Search & Filter (Tìm kiếm & Lọc)
•	F05. Tìm kiếm nâng cao: Tìm theo tên, hãng, model với gợi ý tự động.
•	F06. Bộ lọc thông minh: Lọc theo danh mục, khoảng giá, thương hiệu, thông số kỹ thuật. Hỗ trợ so sánh nhiều sản phẩm cùng lúc.

Module 4: PC Builder & Compatibility Checker
•	F07. Công cụ Build PC: Cho phép chọn từng linh kiện (CPU, Mainboard, RAM, GPU, SSD, PSU, Case) và kiểm tra tương thích tự động theo rule-based (socket, DDR, wattage...).

Module 5: Shopping Cart System (Giỏ hàng)
•	F08. Quản lý giỏ hàng: Thêm, cập nhật số lượng, xóa sản phẩm. Lưu giỏ hàng khi đăng nhập.

Module 6: Order Management (Đơn hàng)
•	F09. Tạo đơn hàng & Thanh toán: Hỗ trợ COD, chuyển khoản ngân hàng, ví điện tử (MoMo, VNPAY). Nhập địa chỉ giao hàng, chọn đơn vị vận chuyển.
•	F10. Theo dõi trạng thái đơn hàng: Cập nhật theo thời gian thực — Đang xử lý, Đang giao, Đã nhận. Gửi email xác nhận và thông báo vận chuyển.

Module 7: AI Product Assistant (Trợ lý AI)
•	F11. AI tư vấn cấu hình: Sử dụng Gemini API để tư vấn cấu hình phù hợp theo ngân sách và nhu cầu sử dụng bằng ngôn ngữ tự nhiên.

Module 8: B2B / Enterprise Orders (Doanh nghiệp)
•	F13. Đặt hàng số lượng lớn: Tạo yêu cầu báo giá với số lượng và cấu hình cụ thể, nhận báo giá chiết khấu theo số lượng.
•	F14. Hóa đơn VAT: Xuất hóa đơn VAT điện tử, quản lý thông tin doanh nghiệp.

Module 9: Notification System (Thông báo)
•	F15. Thông báo giao hàng: Gửi email/push notification khi sản phẩm trong quá trình mua hàng.

Module 10: Dashboard System (Báo cáo)
•	F16. Dashboard Khách hàng: Lịch sử mua hàng, trạng thái đơn hàng
•	F17. Dashboard Admin: Thống kê doanh thu, sản phẩm bán chạy, quản lý tồn kho, báo cáo đơn hàng.

 
Phần 4. Scenarios, Epics & Product Backlog

4.1. Scenarios

Scenario 1 – Sinh viên mua laptop
Nguyễn Minh cần mua một chiếc laptop để học lập trình. Minh truy cập website, tìm kiếm laptop theo mức giá và cấu hình mong muốn, dùng tính năng so sánh để chọn giữa 2 mẫu. Sau khi chọn sản phẩm phù hợp, Minh thêm vào giỏ hàng và tiến hành thanh toán qua MoMo. Hệ thống tạo đơn hàng, gửi email xác nhận và Minh theo dõi trạng thái giao hàng trên giỏ hàng.

Scenario 2 – Game thủ dùng AI tư vấn
Quốc Anh muốn nâng cấp máy tính để chơi game AAA. Anh sử dụng AI Product Assistant, nhập ngân sách 20 triệu và nhu cầu gaming. Hệ thống tự động đề xuất CPU, VGA, RAM và SSD phù hợp, sau đó thêm toàn bộ vào giỏ hàng và đặt hàng.

4.2. Epics

•	Epic 1 – User Authentication: Đăng ký, đăng nhập, phân quyền Admin / Khách hàng 
•	Epic 2 – Product Management: Quản lý danh mục, thêm/sửa/xóa sản phẩm, upload hình ảnh và thông số kỹ thuật.
•	Epic 3 – Search & Filter: Tìm kiếm sản phẩm, lọc đa tiêu chí, so sánh sản phẩm, gợi ý tự động.
•	Epic 4 – PC Builder & Compatibility: Công cụ build PC, kiểm tra tương thích linh kiện tự động theo rule-based.
•	Epic 5 – Shopping Cart & Checkout: Quản lý giỏ hàng, quy trình thanh toán, tích hợp COD/chuyển khoản/ví điện tử.
•	Epic 6 – Order Management: Tạo đơn hàng, theo dõi trạng thái, thông báo vận chuyển, đánh giá sản phẩm.
•	Epic 7 – AI Product Assistant: Tư vấn cấu hình ngôn ngữ tự nhiên (Gemini API), đề xuất sản phẩm phù hợp.
•	Epic 8 – B2B / Enterprise: Đặt hàng số lượng lớn, báo giá, hóa đơn VAT

4.3. Product Backlog

ID	Product Backlog Item	Priority
PB01	Đăng ký tài khoản	High
PB02	Đăng nhập & Bảo mật	High
PB03	Xem danh sách & Chi tiết sản phẩm	High
PB04	Tìm kiếm & Bộ lọc sản phẩm	High
PB05	So sánh sản phẩm	High
PB06	Quản lý sản phẩm (Admin)	High
PB07	Giỏ hàng	High
PB08	Thanh toán (COD / Chuyển khoản / Ví điện tử)	High
PB09	Theo dõi trạng thái đơn hàng	High
PB10	Dashboard Khách hàng & Admin	High
PB11	PC Kiểm tra tương thích	Medium
PB12	AI tư vấn cấu hình (Gemini API)	Medium
PB13	Đặt hàng doanh nghiệp & Báo giá VAT	Medium
PB14	Thông báo giảm giá	Low
PB15	Đánh giá sản phẩm 	Low

 
Phần 5. Kiến trúc Phần mềm

5.1. Tầm quan trọng của Kiến trúc Phần mềm
•	Định hướng phát triển hệ thống: Xác định cách các thành phần Frontend, Backend, Database và AI kết nối với nhau.
•	Dễ bảo trì và mở rộng: Khi thêm tính năng mới, hệ thống ít bị ảnh hưởng.
•	Tăng khả năng làm việc nhóm: Mỗi thành viên biết rõ phần việc và cách các module tương tác.
•	Giảm rủi ro và chi phí: Hạn chế phải sửa đổi lớn khi dự án phát triển.

5.2. Kiến trúc Tổng thể

Browser → Frontend (HTML/CSS/JS) → REST API → Backend (ASP.NET Core – C#) →SQL sever → Gemini API

5.3. Kiến trúc Client-Server

Hệ thống áp dụng mô hình Client–Server nhằm tách biệt giao diện người dùng và xử lý nghiệp vụ.

Tầng	Mô tả
Client (Frontend)	Hiển thị UI, tiếp nhận thao tác người dùng, kiểm tra dữ liệu đầu vào cơ bản, gửi request đến Backend qua REST API, nhận và hiển thị JSON.
Server (Backend – ASP.NET Core C#)	Xử lý nghiệp vụ hệ thống, xác thực dữ liệu, quản lý đơn hàng, giao tiếp cơ sở dữ liệu, gọi Gemini API, trả kết quả JSON về Frontend.
SQL sever	Lưu trữ toàn bộ dữ liệu hệ thống như người dùng, sản phẩm, đơn hàng, thanh toán và hóa đơn. SQL Server được lựa chọn vì hỗ trợ cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn dữ liệu, hỗ trợ truy vấn phức tạp và phù hợp với các hệ thống thương mại điện tử.
Gemini API	Xử lý tư vấn cấu hình ngôn ngữ tự nhiên: nhận ngân sách và nhu cầu từ Backend, trả về gợi ý linh kiện phù hợp.







5.4. Các thực thể chính

Bảng	Các thuộc tính chính
Users	id, email, password_hash, full_name, phone, address, role (customer/admin/enterprise), created_at, updated_at
Products	id, category_id, name, description, price, stock_quantity, image_url, specifications (JSON), created_at, updated_at
Categories	id, name, description, parent_id
Carts	id, user_id, created_at
CartItems	id, cart_id, product_id, quantity
Orders	id, user_id, total_amount, status, payment_method, shipping_address, created_at
OrderDetails	id, order_id, product_id, quantity, price
Reviews	id, user_id, product_id, rating, comment, created_at
PCBuilds	id, user_id, name, components (JSON: cpu_id, gpu_id, ram_id...), is_compatible, total_price, created_at
EnterpriseQuotes	id, user_id, items (JSON), quantity, status, total_amount, vat_invoice_url, created_at
AIRecommendations	id, user_id, budget, use_case, recommendation_content, created_at
Inventory	id, product_id, quantity_in, quantity_out, note, created_at

5.5. Mối quan hệ giữa các thực thể

•	Một User có thể tạo nhiều Orders.
•	Một User có một Cart, Cart có nhiều CartItems.
•	Một Order có nhiều OrderDetails.
•	Một Product thuộc một Category.
•	Một Product có thể có nhiều Reviews.
•	Một Product xuất hiện trong nhiều OrderDetails và CartItems.
•	Một User có thể lưu nhiều PCBuilds.
•	Một PCBuild chứa nhiều Products (linh kiện).
•	Một User doanh nghiệp có thể tạo nhiều EnterpriseQuotes.
•	Một User có thể nhận nhiều AIRecommendations.