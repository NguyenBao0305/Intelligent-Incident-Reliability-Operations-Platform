# NexusOps — Intelligent Incident & Reliability Operations Platform

NexusOps là nền tảng web hỗ trợ đội ngũ kỹ thuật tiếp nhận cảnh báo, phối hợp xử lý sự cố và rút kinh nghiệm sau vận hành. Hệ thống tập hợp incident, người phụ trách, bằng chứng điều tra và lịch sử xử lý để đội ngũ biết **đang có sự cố gì, ai đang xử lý và bước tiếp theo là gì**.

**Cập nhật: 04/10/2026.** Phiên bản hiện tại là prototype frontend gồm landing page, trang Customer, Pricing, bốn trang Product, bốn trang Platform, bốn trang Solution, Login/Sign Up và workspace đa vai trò. Workspace có Overview theo vai trò, Incidents, Inbox, Services, People & access, Status, Integrations, Analytics, Automation, Post-incident reviews, Audit trail, Profile, Account setup, On-call Schedule và Escalation policies. Các trang nghiệp vụ dùng dữ liệu mẫu/state trình duyệt; xác thực thật, API/backend, database, gửi paging, mô hình AI và executor chưa được kết nối. Phạm vi nghiệp vụ MVP phục vụ **một tổ chức và một team**.

[MVP Scope.md](MVP%20Scope.md) là nguồn đặc tả nghiệp vụ. [Detailed description.md](Detailed%20description.md) trình bày định hướng mở rộng. README này giải thích giao diện và trạng thái hiện thực; các mục ghi **theo MVP** mô tả chức năng dự kiến, các mục ghi **demo** mô tả những gì có thể thao tác hiện tại.

## Mục lục

