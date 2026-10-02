# NexusOps — Intelligent Incident & Reliability Operations Platform

NexusOps là nền tảng web hỗ trợ đội ngũ kỹ thuật tiếp nhận, phối hợp xử lý và rút kinh nghiệm từ các sự cố vận hành phần mềm. Hệ thống hướng đến việc đưa cảnh báo, người phụ trách, bằng chứng điều tra và lịch sử xử lý về cùng một nơi để đội ngũ vận hành biết **đang có sự cố gì, ai đang xử lý và bước tiếp theo là gì**.

Website gồm trang chủ công khai để giới thiệu nền tảng và khu vực làm việc dành cho người dùng được cấp quyền trong tổ chức. Phạm vi MVP phục vụ **một tổ chức và một team**.

**Cập nhật đến ngày 02/10/2026:** đã xây dựng landing page, giao diện Login, giao diện Sign Up theo lời mời và dropdown Products gồm bốn nhóm chức năng. Phần xác thực, backend, database và các màn hình nghiệp vụ bên trong chưa được kết nối trong bản giao diện này.

README mô tả hệ thống và phần giao diện đang có. [MVP Scope.md](MVP%20Scope.md) là căn cứ cho phạm vi nghiệp vụ; [Detailed description.md](Detailed%20description.md) là tài liệu mô tả mở rộng. README sẽ được cập nhật theo tiến độ hiện thực.

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
| Khu vực làm việc — Workspace | Người dùng có tài khoản và quyền phù hợp | Xem, tiếp nhận, điều tra, xử lý và đánh giá sự cố | Chưa hiện thực trong bản UI hiện tại |

Các hình minh họa incident, nhận xét khách hàng, tên công ty và số liệu trên landing page hiện là nội dung mẫu phục vụ dựng giao diện; không phải dữ liệu vận hành hay kết quả đánh giá đã được kiểm chứng.

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

Login hiện là **UI preview**. Khi biểu mẫu hợp lệ, giao diện thông báo rằng chức năng xác thực chưa được kết nối. Hệ thống chưa kiểm tra tài khoản trong database, chưa tạo token hoặc phiên đăng nhập và chưa chuyển người dùng vào workspace.

Trong luồng hoàn chỉnh theo MVP, backend chịu trách nhiệm xác minh thông tin đăng nhập, trạng thái tài khoản và quyền truy cập, đồng thời xử lý refresh/logout. Việc hiển thị hoặc ẩn chức năng trên frontend phải đi cùng kiểm tra quyền ở backend.

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

## 4. Products — Các nhóm chức năng của nền tảng

Products trên landing page giới thiệu bốn nhóm chức năng trong cùng nền tảng NexusOps. Mỗi nhóm trả lời một nhu cầu trong vòng đời sự cố, từ tiếp nhận cảnh báo đến rút kinh nghiệm sau xử lý.

**Hiện tại đã có dropdown giới thiệu và mô tả ngắn.** Các mục đang là nội dung giới thiệu, chưa dẫn đến trang sản phẩm riêng hoặc màn hình nghiệp vụ. Những chức năng dưới đây mô tả mục tiêu theo MVP, không phải năng lực backend đã hoàn thành.

### 4.1. Incident Management — Quản lý sự cố

> Turn alerts into coordinated incident response.

**Mục đích:** tập hợp cảnh báo và thông tin xử lý thành một hồ sơ sự cố có người phụ trách và lịch sử rõ ràng.

**Chức năng theo MVP:**

- Quản lý danh mục service, quan hệ phụ thuộc và cấu hình integration nhận sự kiện.
- Tiếp nhận cảnh báo từ nguồn giám sát, áp dụng các rule đã cấu hình.
- Chống trùng cảnh báo đang mở và gom nhóm theo service, rule và khoảng thời gian của MVP.
- Tạo incident, hỗ trợ ACK và Resolve theo điều kiện nghiệp vụ.
- Lưu timeline và ghi chú để những người tham gia nắm được diễn biến xử lý.

**Tác dụng:** giảm việc theo dõi các cảnh báo rời rạc, làm rõ trách nhiệm và giúp người tiếp nhận sau hiểu những gì đã xảy ra. Ví dụ, các cảnh báo phù hợp cùng một quy tắc của `payments-api` có thể được tổ chức vào một incident để người trực theo dõi tập trung.

