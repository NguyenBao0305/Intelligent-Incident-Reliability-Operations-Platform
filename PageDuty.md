**PagerDuty** là một nền tảng vận hành đám mây (Operations Cloud / Incident Response Platform) hàng đầu thế giới dành cho đội ngũ DevOps, SRE (Site Reliability Engineering) và IT Operations.

Mục tiêu chính của PagerDuty là: **Phát hiện sự cố kỹ thuật ngay lập tức $\rightarrow$ Tự động lọc bão cảnh báo $\rightarrow$ Định tuyến đúng người trực ca $\rightarrow$ Hỗ trợ dập sự cố nhanh nhất $\rightarrow$ Phân tích nguyên nhân để phòng ngừa.**

Dưới đây là bức tranh toàn cảnh về **các phân hệ chức năng chính** trên nền tảng Web của PagerDuty:

---

### 1. Phân hệ Quản lý Dịch vụ (Service Directory & Health Status)

Giao diện giúp quản lý danh mục toàn bộ các hệ thống, phần mềm và hạ tầng của doanh nghiệp.

* **Service Catalog:** Liệt kê tất cả các microservices (ví dụ: `Payment-Service`, `User-Auth-Service`, `Cart-API`).
* **Service Dependencies:** Bản đồ mối quan hệ giữa các dịch vụ (Dịch vụ A sập sẽ kéo theo Dịch vụ B bị ảnh hưởng như thế nào).
* **Service Health Scorecard:** Hiển thị trạng thái "sức khỏe" thời gian thực của từng dịch vụ (Green = Normal, Yellow = Warning/Degraded, Red = Critical Incident).

---

### 2. Phân hệ Tiếp nhận & Thu gọn Cảnh báo (Event Orchestration & AIOps)

Đây là "cổng vào" tiếp nhận hàng triệu dữ liệu cảnh báo từ các hệ thống giám sát (như Datadog, Prometheus, AWS CloudWatch, Grafana, GitHub) gửi về qua Webhook/API.

* **Alert Ingestion & Aggregation:** Tiếp nhận và chuẩn hóa dữ liệu cảnh báo từ hàng trăm nguồn khác nhau.
* **Noise Reduction (Khử bão cảnh báo):** Khi một server bị sập, nó có thể phát ra 1,000 cảnh báo cùng lúc. AI/Rule-engine của PagerDuty sẽ tự động **gom (deduplicate & group)** 1,000 cảnh báo rác đó lại thành **1 Incident duy nhất**.
* **Change Event Tracking:** Ghi vết các sự kiện thay đổi hạ tầng (như vừa Deploy phiên bản code mới, vừa sửa cấu hình DB). Khi sự cố xảy ra, PagerDuty sẽ chỉ ra ngay: *"Sự cố này xuất hiện 2 phút sau khi Dev A vừa deploy commit X"*.

---

### 3. Phân hệ Lịch trực & Chuyển cấp (On-Call Schedules & Escalation Policies)

Đảm bảo khi có lỗi xảy ra, **luôn có kỹ thuật viên nhận nhiệm vụ** bất kể ngày hay đêm.

* **On-Call Schedules (Lịch trực On-Call):**
* Tạo lịch trực luân phiên (Rotation) theo ngày, tuần, ca sáng/tối.
* Hỗ trợ tính năng "Override" (cho phép nhân viên xin đổi ca trực hoặc trực thay đồng nghiệp).


* **Escalation Policies (Chính sách chuyển cấp xử lý):**
* *Level 1:* Gửi thông báo cho Kỹ thuật viên A (người đang trực On-Call).
* *Quy tắc timeout:* Nếu sau 5 phút mà Kỹ thuật viên A không bấm **Acknowledge (Xác nhận)**, hệ thống tự động đẩy cảnh báo sang *Level 2* (Kỹ thuật viên B hoặc Team Lead).
* *Level 3:* Nếu sau 10 phút vẫn không ai phản hồi, tự động báo động cho Trưởng phòng/CTO.