1. [Tổng quan hệ thống](#tong-quan)
2. [Login và tài khoản demo](#login)
3. [Sign Up theo lời mời](#signup)
4. [Products: Product và Platform](#products)
5. [Solutions: các tình huống sử dụng](#solutions)
6. [Pricing — Gói Free](#pricing)
7. [Workspace đa vai trò và thuật ngữ giao diện](#workspace)
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
| Khu vực làm việc — Workspace | Người dùng có tài khoản và quyền phù hợp | Xem, tiếp nhận, điều tra, xử lý và đánh giá sự cố | Đã có workspace Account Admin, Team Manager, Responder và Viewer với dữ liệu dùng chung |

Landing page dùng hình minh họa incident, lifecycle và service context bằng HTML/CSS. Phần review khách hàng cũ đã được thay thế. Dữ liệu trong minh họa là mẫu, không phải số liệu vận hành hoặc đánh giá khách hàng đã được kiểm chứng.

<a id="login"></a>

## 2. Login — Đăng nhập và tài khoản mẫu

Tất cả vai trò dùng chung `/#login`. Form gồm Work email, Password, nút hiện/ẩn mật khẩu, Log in, hướng dẫn trợ giúp và liên kết Join your team. Email phải hợp lệ, mật khẩu không để trống. Thông tin đăng nhập được đối chiếu với tài khoản đang bật trong dữ liệu trình duyệt; tài khoản được tạo qua invitation cũng đăng nhập được.

| Tài khoản mẫu | Vai trò |
|---|---|
| `admin@nexusops.demo` | Account Admin |
| `manager@nexusops.demo` | Team Manager |
| `responder@nexusops.demo` | Responder |
| `viewer@nexusops.demo` | Viewer |
| `commander@nexusops.demo` | Team Manager + Responder, được gán Commander cho incident #1048 |

Mật khẩu khởi tạo chung: `NexusOps@2026`. Tại Login chọn **Demo account**, bấm **Use demo account**, rồi Log in. Đây là chọn một tài khoản mẫu, không phải tự chọn quyền cho tài khoản đang đăng ký. Khi đổi mật khẩu hoặc quyền, thông tin mới được dùng cho những lần đăng nhập sau.

Sau Login, Responder vào Incidents; Admin, Manager, Viewer và tài khoản kết hợp Manager + Responder vào Overview. Workspace và nút thao tác phụ thuộc quyền hiện tại. Truy cập workspace khi thiếu phiên hoặc phiên mất hiệu lực hiển thị Login.

Phiên chứa ID và session version trong sessionStorage. Khi Admin đổi role hoặc vô hiệu hóa tài khoản, version tăng và phiên cũ không còn hợp lệ. Logout xóa phiên, giữ dữ liệu workspace. Tài khoản seed có mật khẩu mẫu công khai; người đổi mật khẩu hoặc chấp nhận invitation có credential dẫn xuất PBKDF2 lưu cục bộ. Đây chưa phải xác thực server.

<a id="signup"></a>

## 3. Sign Up — Tạo tài khoản theo lời mời

Admin đầu tiên đã được bootstrap trong dữ liệu mẫu. Không có đăng ký tự do để tự nhận quyền Admin; người tham gia mới dùng lời mời do Admin tạo. Team Manager không mời hoặc cấp role cho thành viên.

1. Admin mở **People → Invite member**, nhập email và chọn role. Viewer dùng riêng; Manager có thể kết hợp Responder.
2. Tạo invitation, mở tab **invitations** và sao chép code. Invitation hết hạn sau 72 giờ.
3. Đăng xuất, mở **Join your team** trên cùng trình duyệt/origin. Nhập tên, email được mời, code, mật khẩu ít nhất 8 ký tự và xác nhận mật khẩu.
4. Demo kiểm tra code, đúng email, hạn dùng, trạng thái và email chưa có tài khoản. Thành công tạo user theo role của invitation, đánh dấu invitation đã dùng và ghi audit.
5. Người nhận chuyển sang Login, đăng nhập bằng thông tin vừa tạo.

**Resend** thay code và gia hạn, vô hiệu code cũ. **Revoke** hủy lời mời pending. Code đã dùng/hủy/hết hạn không tạo được tài khoản. Không gửi email thật; nhập email tại CTA landing page chỉ điền sẵn email vào Sign Up, không tự tạo user.

Đổi role/vô hiệu hóa được ghi audit. Không bỏ Admin hoạt động cuối cùng. Người còn incident mở, ca trực chưa kết thúc hoặc target/backstop phải được chuyển trách nhiệm trước khi mất quyền phản hồi hoặc bị vô hiệu hóa. Mời Admin bổ sung vẫn do Admin hiện tại quyết định. Backend M1 cần triển khai bootstrap, lưu trữ invitation và kiểm tra quyền tương ứng trên server.

<a id="products"></a>

## 4. Products — Các nhóm chức năng của nền tảng

Products trên landing page giới thiệu các năng lực của cùng nền tảng NexusOps, từ tiếp nhận cảnh báo đến rút kinh nghiệm sau xử lý.

**Dropdown Products chia thành Product và Platform.** Cách chia này trả lời hai câu hỏi khác nhau:

- **Product — người dùng làm công việc gì?** Gồm các luồng nghiệp vụ nhìn thấy trực tiếp trong quá trình xử lý incident, như tiếp nhận/điều phối, trực và chuyển cấp, điều tra, review sau sự cố.
- **Platform — những năng lực dùng chung nào giúp các luồng đó hoạt động?** Gồm danh mục service, tích hợp sự kiện, policy/phân quyền và audit. Các năng lực này có thể được nhiều Product sử dụng, vì vậy không cần lặp chúng như các Product độc lập.

Ví dụ: Product **Incident Management** dùng **Service Catalog** để biết alert thuộc service nào, dùng **Monitoring Integrations** để nhận sự kiện và dùng **Policies & Permissions** để xác định phạm vi truy cập/hành động. Product **AI Investigation & Automation** đọc ngữ cảnh có quyền và tạo action cần kiểm soát; **Audit Trail** lưu dấu vết quyết định. Một Platform có thể hỗ trợ nhiều Product.

Tám mục Product/Platform trong dropdown đều mở trang chi tiết công khai. Các trang giải thích vai trò, luồng mục tiêu và ranh giới hiện thực theo MVP; hình dashboard, sơ đồ và dữ liệu trong trang là minh họa, không khẳng định mọi chức năng backend đã hoàn thành.

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

Trang chi tiết công khai có thể mở từ **Products → Incident Management**. Trang giải thích luồng alert → incident → nhận trách nhiệm → phối hợp → resolve, trình bày một hồ sơ incident minh họa bằng dữ liệu mẫu và nêu rõ các giới hạn MVP. Các thẻ alert, responder và mốc thời gian trong hình là minh họa tĩnh; trang này không nhận alert, gửi paging hay kết nối monitor. CTA **Explore the demo** đưa người dùng đến Login để vào workspace Responder demo.

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

Trang sản phẩm công khai mở từ **Products → On-call & Escalation** (`/#product-on-call-escalation`). Trang dùng lịch tuần minh họa để giải thích coverage theo service/timezone, sau đó mô tả policy hai level và một backstop. Ví dụ timeline mặc định là T+0 Primary, T+5 reminder, T+10 Secondary và T+20 backstop một lần; ACK ở bất kỳ bước nào thì dừng các bước chờ còn lại. Đây là hình và dữ liệu minh họa, không gửi thông báo thật.

Trang cũng nêu rõ ranh giới hiện thực: scheduler của workspace lưu ca cục bộ, policy designer có Response preview; ca trực hiện chưa tự biến thành targets của policy và chưa có timer chuyển cấp đang chạy. MVP yêu cầu assignment tĩnh, hai level liên tục, targets cùng team, snapshot policy khi tạo incident và bộ xử lý escalation backend hữu hạn. Rotation nền, paging/provider thật và DST nằm ngoài phạm vi hiện tại.

#### 4.1.3. AI Investigation & Automation — Điều tra AI và tự động hóa

Trang công khai **AI Investigation & Automation** (`/#product-ai-automation`) minh họa báo cáo điều tra cho một incident mẫu: alert, deployment và runbook được ghi thành các nguồn bằng chứng; phần giả thuyết được đánh dấu chưa xác nhận; runbook đề xuất cần con người review. Các phần tiếp theo giải thích luồng context có scope, evidence, action snapshot, approval và sandbox, đồng thời phân biệt vai trò Investigation Agent với Automation Worker. Trang ghi rõ báo cáo đang dùng dữ liệu minh họa; model, RAG và thực thi thật chưa kết nối.

> Investigate with evidence and review proposed actions.

**Mục đích:** hỗ trợ người xử lý tổng hợp bằng chứng, tìm giả thuyết và xem xét hành động phù hợp.

**Chức năng theo MVP:**

- Điều tra dựa trên thông tin incident, alert và lịch sử deployment có sẵn trong phạm vi được phép.
- Tra cứu sự cố cũ và tài liệu tri thức đã được phê duyệt bằng cơ chế RAG.
- Tổng hợp dữ kiện, giả thuyết, thông tin còn thiếu và đề xuất xử lý có dẫn chứng.
- Đề xuất runbook trong danh sách được phép; hỗ trợ người có quyền xem xét, phê duyệt hoặc từ chối action.
- Thực thi runbook trong sandbox với action snapshot bất biến, kiểm tra quyền/phạm vi, giới hạn tần suất, cooldown, circuit breaker và trạng thái thực thi.

**Tác dụng:** giảm công sức tập hợp ngữ cảnh và giúp người vận hành đưa ra quyết định dựa trên bằng chứng. Ví dụ, AI có thể chỉ ra một deployment gần thời điểm xuất hiện cảnh báo để người xử lý điều tra thêm; sự gần nhau về thời gian chưa đủ để kết luận deployment là nguyên nhân.

AI không có công cụ approve/execute hay shell tùy ý và không giữ credential executor. Automation Worker là thành phần duy nhất được cấp credential để chạy runbook allowlist trong sandbox; backend xác nhận action snapshot và quyền trước khi dispatch. Approval không bỏ qua quota, cooldown hoặc circuit breaker. Đây là thiết kế MVP, chưa phải khả năng đã kết nối của bản demo UI.

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

#### 4.2.1. Service Catalog — Danh mục dịch vụ

Service Catalog là bản ghi dùng chung cho service, team sở hữu, criticality, status và dependency. Event từ integration được gắn với service; incident, on-call, điều tra và analytics dùng lại cùng ngữ cảnh đó. Dependency là cạnh có hướng, không cho service phụ thuộc vào chính nó; khi người dùng quản lý cạnh phải có quyền với cả hai service. MVP có criticality **CRITICAL / HIGH / NORMAL** và status **OPERATIONAL / DEGRADED / MAJOR_INCIDENT / MAINTENANCE / DISABLED**. Service được disable thay vì hard-delete để không làm mất tham chiếu lịch sử.

Trang công khai có sơ đồ dependency mẫu để thể hiện quan hệ service; workspace đã có tạo/sửa service cục bộ cho Admin/Manager, cùng criticality và dependency. CRUD API, kiểm tra quyền ở server và topology thật chưa kết nối.

#### 4.2.2. Monitoring Integrations — Tích hợp giám sát

Integration là điểm nhận event riêng cho một service. Luồng MVP xác thực bằng credential của integration, áp dụng rate limit, kiểm tra event contract rồi nhận `TRIGGER` hoặc `RESOLVE`. `Idempotency-Key` xử lý retry cùng request; `dedupKey` nhận diện stream alert; `episodeId` và `sourceSequence` bảo vệ thứ tự trigger/recovery. Đây là các định danh khác nhau, không dùng thay thế cho nhau.

Event được deduplicate và grouping theo rule/window trong cùng service. Sequence cũ là stale; `RESOLVE` chỉ đóng stream phù hợp, và incident chỉ được resolve khi không còn alert liên kết đang mở. Trang công khai vẽ intake pipeline cùng event mẫu; form Integrations trong workspace hiện chỉ lưu state và gửi test event local, chưa cấp credential hay nhận webhook từ monitor thật.

#### 4.2.3. Policies & Permissions — Chính sách và phân quyền

MVP dùng role map cố định, chưa có role designer: **Account Admin** có toàn bộ permission seed; **Team Manager** quản lý service, schedule, escalation, integration, phân công incident và duyệt PIR; **Responder** phản hồi incident được giao, điều tra, thao tác automation và soạn PIR; **Viewer** có quyền đọc nghiệp vụ trong team. Ma trận frontend hiện tại được trình bày tại [mục 7.1](#workspace); phần seed backend M1 phải được đồng bộ theo quyết định này. Backend kiểm tra permission trước, rồi kiểm tra membership và scope của team/service/incident trong cùng transaction. Role không tự cấp quyền trên mọi object; **Commander** là assignment trên một incident, không phải account role toàn cục.

Escalation policy là một phần năng lực này: hai level theo thứ tự, nhiều target, reminder hữu hạn và một backstop; target phải trong cùng team. Approval automation cũng kiểm tra actor, service/incident scope và snapshot. Trang minh họa role-to-permission và scope gate. Workspace đã có quản lý role và kiểm tra thao tác trong frontend; enforcement phía backend chưa được triển khai.

#### 4.2.4. Audit Trail — Lịch sử kiểm toán

Mỗi audit record ghi actor/type, action, resource, correlation ID, thời gian và các giá trị trước/sau khi cần. Mutation và audit được ghi trong cùng DB transaction; record không cho sửa/xóa để giữ history nhất quán. M7 có Audit Viewer với `AUDIT_VIEW`, giới hạn theo scope và truy vấn theo incident hoặc correlation ID.

Audit Trail ghi quyết định nghiệp vụ như ACK, resolve, approval và action outcome; nó không thay thế application/debug log hay hệ thống observability. Trang công khai dùng ledger mẫu; workspace đã có audit viewer cho Admin, tìm kiếm và lọc action trên bản ghi lưu cục bộ. Audit bất biến phía backend chưa được kết nối.

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
| **Reduce Alert Noise** | `dedupKey` trong cùng integration nhận diện lần lặp của một alert đang OPEN; quy tắc grouping riêng gắn alert đủ điều kiện từ cùng service vào incident theo rule/window. Hai việc này khác với `Idempotency-Key` dùng để nhận diện request retry. | Monitoring Integrations, Incident Management |
| **Coordinate Incident Response** | Incident cần người nhận trách nhiệm và lịch sử chung. Phân công responder, ACK, chuyển cấp khi chưa có phản hồi, timeline và ghi chú giúp làm rõ tiến độ. | Incident Management, On-call & Escalation |
| **Investigate & Act with Confidence** | Responder cần bằng chứng trước khi hành động. Xem dữ kiện, giả thuyết, thông tin còn thiếu và đề xuất runbook; review approval trước khi thực thi sandbox. | AI Investigation & Automation, Policies & Permissions, Audit Trail |
| **Improve After Every Incident** | Kinh nghiệm dễ bị bỏ quên sau xử lý. PIR tổng hợp timeline và action items; MTTA/MTTR kèm số mẫu hỗ trợ đánh giá phản hồi. | Post-Incident Review & Insights, Audit Trail |

Bấm **Solutions** trên thanh điều hướng để mở dropdown. Bốn thẻ xếp thành lưới 2 × 2 trên desktop và một cột trên điện thoại. Bấm từng thẻ để mở nội dung **The challenge → How NexusOps helps → Related capabilities**; trong phần mở rộng có liên kết **Explore this solution** dẫn đến trang công khai tương ứng. Dropdown hỗ trợ Enter/Space, đóng bằng Escape, bấm bên ngoài hoặc chuyển focus ra ngoài.

Mỗi trang Solution có hero cùng hình minh họa giao diện mẫu, các bước xử lý, liên kết sang Products/Platform liên quan, ranh giới MVP và đường dẫn đến ba Solution còn lại. Hình ảnh được dựng bằng giao diện CSS/SVG trong ứng dụng, gắn nhãn sample/illustrative; không phải screenshot dữ liệu trực tiếp hay kết quả khách hàng. Bố cục dùng chung header, font, màu xanh và footer với các trang public; trên điện thoại các khối chuyển thành một cột.

| Trang Solution | Đường dẫn | Luồng minh họa và ranh giới cần nhớ |
|---|---|---|
| **Reduce Alert Noise** | `/#solution-reduce-alert-noise` | `dedupKey` trong cùng integration/service gộp lần lặp của alert OPEN; rule/window riêng grouping alert đủ điều kiện từ cùng service vào incident. `Idempotency-Key` xử lý retry request và không thay `dedupKey`. |
| **Coordinate Incident Response** | `/#solution-coordinate-incident-response` | Assignment → ACK → escalation khi chưa được ACK → timeline. ACK chỉ nhận trách nhiệm, không Resolve; MVP có hai level và backstop hữu hạn, còn paging provider là ngoài bản UI. |
| **Investigate & Act with Confidence** | `/#solution-investigate-with-confidence` | Evidence scoped → facts/hypothesis → runbook allowlist → snapshot và human approval → sandbox. AI điều tra chỉ đọc; AI không approve hay tự gọi executor. |
| **Improve After Every Incident** | `/#solution-improve-after-every-incident` | Timeline/evidence → PIR draft → review/approval → action items; MTTA/MTTR hiển thị kèm thời gian và sample count. Không có MTTD hoặc số liệu production. |

Các trang là nội dung giới thiệu và sơ đồ tĩnh; CTA vào workspace dùng demo dữ liệu cục bộ. Chúng không chạy ingestion, escalation, AI, automation, PIR hay analytics backend.

Products và Solutions cùng giới thiệu NexusOps từ hai góc nhìn: Products tổ chức các năng lực của hệ thống; Solutions giải thích cách kết hợp chúng trong công việc. Bốn giải pháp hiện tại bám vào vòng đời incident của MVP, chưa phân loại theo ngành hoặc loại hình doanh nghiệp.

### 5.1. Customer và Resources

**Customer** là một trang công khai riêng tại `/#customers`, không mở dropdown. Trang giới thiệu các nhóm sử dụng NexusOps, trách nhiệm chính của từng nhóm và một hành trình minh họa từ signal đến review. Đây không phải trang customer testimonial: không dùng tên công ty, trích dẫn, review, xếp hạng hay số liệu khách hàng không có thật.

Phần cuộn bên dưới hero hiện gồm:

- **Workspace overview:** mô hình giao diện incident với status, priority, service và người phụ trách. Nút Explore the workspace trên hero cuộn tới phần này (`/#demo`); CTA bên dưới mở Login.
- **Incident lifecycle:** bốn nút đổi minh họa và nội dung về Incident, Escalation, AI Investigation, Review. Đây là bản giới thiệu tương tác; các thẻ trong hình không thực hiện ACK, gửi paging hoặc chạy runbook. AI/PIR được ghi rõ là luồng MVP dự kiến.
- **Signal & service context:** sơ đồ sự kiện giám sát → ngữ cảnh service/gom alert → incident/người phản hồi. Không quảng bá adapter hoặc kết nối thật chưa triển khai.
- **People & responsibilities:** vai trò được giới thiệu trên trang Customer riêng (`/#customers`), không còn là một mục cuộn dưới landing page.
- **CTA và footer:** dẫn đến Login demo, trang Incident Management và Pricing. Minh họa dựng bằng HTML/CSS để co giãn theo màn hình, có hiệu ứng hover/chuyển nội dung nhẹ và hỗ trợ reduced motion.

Menu **Resources** dùng ba cột theo mẫu giao diện:

| Documentation | Guides | Resources |
|---|---|---|
| Product Documentation | Incident Response | Incident Glossary |
| MVP Scope | On-call Operations | Explore the Demo |
| Roles & Permissions | AI Investigation & Automation | Project Changelog |
| API Reference — Draft | Post-Incident Reviews | Help & Support |

Resources hiện có **12 trang công khai**. Bấm mục trong menu để xem mô tả và chọn **Read the article** (API: **Read draft reference**) để mở trang. Tên, mô tả, nhóm và route dùng chung một directory; phần nội dung được tải khi mở Resources để giảm tải trang chủ.

Các trang giữ thanh điều hướng NexusOps và có sidebar tìm kiếm toàn văn trong tài liệu, breadcrumb, minh họa cuốn sổ bằng CSS, sơ đồ 4 bước, mục lục cuộn tới heading, liên kết Product/Platform và trang trước/sau. Phần đầu trang ghi audience và mốc đặc tả MVP v3 (25/09/2026), không tự nhận tài liệu đã được review/chứng nhận vào một ngày cụ thể. Trên điện thoại, danh mục mặc định thu gọn; bảng có vùng cuộn ngang riêng. Có focus bàn phím và reduced motion.

| Trang | Route | Nội dung và thao tác |
|---|---|---|
| Product Documentation | `/#resource-product-documentation` | Bản đồ vòng đời incident, bốn Product, bốn Platform và hướng dẫn tìm màn workspace. |
| MVP Scope | `/#resource-mvp-scope` | Bảng phân biệt hiện thực demo với hợp đồng backend; invariant và phạm vi chưa hỗ trợ. |
| Roles & Permissions | `/#resource-roles-permissions` | Ma trận bốn role, Commander assignment, scope/state, bootstrap và invitation; Admin vẫn cần assignment khi phản hồi. |
| API Reference | `/#resource-api-reference` | Draft: payload event có thể sao chép, metadata ordering, idempotency/dedup/grouping, contract execute/notifications và lỗi. Không có endpoint chạy thử. |
| Incident Response | `/#resource-incident-response` | Điều kiện quyền, lọc/tìm incident, ACK, notes, điều tra mẫu, resolve có lý do và xử lý nút không khả dụng. |
| On-call Operations | `/#resource-on-call-operations` | Lịch cụ thể, hai level và backstop, điều kiện tạo test incident; phân biệt coverage với static policy targets. |
| AI Investigation & Automation | `/#resource-ai-investigation-automation` | Evidence/hypothesis, proposal/approve/reject/simulate; tách quota cục bộ khỏi snapshot/quota/breaker backend. |
| Post-Incident Reviews | `/#resource-post-incident-reviews` | Draft từ resolution, submit/request changes/approve/complete, quyền xem và mẫu số MTTA/MTTR. |
| Incident Glossary | `/#resource-incident-glossary` | 25 thuật ngữ; tìm kiếm, lọc Signals/Response/Automation/Learning, số kết quả và trạng thái không tìm thấy. |
| Explore the Demo | `/#resource-explore-demo` | Năm tài khoản mẫu, hành trình đổi vai trò trên cùng browser/origin và giới hạn dữ liệu cục bộ. |
| Project Changelog | `/#resource-project-changelog` | Mốc commit 02–04/10/2026 và mục cập nhật Resources trong working tree; không tự đặt release/version. |
| Help & Support | `/#resource-help-support` | Bảng phân luồng theo vấn đề, 9 FAQ, hướng dẫn báo lỗi và mẫu có thể sao chép gồm trang/role/bước tái hiện/kết quả mong đợi-thực tế. Nhắc không gửi mật khẩu, mã mời, token hay dữ liệu khách hàng nhạy cảm. Không giả lập ticket, email hoặc chat hỗ trợ. |

Nội dung căn cứ MVP Scope v3 (25/09/2026), README và mã workspace đang được App mở. API giữ nhãn Draft vì chưa có backend live. Hướng dẫn demo dùng tên thao tác đang tồn tại; không hướng dẫn rotation nền, live paging hay Reset sample data của workspace cũ. Help & Support hướng người dùng tới Admin workspace hoặc maintainer theo kênh liên lạc sẵn có; dự án chưa có help desk, chat hoặc địa chỉ hỗ trợ công khai. Nội dung tài liệu không gọi API, không thay đổi quyền hay dữ liệu nghiệp vụ.

<a id="pricing"></a>

## 6. Pricing — Gói Free

Trang `/#pricing` giới thiệu một gói duy nhất là **Free ($0)**, không có lựa chọn thanh toán hoặc gói trả phí. Phần nội dung gồm:

- **Chức năng được trải nghiệm trong prototype:** incident và inbox mẫu, service/team, lịch trực và escalation policy mô phỏng, status/analytics từ dữ liệu mẫu, báo cáo AI mẫu, luồng approval, automation mô phỏng và cập nhật profile/ảnh đại diện.
- **Phạm vi:** một tổ chức, một team; có tài khoản demo Admin, Manager, Responder, Viewer và Manager + Responder.
- **Quyền theo vai trò:** Responder xử lý incident được giao; Team Manager quản lý các cấu hình vận hành trong team; Account Admin quản lý truy cập và cấu hình; Viewer đọc nghiệp vụ trong phạm vi team. Incident Commander là phân công trên từng incident.
- **Explore free demo:** dẫn đến Login để dùng tài khoản mẫu. **Join your team:** dẫn đến form Sign Up theo lời mời.

Free mô tả gói sử dụng; quyền thao tác vẫn phụ thuộc role, phạm vi incident và trạng thái nghiệp vụ. Workspace đã có giao diện theo bốn role; nội dung công khai mô tả năng lực sản phẩm và có thể bao gồm luồng backend dự kiến. Dữ liệu và hành động demo chưa kết nối backend; trang không yêu cầu thông tin thanh toán.

<a id="workspace"></a>

## 7. Workspace đa vai trò — Hướng dẫn sử dụng

### 7.1. Ma trận quyền và màn hình theo vai trò

| Chức năng | Account Admin | Team Manager | Responder | Viewer |
|---|---|---|---|---|
| Overview, incidents, services, lịch trực, escalation, status, analytics | Xem | Xem | Xem | Xem |
| Danh sách People/team | Xem | Xem | Xem | Không |
| Invite, resend, revoke, đổi role, bật/tắt tài khoản | Có | Không | Không | Không |
| Sửa service, lịch trực, escalation, integration | Có | Có | Không | Không |
| Gán responder và Commander cho incident | Có | Có | Không | Không |
| ACK, resolve, note, AI mẫu, automation mô phỏng | Khi được gán | Cần thêm Responder và được gán | Khi được gán | Không |
| Sửa PIR nháp | Có | Có | Incident được gán | Không |
| Duyệt PIR, hoàn tất follow-up | Có | Có | Không | Không |
| Đọc PIR đã duyệt/hoàn tất | Có | Có | Có | Có |
| Audit quản trị | Có | Không | Không | Không |
| Sửa hồ sơ, avatar, mật khẩu của chính mình | Có | Có | Có | Có |

Phạm vi MVP hiện là **một tổ chức, một team Platform Engineering**. Role chỉ cấp loại thao tác; quyền sửa incident còn phụ thuộc người được giao hoặc Commander và trạng thái incident. Account Admin cũng phải đáp ứng điều kiện được giao khi phản hồi sự cố. Commander là trách nhiệm trên từng incident, không phải role toàn hệ thống. Team Manager có thể kết hợp Responder; Viewer được dùng riêng để giữ ý nghĩa chỉ đọc nghiệp vụ.

- **Admin overview:** tổng quan incident, invitations đang chờ, tình trạng cấu hình và các thay đổi gần đây. People & access có danh sách thành viên, bộ lọc, cấp quyền, vô hiệu hóa tài khoản, invitations và ma trận quyền.
- **Manager overview:** số sự cố, service đang bật, ca sắp tới và tình trạng cấu hình. Manager chỉnh các tài nguyên trong team, gán người xử lý và duyệt post-incident review. Manager không cấp quyền thành viên.
- **Responder:** mặc định vào Incidents, có Assigned to me, Commanding và All visible. Xem chi tiết incident, alert, timeline; ACK trước khi resolve; bắt buộc nhập lý do resolve. Chọn nhiều incident để ACK chỉ áp dụng các incident đủ quyền.
- **Viewer:** overview, incident/service/status/analytics và lịch trực ở chế độ đọc. Không có thao tác chỉnh nghiệp vụ, không xem trang quản trị People/Integration/Audit. Hồ sơ cá nhân vẫn sửa được.
- **Điều hướng:** dùng chung giao diện xanh của Responder, có menu và nút theo quyền. Truy cập hash trang quản trị khi thiếu quyền hiển thị thông báo từ chối. Logo NexusOps trở về workspace theo vai trò; icon chuông mở inbox riêng của tài khoản.

### 7.2. Thuật ngữ và danh sách incident

Số thẻ trạng thái tính trên phạm vi assignment đang chọn; tìm kiếm/service/priority thu hẹp bảng. Commander có thể có quyền phản hồi dù người Assigned to là đồng đội.

| Từ/nhãn trên giao diện | Giải thích |
|---|---|
| **Incident** | Một hồ sơ sự cố cần theo dõi và xử lý. Một incident có thể gom nhiều alert liên quan, nên số incident và số alert có thể khác nhau. |
| **Alert** | Một tín hiệu/cảnh báo cụ thể do nguồn giám sát phát ra, ví dụ tỷ lệ HTTP 5xx tăng. Nhiều alert phù hợp có thể cùng nằm trong một incident. |
| **Open** | Bộ lọc gộp các incident chưa Resolve, gồm cả Triggered và Acknowledged. Chọn tab này để xem việc còn đang mở. |
| **Triggered** | Incident đang ở trạng thái kích hoạt nhưng chưa được Responder xác nhận tiếp nhận. Sự cố cần người phụ trách ACK; chính sách escalation có thể tiếp tục chuyển thông báo khi chưa ACK. |
| **Acknowledged (ACK)** | Responder đã xác nhận nhận xử lý. ACK ghi thời điểm tiếp nhận và dừng escalation trong luồng nghiệp vụ; chưa có nghĩa là lỗi đã khắc phục. |
| **Resolved** | Incident đã được kết thúc. Trong demo, Responder phải ACK trước và nhập lý do Resolve; các alert liên kết được đánh dấu đóng. |
| **All incidents** | Bỏ lọc trạng thái và hiển thị incident thuộc phạm vi đang chọn ở nút Assigned to me / All, gồm cả Resolved. |
| **Assigned to me / Commanding / All visible** | Chuyển phạm vi danh sách giữa incident được giao cho bạn và incident mẫu có thể xem trong team. Assigned to me gồm incident mình là responder hoặc Commander; Commanding chỉ gồm incident mình là Commander; All visible gồm incident trong team. Thao tác phản hồi cần permission và assignment. Backend phải kiểm tra scope đọc và quyền thao tác khi triển khai thật. |
| **Priority — P1…P5** | Mức ưu tiên vận hành được gán cho incident. P1 là mức cao nhất và P5 thấp nhất theo thứ tự trong giao diện; mức này biểu thị thứ tự cần chú ý, không tự khẳng định mức độ ảnh hưởng thực tế. Chọn để lọc. |
| **Service** | Thành phần/dịch vụ liên quan, ví dụ `payments-api` hoặc `auth-service`. Mỗi service có thể có nhiều incident. |
| **Created** | Thời điểm incident được tạo, hiển thị ngày/giờ theo trình duyệt. |
| **Escalation — Level 1 / 2** | Incident đang ở mức thông báo nào trong chính sách hai mức mẫu. Mức này mô tả bước chuyển cấp, không phải priority và cũng không phải số người đã phản hồi. Bộ đếm/chuyển cấp thật chưa chạy trong demo. |
| **Assigned to** | Tài khoản đang chịu trách nhiệm cho incident. `You` là tài khoản hiện đăng nhập; Commander hiện tại vẫn có thể phản hồi khi có permission, dù Assigned to là đồng đội. |
| **Stopped** | Hiện không còn bước escalation đang chờ, thường vì incident đã ACK hoặc Resolve. Chữ này không tự nói rằng incident đã được khắc phục; hãy xem Status. |
| **Search incidents, service or ID** | Tìm theo tiêu đề incident, tên service hoặc mã số như `1048`. |
| **All visible services / All priorities** | Bộ lọc incident theo service đang hiển thị trong phạm vi đã chọn hoặc theo P1–P5. Kết hợp được với bộ lọc trạng thái và tìm kiếm. |
| **Newest first / Oldest first / Highest priority** | Cách sắp xếp các hàng đang hiển thị. Highest priority đưa P1 lên trước. |
| **Checkbox và Acknowledge** | Chọn một hoặc nhiều incident Triggered được giao cho mình rồi ACK hàng loạt. Incident đã ACK/Resolve không thể chọn để ACK lại trong bảng. |

Luồng xử lý thủ công trong demo là **Triggered → Acknowledged → Resolved**. Theo MVP, incident cũng có thể tự Resolve khi tất cả alert liên quan đã phục hồi; nhánh tự động này chưa chạy trong giao diện mẫu. ACK và Resolve là hai hành động khác nhau: ACK nhận trách nhiệm xử lý; Resolve kết thúc incident sau khi xử lý. Thông báo trong Inbox cũng tách biệt: đánh dấu notification là đã đọc không làm incident được ACK.

### 7.3. Chức năng và cách sử dụng các màn nghiệp vụ

- **Services:** tìm kiếm, tạo/sửa mô tả, criticality, dependencies và bật/tắt. Identifier bất biến để không làm hỏng các tham chiếu. Sơ đồ ownership/dependency được vẽ trực tiếp bằng giao diện.
- **On-call schedule:** lịch tuần, chuyển tuần, Today, chọn service/múi giờ, Primary/Secondary, gán responder cùng giờ bắt đầu/kết thúc. Ca 30 phút đến 7 ngày, không chồng nhau trong cùng service/layer. Manager/Admin thêm, sửa, xóa; người khác đọc. Đây là ca cụ thể, chưa có bộ sinh rotation hoặc timezone DST.
- **Escalation:** hai cấp, targets, timeout, số lần và khoảng nhắc lại, backstop; kiểm tra người nhận có quyền phản hồi. Policy có version để phát hiện sửa trên bản cũ. Lịch trực là thông tin coverage; test event hiện dùng target tĩnh cấp đầu của policy, chưa tự chuyển cấp bằng timer/paging backend.
- **Integrations:** cấu hình một nguồn demo cho service, bật/tắt và tạo test event. Event tạo incident mới cùng thông báo cho người được giao. Không tạo API key hay webhook thật.
- **AI & automation:** điều tra mẫu có alert ID tham chiếu và giả thuyết chưa xác nhận; runbook cố định kiểm tra sức khỏe service. Proposal → approve/reject → mô phỏng execute. Chặn chạy chưa duyệt, chạy lại, chạy incident đã resolve; quota hai lần/service/15 phút. Resolve hủy proposal còn chờ. Không gọi model, shell hay hệ thống bên ngoài.
- **Post-incident review:** tạo nháp khi resolve; Draft → In review → Approved → Completed. Người được giao soạn, Manager/Admin duyệt hoặc trả sửa; nội dung đã duyệt không chỉnh trực tiếp, phải hoàn tất follow-up trước khi đóng nếu có follow-up. Viewer chỉ đọc bản approved/completed.
- **Status/Analytics:** status suy ra từ incident mẫu; chọn cửa sổ 24 giờ/7 ngày/30 ngày để tính MTTA/MTTR và số mẫu. Demo hiện lọc cohort theo thời điểm tạo incident; hợp đồng M7 chọn mẫu MTTA theo thời điểm ACK và MTTR theo thời điểm Resolve, nên còn cần đồng bộ khi triển khai backend. Không tuyên bố uptime thực tế.
- **Onboarding:** checklist theo quyền và dữ liệu thật của demo, mỗi bước dẫn đến màn cấu hình tương ứng. Inbox chỉ chứa thông báo của người đang đăng nhập; đọc thông báo không đồng nghĩa ACK incident.

<a id="escalation-demo"></a>

### 7.4. Escalation và lịch trực: phạm vi hiện tại

Mở từ thanh công cụ phụ **On-call schedule** hoặc **Escalation policies**. Admin/Manager chỉnh cấu hình, Responder/Viewer đọc. Policy có hai level, targets, ACK timeout, reminder và backstop; Save tăng version, Response preview giải thích đường phản hồi. Test event chọn người đủ quyền đầu tiên trong targets của level 1, tạo incident và inbox notification. Chưa có timer tự chuyển level hoặc gửi paging.

Scheduler ghi ca cụ thể với ngày/giờ, service, người trực, layer và múi giờ UTC/Việt Nam/Singapore. Ca qua ngày hiển thị ở từng ngày liên quan; chặn overlap cùng service/layer. Coverage chưa được dùng để tự chọn responder cho test event.

Rotation builder, nút No ACK/Simulate ACK và Confirm escalation review của workspace Responder cũ còn trong source nhưng **không nằm trong workspace đang được App mở**. Không coi những tính năng đó là đang hoạt động ở giao diện đa vai trò. Workspace mới cũng không có Reset sample data hay bộ lọc Unread only của bản cũ.

### 7.5. Onboarding theo quyền

Banner **Complete onboarding** mở `/#workspace/setup`; số bước tính từ dữ liệu, không đánh dấu xong chỉ vì mở trang.

| Người dùng | Các bước và điều kiện hoàn thành |
|---|---|
| Mọi tài khoản | Profile có chức danh và số điện thoại |
| Admin | Thêm bước có ít nhất một invitation đã được chấp nhận |
| Admin/Manager | Service đều có mô tả; có ca chưa kết thúc; service đang bật đều có policy version > 1; có integration đang bật và đã test |
| Responder thuần | Có ca của mình chưa kết thúc; đã ACK incident và có audit tương ứng |
| Viewer | Chỉ bước hoàn thiện profile |

Tài khoản kết hợp Manager + Responder dùng checklist quản lý. Nút Continue/Review dẫn đến trang tương ứng; ca hết hạn hoặc cấu hình đổi có thể làm bước chưa hoàn thành trở lại. Demo kiểm tra bước ACK bằng tên actor trong audit nên đổi tên profile có thể ảnh hưởng kết quả bước này; backend cần gắn tiến độ bằng ID ổn định.

### 7.6. Một luồng demo xuyên vai trò

1. Admin mời Viewer hoặc Responder, sao chép mã để người nhận tạo tài khoản.
2. Manager vào Services kiểm tra mô tả, vào Schedule gán ca cho Responder và lưu Escalation policy.
3. Manager bật integration và gửi test event. Incident mới xuất hiện cùng inbox notification của người được policy chọn.
4. Đăng nhập người được giao, mở incident, ACK, thêm ghi chú, tạo điều tra mẫu hoặc đề xuất runbook. Approve rồi Run sandbox simulation nếu cần; không chạy lệnh thật.
5. Resolve với lý do. Hệ thống đóng alert, hủy action pending/approved còn lại và tạo PIR nháp.
6. Responder được giao hoặc Manager soạn PIR, chọn chủ follow-up rồi Submit for review. Manager duyệt và xác nhận hoàn tất follow-up trước khi Complete.
7. Viewer đọc trạng thái, số liệu và PIR đã duyệt. Admin xem audit để theo dõi các thay đổi.

<a id="hien-trang"></a>

## 8. Trạng thái hiện thực và vòng đời dữ liệu

| Hạng mục | Đang hoạt động trong frontend | Chưa triển khai/kết nối |
|---|---|---|
| Landing, Products, Platform | Landing có minh họa và tám trang chi tiết công khai | Dữ liệu vận hành thật trong minh họa |
| Solutions, Resources, Customer, Pricing | Bốn Solution, 12 trang Resources, Customer và Pricing Free; guides/glossary/FAQ và API Draft | Case study thật, API live, help desk và billing |
| Login/Sign Up | Nhiều tài khoản, invitation accept/resend/revoke, đổi mật khẩu, session version | Xác thực server, gửi mail, JWT/refresh hoặc session backend |
| Role và scope | Ma trận cố định, kiểm tra tại handler, chặn route/thao tác thiếu quyền | Enforcement mỗi API, giao dịch DB, kiểm soát đa tổ chức/team |
| Services, lịch, policy, integration | Cấu hình cục bộ theo role và test incident | Monitor adapter, rotation nền, schedule routing, delivery worker |
| Incident và inbox | Assignment/Commander, ACK, note, resolve, notification riêng | Intake/dedup/grouping/recovery tự động từ monitor thật |
| AI/Automation | Báo cáo mẫu, proposal/approval/execute mô phỏng, quota cục bộ | Model/RAG, snapshot hash, sandbox executor, cooldown/circuit breaker server |
| PIR, status, analytics, audit | Workflow PIR đơn giản, số liệu từ timestamps, audit cục bộ | Báo cáo production, audit append-only và truy vấn server |

Dữ liệu dùng localStorage `nexusops.workspace.roles.v1`, phiên dùng sessionStorage `nexusops.identity.v1`. Đăng xuất không xóa dữ liệu; các tài khoản trên cùng origin nhìn thấy thay đổi chung. Dữ liệu demo Responder cũ không được di chuyển sang bộ dữ liệu mới. Không đồng bộ giữa các trình duyệt hoặc thiết bị.

Frontend không thể bảo vệ dữ liệu khỏi người tự sửa storage/devtools. Token lời mời, audit và session chỉ mô phỏng; không có tính nguyên tử giữa nhiều tab. Backend M1 vẫn cần bootstrap được bảo vệ, API đăng nhập/lấy user-permissions, token invitation được băm và giao dịch accept, kiểm tra scope từng request, session server, database, audit bất biến và gửi mail. Không coi bản demo này là xác thực/phân quyền production.


**Kiểm tra Resources — 04/10/2026:** build, lint và 40 kiểm tra Chrome headless đạt; 12 trang được kiểm tra ở 1440/768/390 px, không tràn ngang cấp trang hoặc lỗi JavaScript. Đã kiểm tra glossary/filter/empty state, tìm kiếm tài liệu, JSON mẫu, FAQ, focus khi cuộn, điều hướng Resources và mẫu báo lỗi Help & Support. Ảnh desktop/tablet/mobile đã được xem lại. Phạm vi kiểm tra này là Resources; 12 kiểm tra logic quyền được ghi nhận ở lần hiện thực trước và không chạy lại trong thay đổi tài liệu này.

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
| `/#customers` | Trang Customer riêng: nhóm sử dụng, trách nhiệm theo vai trò và journey minh họa |
| `/#solution-reduce-alert-noise` | Solution Reduce Alert Noise; minh họa dedup/grouping xác định trong cùng service theo rule/window |
| `/#solution-coordinate-incident-response` | Solution Coordinate Incident Response; minh họa ownership, ACK, escalation hữu hạn và timeline |
| `/#solution-investigate-with-confidence` | Solution Investigate & Act with Confidence; minh họa evidence, giả thuyết, approval và sandbox boundary |
| `/#solution-improve-after-every-incident` | Solution Improve After Every Incident; minh họa PIR review, follow-up và MTTA/MTTR kèm sample count |
| `/#product-incident-management` | Trang công khai Incident Management, giải thích luồng alert đến resolve theo MVP |
| `/#product-on-call-escalation` | Trang công khai On-call & Escalation, giải thích coverage và policy hai level có backstop |
| `/#product-ai-automation` | Trang công khai AI Investigation & Automation; giải thích evidence, giả thuyết, action snapshot, human approval và sandbox theo MVP |
| `/#product-post-incident-insights` | Trang công khai Post-Incident Review & Insights; giải thích PIR states, evidence-backed draft, action items và MTTA/MTTR kèm sample count |
| `/#platform-service-catalog` | Trang Platform Service Catalog; minh họa ownership, criticality, status và dependency có hướng |
| `/#platform-monitoring-integrations` | Trang Platform Monitoring Integrations; giải thích authenticated intake, idempotency, dedup/grouping và recovery ordering |
| `/#platform-policies-permissions` | Trang Platform Policies & Permissions; minh họa role map, object scope, incident commander và escalation policy |
| `/#platform-audit-trail` | Trang Platform Audit Trail; minh họa audit append-only, actor/action/resource và truy vấn có scope |
| `/#pricing` | Gói Free và quyền theo vai trò |
| `/#login` | Đăng nhập demo |
| `/#signup` | Giao diện đăng ký theo lời mời |
| `/#workspace` | Workspace đa vai trò; hiển thị Login nếu phiên không hợp lệ |

**Vào demo:** chọn tài khoản tại **Demo account**, bấm **Use demo account** trên Login rồi bấm **Log in**, hoặc nhập email `responder@nexusops.demo` và mật khẩu `NexusOps@2026`.

Các lệnh kiểm tra trong thư mục frontend:

```bash
npm run build
npm run lint
```

Xem [nexusops-ui/README.md](nexusops-ui/README.md) để tra cấu trúc mã nguồn và giới hạn kỹ thuật. README sẽ tiếp tục được cập nhật khi có thêm màn hình hoặc kết nối API.