Phạm vi MVP dùng quy tắc xác định để gom nhóm trong cùng service; việc gom nhóm chưa dựa trên AI. ACK xác nhận đã tiếp nhận, còn Resolve là bước kết thúc xử lý theo trạng thái và điều kiện cho phép.

### 4.2. On-call & Escalation — Trực và chuyển cấp

> Notify the right responders and escalate when needed.

**Mục đích:** đưa thông báo sự cố đến người được phân công và tiếp tục chuyển cấp khi chưa có ai xác nhận xử lý.

**Chức năng theo MVP:**

- Cấu hình người trực bằng phân công tĩnh.
- Cấu hình chính sách escalation gồm hai mức, các người nhận ở mỗi mức và người nhận dự phòng cuối cùng — backstop.
- Theo dõi thời hạn ACK và thực hiện nhắc lại/chuyển cấp trong giới hạn quy định.
- Cung cấp inbox thông báo có lưu trữ và cập nhật qua WebSocket; email phụ thuộc adapter được triển khai.

**Tác dụng:** tránh sự cố thiếu người phụ trách và giúp đội ngũ biết cần phản hồi trong thời hạn nào. Ví dụ, nếu người nhận mức đầu chưa ACK sau thời gian cấu hình, hệ thống chuyển thông báo đến mức tiếp theo.

Phạm vi hiện tại của MVP chưa gồm lịch trực luân phiên phức tạp hoặc đổi ca. Việc chuyển cấp có điểm dừng và backstop, không lặp vô hạn.

### 4.3. AI Investigation & Automation — Điều tra AI và tự động hóa

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

### 4.4. Post-Incident & Insights — Đánh giá sau sự cố và thống kê

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

### 4.5. Cách trình bày Products hiện tại

- Bấm **Products** để mở hoặc đóng dropdown.
- Desktop hiển thị bốn mục theo hai cột; điện thoại hiển thị một cột.
- Mỗi mục có icon, tên và một câu mô tả ngắn.
- Có hiệu ứng mở nhẹ, màu nền sáng và trạng thái hover.
- Bấm bên ngoài, nhấn Escape hoặc chuyển focus ra ngoài để đóng dropdown.
- Có hỗ trợ thao tác bàn phím và giảm chuyển động theo tùy chọn của thiết bị.

## 5. Phạm vi hiện thực đến thời điểm này

| Hạng mục | Trạng thái |
|---|---|
| Landing page công khai | Đã có giao diện giới thiệu |
| Điều hướng từ landing page đến Login/Sign Up | Đã thực hiện |
| Login | Đã có form, validation và thông báo preview |
| Sign Up theo invitation | Đã có form, validation và thông báo preview |
| Dropdown Products | Đã có bốn nhóm nội dung và tương tác mở/đóng |
| Giao diện Login/Sign Up và Products trên desktop/mobile | Đã thực hiện và kiểm tra hiển thị |
| Xác thực, tạo tài khoản, quản lý invitation và phân quyền thực tế | Chưa kết nối backend/database |
| Các màn hình làm việc của bốn nhóm Products | Chưa hiện thực trong bản UI này |
| Các nút/menu giới thiệu khác trên landing page | Một số vẫn là placeholder, chưa có luồng hoàn chỉnh |

Frontend hiện sử dụng **React, TypeScript, Vite, Tailwind CSS và Lucide React**. Backend và dữ liệu được định hướng theo MVP với Java, Spring Boot, PostgreSQL và pgvector.

Chạy frontend tại thư mục `nexusops-ui`:

```bash
npm install
npm run dev
```

Các địa chỉ giao diện là `/` cho landing page, `/#login` cho Login và `/#signup` cho Sign Up. Xem thêm hướng dẫn kỹ thuật trong [nexusops-ui/README.md](nexusops-ui/README.md).

Tài liệu này dừng ở phạm vi đang có. Khi hoàn thành thêm giao diện hoặc kết nối nghiệp vụ, trạng thái tương ứng sẽ được cập nhật tại đây.
