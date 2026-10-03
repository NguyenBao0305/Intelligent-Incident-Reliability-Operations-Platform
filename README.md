# NexusOps — Intelligent Incident & Reliability Operations Platform

NexusOps là nền tảng web hỗ trợ đội ngũ kỹ thuật tiếp nhận cảnh báo, phối hợp xử lý sự cố và rút kinh nghiệm sau vận hành. Hệ thống tập hợp incident, người phụ trách, bằng chứng điều tra và lịch sử xử lý để đội ngũ biết **đang có sự cố gì, ai đang xử lý và bước tiếp theo là gì**.

**Cập nhật: 03/10/2026.** Phiên bản hiện tại là prototype frontend: landing page với Products/Solutions, Login/Sign Up và workspace Responder có dữ liệu mẫu. Các thao tác trong workspace mô phỏng nghiệp vụ; xác thực thật, backend, database, mô hình AI và executor chưa được kết nối. Phạm vi MVP phục vụ **một tổ chức và một team**.

[MVP Scope.md](MVP%20Scope.md) là nguồn đặc tả nghiệp vụ. [Detailed description.md](Detailed%20description.md) trình bày định hướng mở rộng. README này giải thích giao diện và trạng thái hiện thực; các mục ghi **theo MVP** mô tả chức năng dự kiến, các mục ghi **demo** mô tả những gì có thể thao tác hiện tại.

## Mục lục