---

### 4. Trung tâm Điều hành & Vòng đời Sự cố (Incident Command Center)

Giao diện chính để kỹ thuật viên trực tiếp thao tác và dập tắt sự cố.

* **Vòng đời trạng thái (Incident State Machine):**
1. **Triggered:** Sự cố vừa bùng phát.
2. **Acknowledged:** Đã có kỹ thuật viên nhận xử lý (ngừng đếm ngược Escalation).
3. **Resolved:** Đã khắc phục xong sự cố.
4. **Reassigned/Escalated:** Chuyển sự cố cho nhóm chuyên môn khác.


* **War Room / Incident Command Console:**
* Tự động khởi tạo phòng họp khẩn cấp (tích hợp sẵn Zoom, Slack channel, MS Teams) chỉ bằng 1 nút bấm.
* Hiển thị **Timeline chi tiết**: Ai đã nhận lỗi, ai đã chạy script sửa, ai vừa nhắn tin trong Slack.


* **Status Page Integration:** Tự động phát thông báo lên trang trạng thái công khai để khách hàng biết hệ thống đang bảo trì/gặp sự cố.

---

### 5. Tự động hóa & Tự phục hồi (Automation Actions & Runbooks)

Xử lý sự cố không cần con người can thiệp thủ công đối với các lỗi phổ biến.

* **Auto-remediation / Interactive Runbooks:** Cho phép gắn các script tự động vào ticket. Kỹ thuật viên chỉ cần nhấn nút *"Restart Pod"* hoặc *"Clear Cache"* ngay trên Web Dashboard, PagerDuty sẽ kích hoạt webhook gọi tới Kubernetes/AWS để xử lý.
* **Event-driven Automation:** Tự động kích hoạt script tự sửa lỗi khi cảnh báo vừa chạm ngưỡng P1/Critical.

---

### 6. Báo cáo, Đo lường & Học tập (Analytics & Postmortems)

Đo lường hiệu suất vận hành của toàn bộ hệ thống IT và năng lực của đội ngũ kỹ thuật.

* **Chỉ số vận hành cốt lõi:**
* **MTTD (Mean Time to Detect):** Thời gian trung bình từ lúc lỗi phát sinh đến khi hệ thống bắt được.
* **MTTA (Mean Time to Acknowledge):** Thời gian trung bình từ lúc báo động đến khi có người nhận.
* **MTTR (Mean Time to Resolve):** Thời gian trung bình để sửa xong một lỗi.


* **Postmortem Generator (Báo cáo sau sự cố):** Tự động tổng hợp toàn bộ timeline của sự cố thành một tài liệu mổ xẻ nguyên nhân (Post-Incident Review - PIR), giúp nhóm họp rút kinh nghiệm.
* **On-Call Health & Burnout Analytics:** Đo lường số lần nhân viên bị dựng dậy lúc nửa đêm. Nếu một kỹ thuật viên bị nháy máy quá nhiều lần trong tuần, hệ thống sẽ cảnh báo nguy cơ kiệt sức (burnout).

---

### Tổng kết mô hình Giao diện Web PagerDuty

Nếu phân chia theo vai trò người dùng (Roles) trên Web App:

1. **SRE / Kỹ thuật viên (Responder):** Nhìn thấy danh sách Incident cần xử lý, bấm Ack/Resolve, xem log, chạy Runbook tự động sửa lỗi.
2. **Quản lý / Team Lead:** Nhìn thấy Lịch trực On-Call (Calendar), Bảng đo lường chỉ số MTTR/MTTA, cài đặt chính sách Escalation Policy.
3. **Quản trị viên (Admin/Architect):** Cấu hình tích hợp Webhook/API với các bên thứ ba (Datadog, AWS, GitHub), phân quyền User/Team, cấu hình quy tắc lọc rác AIOps.