1. [Tổng quan hệ thống](#tong-quan)
2. [Login và tài khoản demo](#login)
3. [Sign Up theo lời mời](#signup)
4. [Products: Product và Platform](#products)
5. [Solutions: các tình huống sử dụng](#solutions)
6. [Pricing — Gói Free](#pricing)
7. [Workspace Responder và thuật ngữ giao diện](#workspace)
8. [Trạng thái hiện thực](#hien-trang)
9. [Chạy frontend](#chay-frontend)

<a id="tong-quan"></a>

## 1. Tổng quan hệ thống trên web

### 1.1. Bài toán NexusOps giải quyết

Khi một dịch vụ gặp lỗi, công cụ giám sát có thể phát ra nhiều cảnh báo liên tiếp. Đội ngũ kỹ thuật cần xác định những cảnh báo nào liên quan đến cùng một sự cố, ai đang trực, ai đã nhận xử lý và những hành động nào đã được thực hiện. Sau khi dịch vụ phục hồi, đội ngũ còn cần tổng hợp diễn biến để cải thiện cách vận hành.

NexusOps được thiết kế để hỗ trợ chu trình đó:

```text
Dịch vụ được giám sát
        ↓
Công cụ giám sát phát hiện bất thường và gửi sự kiện
        ↓
NexusOps tiếp nhận cảnh báo và tổ chức thành sự cố
        ↓
Thông báo cho người phụ trách → ACK → Điều tra và phối hợp xử lý
        ↓
Resolve → Đánh giá sau sự cố → Thống kê và lưu tri thức
```

Trong mô hình này, công cụ giám sát bên ngoài có thể là Prometheus kết hợp Alertmanager hoặc một nguồn cảnh báo được tích hợp qua adapter. NexusOps đảm nhiệm lớp quản lý và điều phối xử lý sự cố. Việc kết nối một công cụ cụ thể còn cần hiện thực adapter phù hợp với hợp đồng sự kiện của MVP.

### 1.2. Những khái niệm chính

| Khái niệm | Ý nghĩa trong NexusOps |
|---|---|
| Service | Dịch vụ hoặc thành phần phần mềm cần theo dõi và quản lý sự cố, ví dụ `payments-api`. |
| Alert | Cảnh báo về một bất thường được gửi từ nguồn giám sát. |
| Incident | Sự cố cần được quản lý và xử lý; có thể liên kết với nhiều alert. |
| ACK — Acknowledge | Xác nhận đã nhận trách nhiệm xử lý sự cố. ACK chưa có nghĩa là sự cố đã được giải quyết. |
| Resolve | Ghi nhận sự cố đã được giải quyết theo điều kiện nghiệp vụ. |
| On-call | Người được phân công trực để tiếp nhận và xử lý sự cố. |
| Escalation | Chuyển việc thông báo đến mức phụ trách tiếp theo khi chưa có người ACK trong thời hạn quy định. |
| Runbook | Quy trình hoặc hành động xử lý được định nghĩa trước. MVP giới hạn việc thực thi trong sandbox. |
| PIR — Post-Incident Review | Bản đánh giá sau sự cố, gồm diễn biến, tác động, bằng chứng và công việc cần cải thiện. |

### 1.3. Hai khu vực của website

| Khu vực | Người sử dụng | Mục đích | Hiện trạng |
|---|---|---|---|
| Trang chủ công khai — Landing page | Bất kỳ người truy cập nào | Giới thiệu NexusOps, các nhóm chức năng và lối vào Login/Sign Up | Đã có giao diện |
| Khu vực làm việc — Workspace | Người dùng có tài khoản và quyền phù hợp | Xem, tiếp nhận, điều tra, xử lý và đánh giá sự cố | Đã có dashboard Responder với dữ liệu mẫu |

Các hình minh họa incident, nhận xét khách hàng, tên công ty và số liệu trên landing page hiện là nội dung mẫu phục vụ dựng giao diện; không phải dữ liệu vận hành hay kết quả đánh giá đã được kiểm chứng.

<a id="login"></a>

## 2. Login — Đăng nhập

### 2.1. Mục đích và đối tượng sử dụng

Login là cổng vào workspace dành cho người đã có tài khoản trong tổ chức. Tất cả vai trò dùng chung một màn hình đăng nhập. Khi có backend, hệ thống sẽ xác định người dùng và quyền được cấp để cho phép truy cập chức năng tương ứng.

| Vai trò | Ý nghĩa theo MVP |
|---|---|
| Account Admin | Vai trò quản trị tài khoản, được seed toàn bộ các permission hiện khai báo trong M1. Thao tác nghiệp vụ vẫn cần kiểm tra phạm vi liên quan. |
| Team Manager | Vai trò quản lý team; M1 hiện cấp `SERVICE_MANAGE` để quản lý dịch vụ. |
| Responder | Vai trò xử lý sự cố; M1 cấp quyền ACK, Resolve, yêu cầu điều tra AI và thao tác automation, kèm điều kiện về phạm vi và trạng thái. |
| Viewer | Vai trò dự kiến phục vụ nhu cầu xem thông tin; quyền đọc cụ thể cần được chốt khi hiện thực phân quyền. |
| Incident Commander | Vai trò điều phối được phân công trên từng incident cho một tài khoản đã có. Đây không phải loại tài khoản đăng ký riêng và không tự cấp toàn bộ quyền của Responder. |

### 2.2. Giao diện đã hiện thực

Màn hình Login truy cập tại `/#login`, gồm:

- **Work email:** nhập email của tài khoản.
- **Password:** nhập mật khẩu, có nút hiện/ẩn nội dung.
- **Log in:** kiểm tra dữ liệu biểu mẫu khi gửi.
- **Need help signing in?:** hiển thị hướng dẫn liên hệ quản trị viên khi cần khôi phục quyền truy cập hoặc nhận lời mời mới.
- **Join your team:** chuyển sang màn hình Sign Up.
- **Back to home:** quay về landing page.

Form kiểm tra email hợp lệ và mật khẩu không để trống. Khi có lỗi, thông báo xuất hiện bên dưới trường tương ứng và focus chuyển đến trường cần sửa.

### 2.3. Trạng thái xử lý hiện tại

Login hỗ trợ **tài khoản demo Responder**: email `responder@nexusops.demo`, mật khẩu `NexusOps@2026`. Chọn **Use demo account** để điền nhanh rồi bấm **Log in** để mở `/#workspace`. Thông tin khác bị từ chối trong bản demo. Đây là dữ liệu công khai nằm trong mã frontend, không phải tài khoản thật trong database.

Frontend lưu một dấu hiệu phiên demo trong `sessionStorage`, không lưu mật khẩu người dùng nhập. Logout xóa dấu hiệu này; mở workspace khi chưa đăng nhập sẽ hiển thị Login. Cơ chế này chỉ phục vụ trình diễn, không thay thế xác thực và phân quyền phía server.

Trong luồng hoàn chỉnh theo MVP, backend chịu trách nhiệm xác minh thông tin đăng nhập, trạng thái tài khoản và quyền truy cập, đồng thời xử lý refresh/logout. Việc hiển thị hoặc ẩn chức năng trên frontend phải đi cùng kiểm tra quyền ở backend.

<a id="signup"></a>

## 3. Sign Up — Tạo tài khoản theo lời mời

### 3.1. Cách cấp tài khoản theo MVP

Sign Up phục vụ người được mời tham gia tổ chức/team. Người truy cập không tự tạo một tổ chức mới hoặc tự chọn role đặc quyền trên biểu mẫu đăng ký.

Luồng nghiệp vụ dự kiến:

1. Người quản trị được phép tạo lời mời cho email cần tham gia team.
2. Người được mời nhận thông tin lời mời và mở màn hình Sign Up.
3. Người đó nhập thông tin cá nhân, email được mời, mã mời và mật khẩu.
4. Backend kiểm tra lời mời, thời hạn, trạng thái đã sử dụng và email tương ứng.
5. Nếu hợp lệ, backend tạo tài khoản theo chính sách phân quyền của tổ chức và đánh dấu lời mời đã được sử dụng.
6. Người dùng sử dụng tài khoản để đăng nhập vào workspace.

Role do cơ chế quản trị phía backend quyết định. Chi tiết quyền tạo lời mời và cách gán role cần được chốt khi triển khai M1. Tài khoản Admin đầu tiên dự kiến được khởi tạo khi thiết lập hệ thống để bắt đầu quản trị tổ chức.

### 3.2. Giao diện đã hiện thực

Màn hình Sign Up truy cập tại `/#signup`, gồm:

| Trường | Tác dụng | Kiểm tra hiện tại trên frontend |
|---|---|---|
| Full name | Nhập tên người tham gia workspace | Không để trống |
| Invited email address | Nhập email được tổ chức mời | Kiểm tra định dạng email |
| Invitation code | Nhập mã lời mời | Không để trống; chưa xác minh mã có hợp lệ hay không |
| Password | Đặt mật khẩu cho tài khoản | Tối thiểu 8 ký tự theo quy tắc tạm thời của giao diện |
| Confirm password | Xác nhận lại mật khẩu | Phải trùng với Password |

Hai trường mật khẩu đều có nút hiện/ẩn. Giao diện có liên kết về Login và landing page. Khi người dùng điền email ở phần đầu landing page rồi chọn **Start for free**, email được chuyển sang biểu mẫu Sign Up trong trạng thái frontend; thao tác này chưa đăng ký tài khoản hay gửi email.

### 3.3. Trạng thái xử lý hiện tại

Gửi biểu mẫu hợp lệ chỉ hiển thị thông báo preview. Chưa có lời mời được phát hành hoặc xác minh, tài khoản được tạo, mật khẩu được lưu hay role được cấp. Quy tắc mật khẩu trên frontend sẽ cần đồng bộ với chính sách backend khi nối API.

<a id="products"></a>

## 4. Products — Các nhóm chức năng của nền tảng

Products trên landing page giới thiệu các năng lực của cùng nền tảng NexusOps, từ tiếp nhận cảnh báo đến rút kinh nghiệm sau xử lý.

**Dropdown Products chia thành Product và Platform.** Cách chia này trả lời hai câu hỏi khác nhau:

- **Product — người dùng làm công việc gì?** Gồm các luồng nghiệp vụ nhìn thấy trực tiếp trong quá trình xử lý incident, như tiếp nhận/điều phối, trực và chuyển cấp, điều tra, review sau sự cố.
- **Platform — những năng lực dùng chung nào giúp các luồng đó hoạt động?** Gồm danh mục service, tích hợp sự kiện, policy/phân quyền và audit. Các năng lực này có thể được nhiều Product sử dụng, vì vậy không cần lặp chúng như các Product độc lập.

Ví dụ: Product **Incident Management** dùng **Service Catalog** để biết alert thuộc service nào, dùng **Monitoring Integrations** để nhận sự kiện và dùng **Policies & Permissions** để xác định phạm vi truy cập/hành động. Product **AI Investigation & Automation** đọc ngữ cảnh có quyền và tạo action cần kiểm soát; **Audit Trail** lưu dấu vết quyết định. Một Platform có thể hỗ trợ nhiều Product.

Các mục trong dropdown hiện là nội dung giới thiệu, chưa dẫn đến trang sản phẩm riêng. Mô tả bên dưới là mục tiêu/đặc tả theo MVP; chúng không khẳng định mọi chức năng backend đã hoàn thành.

| Product — luồng nghiệp vụ | Platform — năng lực nền |
|---|---|
| Incident Management | Service Catalog |
| On-call & Escalation | Monitoring Integrations |
| AI Investigation & Automation | Policies & Permissions |
| Post-Incident Review & Insights | Audit Trail |

Hai cột trên liệt kê hai nhóm menu độc lập; các mục cùng một hàng không biểu thị quan hệ một-một. Quan hệ phụ thuộc thực tế là nhiều Product có thể cùng sử dụng nhiều năng lực Platform.

### 4.1. Product — Các luồng nghiệp vụ

#### 4.1.1. Incident Management — Quản lý sự cố

> Turn alerts into coordinated incident response.

**Mục đích:** tập hợp cảnh báo và thông tin xử lý thành một hồ sơ sự cố có người phụ trách và lịch sử rõ ràng.

**Chức năng theo MVP:**

- Tiếp nhận cảnh báo từ nguồn giám sát, áp dụng các rule đã cấu hình.
- Chống trùng cảnh báo đang mở và gom nhóm theo service, rule và khoảng thời gian của MVP.
- Tạo incident, hỗ trợ ACK và Resolve theo điều kiện nghiệp vụ.
- Lưu timeline và ghi chú để những người tham gia nắm được diễn biến xử lý.

**Tác dụng:** giảm việc theo dõi các cảnh báo rời rạc, làm rõ trách nhiệm và giúp người tiếp nhận sau hiểu những gì đã xảy ra. Ví dụ, các cảnh báo phù hợp cùng một quy tắc của `payments-api` có thể được tổ chức vào một incident để người trực theo dõi tập trung.

Phạm vi MVP dùng quy tắc xác định để gom nhóm trong cùng service; việc gom nhóm chưa dựa trên AI. ACK xác nhận đã tiếp nhận, còn Resolve là bước kết thúc xử lý theo trạng thái và điều kiện cho phép.

#### 4.1.2. On-call & Escalation — Trực và chuyển cấp

> Notify the right responders and escalate when needed.

**Mục đích:** đưa thông báo sự cố đến người được phân công và tiếp tục chuyển cấp khi chưa có ai xác nhận xử lý.

**Chức năng theo MVP:**

- Cấu hình người trực bằng phân công tĩnh.
- Cấu hình chính sách escalation gồm hai mức, các người nhận ở mỗi mức và người nhận dự phòng cuối cùng — backstop.
- Theo dõi thời hạn ACK và thực hiện nhắc lại/chuyển cấp trong giới hạn quy định.
- Cung cấp inbox thông báo có lưu trữ và cập nhật qua WebSocket; email phụ thuộc adapter được triển khai.

**Tác dụng:** tránh sự cố thiếu người phụ trách và giúp đội ngũ biết cần phản hồi trong thời hạn nào. Ví dụ, nếu người nhận mức đầu chưa ACK sau thời gian cấu hình, hệ thống chuyển thông báo đến mức tiếp theo.

Phạm vi hiện tại của MVP chưa gồm lịch trực luân phiên phức tạp hoặc đổi ca. Việc chuyển cấp có điểm dừng và backstop, không lặp vô hạn.

#### 4.1.3. AI Investigation & Automation — Điều tra AI và tự động hóa

> Investigate with evidence and review proposed actions.

**Mục đích:** hỗ trợ người xử lý tổng hợp bằng chứng, tìm giả thuyết và xem xét hành động phù hợp.

**Chức năng theo MVP:**

- Điều tra dựa trên thông tin incident, alert và lịch sử deployment có sẵn trong phạm vi được phép.
- Tra cứu sự cố cũ và tài liệu tri thức đã được phê duyệt bằng cơ chế RAG.
- Tổng hợp dữ kiện, giả thuyết, thông tin còn thiếu và đề xuất xử lý có dẫn chứng.
- Đề xuất runbook trong danh sách được phép; hỗ trợ người có quyền xem xét, phê duyệt hoặc từ chối action.
- Thực thi runbook trong sandbox với giới hạn tần suất, kiểm tra phạm vi và trạng thái thực thi.

**Tác dụng:** giảm công sức tập hợp ngữ cảnh và giúp người vận hành đưa ra quyết định dựa trên bằng chứng. Ví dụ, AI có thể chỉ ra một deployment gần thời điểm xuất hiện cảnh báo để người xử lý điều tra thêm; sự gần nhau về thời gian chưa đủ để kết luận deployment là nguyên nhân.

AI không tự phê duyệt hoặc trực tiếp gọi công cụ thực thi. Backend kiểm soát điều kiện chạy; approval không bỏ qua các giới hạn bảo vệ. MVP chưa cam kết tự khắc phục hoặc rollback hệ thống production.

#### 4.1.4. Post-Incident Review & Insights — Đánh giá sau sự cố và thống kê

> Learn from incidents and track response performance.

**Mục đích:** biến lịch sử xử lý thành nội dung có thể xem lại, đo lường và sử dụng để cải thiện vận hành.

**Chức năng theo MVP:**

- Tạo bản nháp PIR có hỗ trợ AI từ timeline, ghi chú, bằng chứng và kết quả hành động.
- Cho phép người có quyền chỉnh sửa, review, phê duyệt và hoàn tất PIR.
- Ghi nhận action items — các công việc cần thực hiện sau sự cố.
- Thống kê MTTA, MTTR và số mẫu được sử dụng để tính toán.
- Tra cứu audit trail để biết ai đã thực hiện hành động gì và vào thời điểm nào.

**Tác dụng:** giúp đội ngũ học từ sự cố, theo dõi tốc độ phản hồi và truy lại quyết định khi cần. Nội dung PIR đã được duyệt có thể trở thành nguồn tri thức hỗ trợ điều tra những sự cố tiếp theo.

Trong MVP, **MTTA** là thời gian trung bình từ lúc incident được tạo đến lần ACK đầu tiên; **MTTR** là thời gian trung bình từ lúc incident được tạo đến khi Resolve. Các chỉ số phải đi cùng số mẫu và phạm vi thời gian. Bản nháp do AI tạo vẫn cần người review trước khi được phê duyệt.

### 4.2. Platform — Các năng lực dùng chung

| Năng lực | Chức năng theo MVP | Vì sao thuộc Platform |
|---|---|---|
| **Service Catalog** | Lưu service, owner/team phụ trách, criticality và quan hệ phụ thuộc; làm cơ sở để gắn alert/incident với đúng service. | Incident, on-call, điều tra và thống kê đều cần cùng một nguồn thông tin service. |
| **Monitoring Integrations** | Nhận event từ nguồn giám sát qua adapter/integration; kiểm tra hợp đồng dữ liệu, idempotency, dedup/grouping và xử lý TRIGGER/RESOLVE theo thứ tự sự kiện. | Đây là đường vào dữ liệu vận hành, hỗ trợ tạo/cập nhật incident chứ không phải một workflow xử lý độc lập. |
| **Policies & Permissions** | Lưu cấu hình escalation và target/backstop; gán role/permission; kiểm tra team/service/incident scope trước thao tác ACK, Resolve, điều tra hoặc automation. | Các Product dùng chung quy tắc phân công và kiểm soát ai được xem/làm gì. Policy không thay thế kiểm tra quyền ở backend. |
| **Audit Trail** | Ghi actor, hành động, đối tượng và thời điểm; lưu dấu vết quyết định liên quan đến incident, approval và action để có thể truy lại. | Audit là nền trách nhiệm giải trình xuyên suốt nhiều luồng, không chỉ là báo cáo sau sự cố. Audit trail cũng khác log kỹ thuật dùng để debug ứng dụng. |

### 4.3. Cách sử dụng dropdown Products

- Bấm **Products** để mở hoặc đóng dropdown.
- Desktop hiển thị hai nhóm Product và Platform, mỗi nhóm có bốn mục theo lưới hai cột; điện thoại xếp hai nhóm thành một cột.
- Mỗi mục có icon, tên và một câu mô tả ngắn.
- Có hiệu ứng mở nhẹ, màu nền sáng và trạng thái hover.
- Bấm bên ngoài, nhấn Escape hoặc chuyển focus ra ngoài để đóng dropdown.
- Có hỗ trợ thao tác bàn phím và giảm chuyển động theo tùy chọn của thiết bị.

<a id="solutions"></a>

## 5. Solutions — Các tình huống sử dụng

Solutions giới thiệu các vấn đề đội vận hành muốn giải quyết. Mỗi giải pháp kết hợp nhiều năng lực trong Products; Product/Platform giải thích hệ thống có gì, còn Solutions giải thích các năng lực đó giúp ích trong tình huống nào.

| Giải pháp | Vấn đề và cách NexusOps hỗ trợ | Năng lực liên quan |
|---|---|---|
| **Reduce Alert Noise** | Cảnh báo lặp lại gây khó theo dõi. Chống trùng alert đang mở và gom alert phù hợp trong cùng service theo rule/window giúp responder thấy incident rõ hơn. | Monitoring Integrations, Incident Management |
| **Coordinate Incident Response** | Incident cần người nhận trách nhiệm và lịch sử chung. Phân công responder, ACK, chuyển cấp khi chưa có phản hồi, timeline và ghi chú giúp làm rõ tiến độ. | Incident Management, On-call & Escalation |
| **Investigate & Act with Confidence** | Responder cần bằng chứng trước khi hành động. Xem dữ kiện, giả thuyết, thông tin còn thiếu và đề xuất runbook; review approval trước khi thực thi sandbox. | AI Investigation & Automation, Policies & Permissions, Audit Trail |
| **Improve After Every Incident** | Kinh nghiệm dễ bị bỏ quên sau xử lý. PIR tổng hợp timeline và action items; MTTA/MTTR kèm số mẫu hỗ trợ đánh giá phản hồi. | Post-Incident Review & Insights, Audit Trail |

Bấm **Solutions** trên thanh điều hướng để mở dropdown. Bốn thẻ xếp thành lưới 2 × 2 trên desktop và một cột trên điện thoại. Bấm từng thẻ để mở nội dung **The challenge → How NexusOps helps → Related capabilities** ngay trong dropdown; hỗ trợ Enter/Space, đóng bằng Escape, bấm bên ngoài hoặc chuyển focus ra ngoài. Đây là nội dung giới thiệu luồng MVP; workspace hiện vẫn dùng dữ liệu demo.

Trong mỗi thẻ, **The challenge** mô tả vấn đề, **How NexusOps helps** giải thích luồng hỗ trợ và **Related capabilities** liệt kê các chức năng được sử dụng. Ví dụ, *Coordinate Incident Response* kết hợp phân công, ACK, escalation và timeline để theo dõi một sự cố từ khi được tiếp nhận đến lúc kết thúc.

Products và Solutions cùng giới thiệu NexusOps từ hai góc nhìn: Products tổ chức các năng lực của hệ thống; Solutions giải thích cách kết hợp chúng trong công việc. Bốn giải pháp hiện tại bám vào vòng đời incident của MVP, chưa phân loại theo ngành hoặc loại hình doanh nghiệp.

### 5.1. Customer và Resources

**Customer** là liên kết điều hướng thông thường đến phần giới thiệu khách hàng trên trang chủ, không mở dropdown. Nội dung Customer trên landing hiện là bản minh họa cho prototype; chưa đại diện cho khách hàng hay case study đã xác minh.

Menu **Resources** dùng ba cột theo mẫu giao diện:

| Documentation | Guides | Resources |
|---|---|---|
| Product Documentation | Incident Response | Incident Glossary |
| MVP Scope | On-call Operations | Explore the Demo |
| Roles & Permissions | AI Investigation & Automation | Project Changelog |
| API Reference — Draft | Post-Incident Reviews | Help & Support |

Bấm từng mục để mở mô tả ngắn ngay trong menu. API Reference được ghi rõ là bản nháp vì backend/API chưa kết nối; Help & Support hướng người dùng demo đến quản trị viên workspace. Các mục hiện là nội dung giới thiệu trong menu, chưa phải từng trang tài liệu riêng.

<a id="pricing"></a>

## 6. Pricing — Gói Free

Trang `/#pricing` giới thiệu một gói duy nhất là **Free ($0)**, không có lựa chọn thanh toán hoặc gói trả phí. Phần nội dung gồm:

- **Chức năng được trải nghiệm:** quản lý incident, inbox, danh mục service/team, báo cáo AI mẫu, luồng approval và kết quả automation mô phỏng, cập nhật profile/ảnh đại diện.
- **Phạm vi:** một tổ chức, một team; tài khoản demo hiện là Responder.
- **Quyền theo vai trò:** Responder xử lý incident được giao; Team Manager có quyền quản lý service theo M1; Account Admin có các permission MVP đã khai báo; quyền đọc chi tiết của Viewer còn cần chốt khi nối backend. Incident Commander là phân công trên từng incident.
- **Explore free demo:** dẫn đến Login để dùng tài khoản mẫu. **Join your team:** dẫn đến form Sign Up theo lời mời.

Free mô tả gói sử dụng; quyền thao tác vẫn phụ thuộc role, phạm vi incident và trạng thái nghiệp vụ. Phần quyền trên trang mô tả mô hình MVP, không khẳng định đã có giao diện cho mọi role. Dữ liệu và hành động demo chưa kết nối backend; trang không yêu cầu thông tin thanh toán.

<a id="workspace"></a>

## 7. Workspace Responder — Hướng dẫn sử dụng demo

### 7.1. Cách đọc danh sách incident

Danh sách có hai phạm vi. **Assigned to me** (mặc định) chỉ hiện sáu incident giao cho Responder Linh Nguyen; **All** hiện chín incident mẫu trong cùng team, gồm ba incident giao cho đồng đội. Trong Assigned to me, **Open = 5** là incident chưa Resolve; trong đó **Triggered = 3**, **Acknowledged = 2**, **Resolved = 1**. Khi chuyển sang All, các tổng tính lại theo chín incident: Open = 7, Triggered = 4, Acknowledged = 3, Resolved = 2 ở trạng thái ban đầu. Tìm kiếm và bộ lọc service/priority tiếp tục thu hẹp các hàng hiển thị; số cạnh tab trạng thái vẫn tính trên toàn phạm vi Assigned to me hoặc All. Các số cạnh tab là số incident, không phải số alert hay thông báo.

| Từ/nhãn trên giao diện | Giải thích |
|---|---|
| **Incident** | Một hồ sơ sự cố cần theo dõi và xử lý. Một incident có thể gom nhiều alert liên quan, nên số incident và số alert có thể khác nhau. |
| **Alert** | Một tín hiệu/cảnh báo cụ thể do nguồn giám sát phát ra, ví dụ tỷ lệ HTTP 5xx tăng. Nhiều alert phù hợp có thể cùng nằm trong một incident. |
| **Open** | Bộ lọc gộp các incident chưa Resolve, gồm cả Triggered và Acknowledged. Chọn tab này để xem việc còn đang mở. |
| **Triggered** | Incident đang ở trạng thái kích hoạt nhưng chưa được Responder xác nhận tiếp nhận. Sự cố cần người phụ trách ACK; chính sách escalation có thể tiếp tục chuyển thông báo khi chưa ACK. |
| **Acknowledged (ACK)** | Responder đã xác nhận nhận xử lý. ACK ghi thời điểm tiếp nhận và dừng escalation trong luồng nghiệp vụ; chưa có nghĩa là lỗi đã khắc phục. |
| **Resolved** | Incident đã được kết thúc. Trong demo, Responder phải ACK trước và nhập lý do Resolve; các alert liên kết được đánh dấu đóng. |
| **All incidents** | Bỏ lọc trạng thái và hiển thị incident thuộc phạm vi đang chọn ở nút Assigned to me / All, gồm cả Resolved. |
| **Assigned to me / All** | Chuyển phạm vi danh sách giữa incident được giao cho bạn và incident mẫu có thể xem trong team. Ở All, incident của đồng đội chỉ xem được; Responder demo không thể ACK, Resolve, chọn hàng loạt hay thêm ghi chú vào incident không được giao cho mình. Backend phải kiểm tra scope đọc và quyền thao tác khi triển khai thật. |
| **Priority — P1…P5** | Mức ưu tiên vận hành được gán cho incident. P1 là mức cao nhất và P5 thấp nhất theo thứ tự trong giao diện; mức này biểu thị thứ tự cần chú ý, không tự khẳng định mức độ ảnh hưởng thực tế. Chọn để lọc. |
| **Service** | Thành phần/dịch vụ liên quan, ví dụ `payments-api` hoặc `auth-service`. Mỗi service có thể có nhiều incident. |
| **Created** | Thời điểm incident được tạo, hiển thị tương đối so với hiện tại (ví dụ `22m ago` là 22 phút trước). |
| **Escalation — Level 1 / 2** | Incident đang ở mức thông báo nào trong chính sách hai mức mẫu. Mức này mô tả bước chuyển cấp, không phải priority và cũng không phải số người đã phản hồi. Bộ đếm/chuyển cấp thật chưa chạy trong demo. |
| **Assigned to** | Tài khoản đang chịu trách nhiệm cho incident. `You` là tài khoản hiện đăng nhập; tên đồng đội nghĩa là incident được hiển thị trong phạm vi All nhưng chỉ đọc đối với Responder hiện tại. |
| **Stopped** | Hiện không còn bước escalation đang chờ, thường vì incident đã ACK hoặc Resolve. Chữ này không tự nói rằng incident đã được khắc phục; hãy xem Status. |
| **Search incidents, service or ID** | Tìm theo tiêu đề incident, tên service hoặc mã số như `1048`. |
| **All visible services / All priorities** | Bộ lọc incident theo service đang hiển thị trong phạm vi đã chọn hoặc theo P1–P5. Kết hợp được với bộ lọc trạng thái và tìm kiếm. |
| **Newest first / Oldest first / Highest priority** | Cách sắp xếp các hàng đang hiển thị. Highest priority đưa P1 lên trước. |
| **Checkbox và Acknowledge** | Chọn một hoặc nhiều incident Triggered được giao cho mình rồi ACK hàng loạt. Incident đã ACK/Resolve không thể chọn để ACK lại trong bảng. |

Luồng xử lý thủ công trong demo là **Triggered → Acknowledged → Resolved**. Theo MVP, incident cũng có thể tự Resolve khi tất cả alert liên quan đã phục hồi; nhánh tự động này chưa chạy trong giao diện mẫu. ACK và Resolve là hai hành động khác nhau: ACK nhận trách nhiệm xử lý; Resolve kết thúc incident sau khi xử lý. Thông báo trong Inbox cũng tách biệt: đánh dấu notification là đã đọc không làm incident được ACK.

### 7.2. Thao tác trên incident và inbox

- **Tổng quan:** số incident đang mở, chờ ACK, đã ACK và đã Resolve trong bộ dữ liệu mẫu.
- **Danh sách:** chuyển giữa Assigned to me và All; tìm theo tiêu đề, service hoặc ID; lọc trạng thái, service, priority và sắp xếp.
- **ACK:** thao tác từng incident trong bảng chi tiết hoặc chọn nhiều incident đang Triggered. ACK ghi thời điểm nhận xử lý và dừng escalation trong mô phỏng.
- **Chi tiết:** xem alert liên quan, thời gian, trạng thái escalation và timeline; chỉ thêm ghi chú vào incident được giao cho mình.
- **Resolve:** chỉ thực hiện sau ACK và bắt buộc có lý do; đóng các alert liên quan, ghi lịch sử và cập nhật số liệu.
- **Inbox:** xem thông báo, đánh dấu đã đọc và mở incident liên quan. Đọc thông báo không tương đương ACK.
- **Thông tin trực:** hiển thị phân công tĩnh cùng chính sách hai mức và backstop mẫu. Không có bộ đếm chuyển cấp hoặc gửi thông báo thật.
- **Reset sample data:** khôi phục bộ dữ liệu mẫu ban đầu.

### 7.3. Services, Team, AI, Automation và Profile

- **Services:** tìm dịch vụ, xem mức độ quan trọng, team sở hữu, phụ thuộc, integration mẫu và số incident đang mở được giao cho mình; mở danh sách incident theo service. Không cấp quyền `SERVICE_MANAGE` cho Responder.
- **People & Teams:** hai mục Members/Teams trong cùng một danh bạ. Tìm theo tên/email, lọc role hoặc phân công primary/secondary/backstop, xem hồ sơ thành viên và các incident đang mở được giao cho người đó. Số incident lấy từ dữ liệu workspace hiện tại; incident của đồng đội vẫn chỉ đọc với Responder. Mục Teams hiển thị team, các service và đường escalation. Tên/ảnh của bản thân đồng bộ với Profile. Responder chỉ sửa hồ sơ của mình; chưa có thao tác mời thành viên hoặc thay đổi role. Danh bạ hiện gồm một team mẫu, không có trạng thái online hay lịch trực xoay ca thực tế.
- **AI Investigation:** chọn incident chưa Resolve, tạo báo cáo mô phỏng từ snapshot alert; phân biệt bằng chứng, giả thuyết chưa xác nhận và thông tin còn thiếu. Mỗi báo cáo có thể đề xuất diagnostic runbook cùng service.
- **Automation:** yêu cầu action, xem snapshot và evidence, approve/reject, sau đó mô phỏng thực thi sandbox. Tất cả runbook mẫu đều cần approval, kể cả LOW; service CRITICAL làm effective risk thành HIGH. Incident đã Resolve không được approve hoặc thực thi thêm. Lịch sử và kết quả là dữ liệu demo, chưa có backend kiểm tra hash, quota, circuit breaker hay gọi command.
- **Profile:** bấm tên/avatar ở góc phải để xem tài khoản, team, phân công escalation và bốn permission của Responder. Cập nhật ảnh đại diện PNG/JPG/WebP (tối đa 2 MB), tên hiển thị, chức danh, phòng ban, số điện thoại, địa điểm và tùy chọn múi giờ trong workspace. Thời gian incident vẫn theo múi giờ trình duyệt; email, role và mật khẩu không chỉnh sửa trong bản demo.

Các trang dùng chung dữ liệu incident. Xem [trạng thái hiện thực và vòng đời dữ liệu demo](#hien-trang) để biết những gì được giữ khi chuyển mục, tải lại trang hoặc reset dữ liệu.

### 7.4. Account setup / Complete onboarding

Banner đầu workspace dẫn đến trang Account setup với checklist và các màn hình cho từng bước. Có thể quay lại bằng liên kết Account setup ở cuối workspace, kể cả sau khi hoàn tất. Mở một trang không tự đánh dấu hoàn thành.

| Bước | Thao tác và điều kiện hoàn thành |
|---|---|
| Complete your profile | Lưu hồ sơ ở Profile; ảnh và số điện thoại là tùy chọn. |
| Receive a test notification | Lưu lựa chọn bật kênh thử In-app Inbox, gửi thông báo thử và đánh dấu thông báo đó đã đọc trong Inbox. Đọc thông báo không ACK incident. |
| Create your on-call schedule | Mở trang On-call Schedule, tạo ca với ngày/giờ bắt đầu và kết thúc, service, người trực và lớp Primary/Secondary. Cần có ít nhất một ca hợp lệ được giao cho bản thân và chưa kết thúc; xóa ca cuối cùng hoặc ca hết hạn sẽ làm bước này chưa hoàn tất. |
| Understand your escalation path | Chạy walkthrough Primary → Secondary → Backstop, sau đó xác nhận. Walkthrough không chạy timer hoặc sửa policy thực tế. |
| Try a monitoring integration | Sau khi lưu ca hợp lệ cho bản thân và xác nhận escalation, chọn service, priority, nhập alert summary và gửi demo alert. Tạo một incident TRIGGERED cùng thông báo trong Inbox; không tạo trùng incident onboarding trong cùng phiên. |
| Receive & respond to an incident | Mở incident onboarding, ACK, sau đó Resolve với lý do. Hoàn thành được tính từ trạng thái incident thực tế trong demo. |

Mục **Your team members** là tham khảo tùy chọn và không tính vào sáu bước. Responder không có quyền tự mời người, đổi role, sửa policy hay phát hành integration key. Việc kết nối ở đây là simulator cho integration mẫu; không gửi email/SMS, gọi hệ thống bên ngoài hoặc xác thực endpoint thật. Bật/tắt kênh thử chỉ điều khiển thông báo thử, không tắt các thông báo incident hiện có.

**On-call Schedule** là phần mở rộng giao diện theo yêu cầu, có lịch tuần 24 giờ, điều hướng tuần/Today, bộ lọc service/lớp trực, múi giờ UTC, Asia/Ho_Chi_Minh và Asia/Singapore. Tạo/sửa/xóa ca, hỗ trợ qua đêm và chặn chồng ca cùng service/lớp trực; mỗi ca dài từ 30 phút đến 7 ngày. Dữ liệu giờ lưu dưới dạng timestamp để đổi múi giờ hiển thị không thay đổi thời điểm ca. Thẻ trang trí dùng hiệu ứng CSS 3D nhẹ và tắt chuyển động khi người dùng chọn reduced motion. Có thể mở scheduler từ People, onboarding hoặc liên kết cuối workspace.

Đây là **bản kế hoạch lịch trong demo**, cho phép thử phân công các thành viên mẫu. Lịch chưa thay thế phân công tĩnh của incident/escalation hiện tại, chưa chạy bộ lập lịch backend và chưa có rotation/DST. Những mục này cần cập nhật đặc tả MVP và kiểm tra quyền phía server khi chuyển sang vận hành thật.

Tiến độ nằm trong state của workspace, giữ khi đổi trang trong workspace và đặt lại khi rời workspace hoặc tải lại. Reset sample data cũng xóa incident/thông báo thử và đặt lại checklist. Backend cần lưu trạng thái setup theo tài khoản khi triển khai xác thực và dữ liệu thật.

<a id="hien-trang"></a>

## 8. Trạng thái hiện thực

| Hạng mục | Có thể sử dụng trong phiên bản hiện tại | Phần chưa kết nối/hoàn thành |
|---|---|---|
| Landing page | Giao diện giới thiệu; dropdown Products, Solutions, Resources; Customer là liên kết đến phần giới thiệu khách hàng; Pricing nằm cuối thanh điều hướng | Contact Us và một số nút marketing còn là placeholder |
| Products | Hai nhóm Product/Platform, tổng cộng tám mục có mô tả | Chưa có trang chi tiết riêng cho từng mục |
| Customer | Liên kết đến phần giới thiệu trên landing; không có dropdown | Nội dung minh họa, chưa có khách hàng/case study thực tế |
| Resources | Ba cột Documentation/Guides/Resources, mở rộng mô tả từng mục | Chưa có trang docs/API/support độc lập; API Reference là bản nháp |
| Solutions | Bốn thẻ tình huống; mở rộng để xem vấn đề, cách hỗ trợ và chức năng liên quan | Nội dung mô tả luồng MVP; chưa có trang giải pháp riêng |
| Pricing | Một gói Free, chức năng được trải nghiệm, quyền theo role và lối vào demo | Không có billing; các role ngoài Responder chưa có giao diện riêng |
| Login | Tài khoản demo Responder, kiểm tra form, hiện/ẩn mật khẩu, logout | Xác thực server, JWT/refresh token và phân quyền thật |
| Sign Up | Form theo lời mời, kiểm tra trường nhập và xác nhận mật khẩu | Phát hành/xác minh lời mời, tạo tài khoản, lưu mật khẩu |
| Incidents và Inbox | Assigned to me/All, lọc, tìm kiếm, ACK, Resolve, ghi chú, đánh dấu đã đọc | Nhận alert thật, xử lý đồng thời, lưu trữ, WebSocket và gửi thông báo |
| Services và Team | Danh mục mẫu, phân công tĩnh, thông tin phụ thuộc và incident liên quan | Cấu hình service, quản lý thành viên và policy qua API |
| AI Investigation | Báo cáo mẫu từ alert và đề xuất diagnostic action | Gọi mô hình, retrieval/RAG và kiểm tra evidence phía server |
| Automation | Yêu cầu action, approve/reject, kết quả thực thi mô phỏng | Executor sandbox, xác thực snapshot, quota và circuit breaker |
| Profile | Sửa tên, ảnh, chức danh, phòng ban, số điện thoại, địa điểm và tùy chọn múi giờ | Lưu hồ sơ thật, đổi email/mật khẩu; áp dụng múi giờ vào hiển thị timestamp |
| PIR, metrics và audit | Được giới thiệu trong Products/Solutions | Chưa có màn hình nghiệp vụ và xử lý backend tương ứng |

**Vòng đời dữ liệu demo:**

- Chuyển mục trong workspace giữ nguyên incident, inbox, báo cáo AI, action và hồ sơ trong bộ nhớ.
- Tải lại hoặc rời workspace sẽ khởi tạo lại dữ liệu. Dấu hiệu đăng nhập demo trong `sessionStorage` có thể còn trong cùng tab; Logout xóa dấu hiệu này.
- **Reset sample data** chỉ khôi phục incident/inbox. Báo cáo AI, action và profile đang có vẫn giữ nguyên; chúng có thể phản ánh snapshot trước khi reset.
- Ảnh đại diện và thông tin profile không được gửi đến server. Múi giờ hiện là tùy chọn lưu trong bộ nhớ; timestamp vẫn dùng múi giờ trình duyệt.

Backend cần kiểm tra quyền và phạm vi dữ liệu khi triển khai thật. Chế độ All hiện minh họa quyền xem trong một team bằng fixture; đây chưa phải chính sách quyền đọc đã được thực thi trên server.

<a id="chay-frontend"></a>

## 9. Chạy frontend

Frontend sử dụng **React, TypeScript, Vite, Tailwind CSS và Lucide React**. Định hướng backend theo MVP là **Java 21, Spring Boot, PostgreSQL 16 và pgvector**.

Từ thư mục gốc dự án:

```bash
cd nexusops-ui
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, sau đó truy cập:

| Đường dẫn | Nội dung |
|---|---|
| `/` | Landing page, dropdown Products và Solutions |
| `/#pricing` | Gói Free và quyền theo vai trò |
| `/#login` | Đăng nhập demo |
| `/#signup` | Giao diện đăng ký theo lời mời |
| `/#workspace` | Workspace Responder; hiển thị Login nếu chưa có phiên demo |

**Vào demo:** chọn **Use demo account** trên Login rồi bấm **Log in**, hoặc nhập email `responder@nexusops.demo` và mật khẩu `NexusOps@2026`.

Các lệnh kiểm tra trong thư mục frontend:

```bash
npm run build
npm run lint
```

Xem [nexusops-ui/README.md](nexusops-ui/README.md) để tra cấu trúc mã nguồn và giới hạn kỹ thuật. README sẽ tiếp tục được cập nhật khi có thêm màn hình hoặc kết nối API.
