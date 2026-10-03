# NexusOps UI

Frontend React + TypeScript + Vite cho NexusOps. Gồm landing page, Login/Sign Up và workspace Responder sử dụng dữ liệu mẫu.

Xem [README dự án](../README.md) để đọc tổng quan, chức năng Products/Solutions/Customer/Resources, Pricing, thuật ngữ giao diện và trạng thái MVP. Tài liệu này tập trung vào cách chạy và tổ chức mã frontend.

## Chạy ứng dụng

Từ thư mục `nexusops-ui`:

```bash
npm install
npm run dev
```

Mở địa chỉ Vite in trong terminal. Các lệnh khác:

| Lệnh | Tác dụng |
|---|---|
| `npm run build` | Kiểm tra TypeScript và tạo bản build vào `dist/` |
| `npm run lint` | Kiểm tra ESLint |
| `npm run preview` | Phục vụ bản build đã tạo để xem trước |

## Điều hướng và tài khoản demo

| Đường dẫn | Màn hình |
|---|---|
| `/` | Landing page với dropdown Products, Solutions, Resources; Customer là liên kết thường; Pricing ở cuối thanh điều hướng |
| `/#product-incident-management` | Trang chi tiết công khai Incident Management; mô tả luồng alert → incident → ACK/phối hợp → resolve theo MVP |
| `/#product-on-call-escalation` | Trang chi tiết công khai On-call & Escalation; mô tả coverage theo service và luồng hai level/backstop |
| `/#product-ai-automation` | Trang chi tiết công khai AI Investigation & Automation; minh họa evidence, hypothesis, human approval và sandbox guardrails theo MVP |
| `/#pricing` | Gói Free, chức năng và quyền; CTA đến Login/Sign Up |
| `/#login` | Đăng nhập demo Responder |
| `/#signup` | Form tạo tài khoản theo lời mời, hiện là preview |
| `/#workspace` | Workspace; hiển thị Login nếu chưa có dấu hiệu phiên demo |

- Email: `responder@nexusops.demo`
- Mật khẩu: `NexusOps@2026`
- Nút **Use demo account** điền nhanh thông tin; bấm **Log in** để vào workspace.

## Các màn hình workspace

Mọi màn hình sau Login đều ở trong `/#workspace`; các tab được điều khiển bằng state React chứ chưa có URL riêng. Logo NexusOps quay về Incident overview, chọn phạm vi **Assigned to me** và xóa bộ lọc/tìm kiếm cùng incident đang mở. Taskbar chứa **Incidents, Services, People, Status, Integrations, Analytics, Automation**. Inbox mở từ chuông cạnh profile; số chưa đọc hiện trên badge và chuông có hiệu ứng nhẹ để người dùng nhận ra. AI Investigation hiện chưa có mục điều hướng.

**Incidents:** overview mặc định có thẻ tổng số Open/Triggered/Acknowledged/Resolved và bảng incident. Người dùng đổi phạm vi **Assigned to me / All**, tìm theo tiêu đề/service/ID, lọc trạng thái, service và priority, rồi sắp xếp mới nhất/cũ nhất/priority cao nhất. Responder chỉ ACK incident Triggered được giao cho mình; có thể ACK nhiều hàng cùng lúc. Incident mở ở drawer để xem alert, timeline và thêm ghi chú; Resolve chỉ bật sau ACK và yêu cầu lý do. All minh họa phạm vi một team, incident của đồng đội là chỉ đọc.

**Inbox:** mở qua biểu tượng chuông, không còn là tab taskbar. Có thể xem tất cả hoặc chỉ thông báo chưa đọc, đánh dấu từng thông báo hay đánh dấu tất cả đã đọc, và mở incident liên quan. Đọc notification chỉ cập nhật trạng thái đọc, không ACK incident.

**Services và People:** Services tìm và xem service mẫu, criticality, owner/team, dependency, integration mẫu và số incident được giao; chọn service có thể mở danh sách incident tương ứng. People có tab Members/Teams, bộ lọc account role và response assignment, hồ sơ thành viên cùng incident liên quan. Các trang dùng cùng fixture và không cho Responder sửa membership, role hoặc service configuration.

**Status:** ba thẻ service suy ra Operational/Investigating/Action needed từ incident mẫu và liên kết về incident. Không đọc monitor thật, đo uptime hay tính SLA.

**Integrations:** một form demo lưu tên, service đích, trạng thái Enable/Pause và thời điểm gửi test event gần nhất trong state frontend. Test chỉ chạy local simulator; không sinh credential, gửi webhook ra ngoài hay tạo alert production.

**Analytics:** chọn khoảng 24 giờ, 7 ngày hoặc 30 ngày để xem số incident, thời gian ACK trung bình, thời gian Resolve trung bình, phân bố theo service và trạng thái. Đây là số liệu tính từ fixture, không phải báo cáo SLA; incident không có mốc ACK/Resolve không tham gia trung bình tương ứng.

**Automation:** từ incident chưa Resolve có thể tạo action demo, xem evidence snapshot, approve/reject và mô phỏng kết quả. Không chạy shell command hoặc kết nối executor. AI Investigation component còn trong source, nhưng đã tạm bỏ khỏi taskbar và không có lối mở từ workspace hiện tại.

**Escalation policies:** mở từ People, sidebar Incident, footer hoặc onboarding. Mỗi service mẫu có một policy với tên, mô tả, hai level và backstop. Mỗi level hỗ trợ nhiều người nhận, ACK timeout 1–60 phút, 0–5 nhắc thêm và khoảng cách nhắc 1–60 phút. Save tạo version mới; mô phỏng chụp snapshot của policy đã lưu, nút No ACK tiến đồng hồ ảo, Simulate ACK dừng các mốc sau. Policy kết thúc bằng một lần báo backstop và không lặp vô hạn. Confirm review hoàn thành onboarding; lưu policy mới khiến cần review lại. Policy chỉ là practice config trong bộ nhớ; nó không thay đổi incident/inbox mẫu hoặc gửi paging thật. Chi tiết luồng và ví dụ thời gian nằm trong [README dự án](../README.md#escalation-demo).

**On-call Schedule:** lịch tuần có múi giờ, tạo/sửa/xóa shift, xử lý shift qua đêm và kiểm tra overlap theo service/layer. Rotation builder dựng trước batch shift theo thành viên, cadence ngày/tuần và ngày được chọn; người dùng Preview rồi mới áp dụng. Schedule hiện chỉ là kế hoạch cục bộ, không tự thay đổi escalation targets.

**Account setup:** checklist sáu bước giữ tiến độ theo trạng thái thực tế của demo. Các nút mở Profile, inbox, scheduler, escalation designer hoặc integration simulator. Test alert cần ca trực hợp lệ cho tài khoản và escalation review hoàn tất; chỉ tạo tối đa một incident onboarding trong phiên.

**Profile:** cập nhật thông tin liên hệ/công việc và ảnh đại diện trong workspace. Email và role không sửa được; profile không lưu lên server.

Đây đều là giao diện preview. Bộ nhớ React giữ dữ liệu khi chuyển tab; tải lại hoặc thoát workspace đặt lại theo mô hình demo. **Reset sample data** khôi phục incident/inbox, onboarding, lịch, escalation policies và cấu hình integration; AI actions, reports và profile được giữ lại.

## Cấu trúc mã nguồn

| Đường dẫn | Trách nhiệm |
|---|---|
| `src/App.tsx` | Landing page, điều hướng hash và cổng vào phiên demo |
| `src/components/ProductsMenu.tsx` | Dropdown giới thiệu Product/Platform |
| `src/components/LandingStory.tsx` | Phần cuộn dưới hero: workspace minh họa, bốn mục lifecycle tương tác, sơ đồ signal, đối tượng sử dụng, CTA/footer |
| `src/components/landing-story.css` | Bố cục responsive, minh họa HTML/CSS và hiệu ứng nhẹ cho phần giới thiệu trang chủ |
| `src/components/SolutionsMenu.tsx` | Dropdown tình huống, vấn đề và cách hỗ trợ |
| `src/components/ResourcesMenu.tsx` | Mega menu Documentation/Guides/Resources với mô tả mở rộng |
| `src/pages/PricingPage.tsx` | Trang Pricing một gói Free và mô tả quyền theo MVP |
| `src/pages/IncidentManagementPage.tsx` | Trang giới thiệu Incident Management với hồ sơ incident minh họa và giải thích phạm vi MVP |
| `src/pages/OnCallEscalationPage.tsx` | Trang giới thiệu lịch trực, policy hai level, timeout/reminder, backstop và ranh giới giữa lịch với targets |
| `src/pages/AIInvestigationAutomationPage.tsx` | Trang công khai AI Investigation & Automation; phân biệt điều tra có dẫn chứng với execution có approval/guardrails |
| `src/pages/AuthPage.tsx` | Login/Sign Up, kiểm tra form và hỗ trợ nhập mật khẩu |
| `src/demo/auth.ts` | Tài khoản mẫu và dấu hiệu phiên demo trong `sessionStorage` |
| `src/features/responder/ResponderDashboard.tsx` | Incident overview, taskbar workspace, inbox, chuông thông báo và điều hướng Responder |
| `src/features/responder/IncidentDetails.tsx` | Bảng chi tiết, ACK, Resolve và ghi chú |
| `src/features/responder/WorkspacePages.tsx` | Services, People, AI, Automation và Profile |
| `src/features/responder/system-config.ts` | Cấu hình integration mẫu và giá trị khởi tạo |
| `src/features/responder/SystemPages.tsx` | Trang Status, cấu hình Monitoring Integration dạng demo và Analytics từ incident mẫu |
| `src/features/responder/EscalationPage.tsx` | Policy designer trong People, chọn target, lưu phiên bản, mô phỏng và xác nhận onboarding |
| `src/features/responder/escalation.ts` | Kiểm tra policy hai level và sinh timeline timeout/reminder/backstop hữu hạn |
| `src/features/responder/escalation.css` | Bố cục policy editor, preview timeline và kiểu màn hình hẹp |
| `src/features/responder/PeoplePage.tsx` | Danh bạ Members/Teams, tìm kiếm, lọc và chi tiết thành viên theo phạm vi team mẫu |
| `src/features/responder/OnboardingPage.tsx` | Checklist sáu bước và màn hình cấu hình/thử nghiệm dành cho Responder |
| `src/features/responder/SchedulePage.tsx` | Lịch tuần, form tạo/sửa/xóa ca và hiệu ứng CSS 3D |
| `src/features/responder/RotationBuilder.tsx` | Cấu hình tên lịch, người trực theo thứ tự, rotation ngày/tuần, restrictions và preview trước khi thêm ca |
| `src/features/responder/schedule.ts` | Timestamp/múi giờ, kiểm tra thời lượng và chồng ca, điều kiện hoàn thành onboarding |
| `src/features/responder/onboarding.ts` | Tính tiến độ setup từ xác nhận, thông báo đã đọc và vòng đời incident thử |
| `src/features/responder/model.ts` | Fixture incident/inbox và reducer cập nhật trạng thái |
| `src/features/responder/workspace-types.ts` | Kiểu dữ liệu profile và các mục điều hướng |
| `src/motion.css` | Hiệu ứng chuyển trang, hover/click và reduced motion |

CSS của các component/trang được đặt cạnh file tương ứng. Giao diện dùng Tailwind CSS và icon Lucide React.

## Hành vi của demo

**Incident:** Assigned to me gồm sáu incident của tài khoản hiện tại; All gồm chín incident mẫu trong team. Incident giao cho đồng đội chỉ đọc. ACK chỉ dành cho incident Triggered được giao cho mình; Resolve yêu cầu đã ACK và có lý do. Đọc thông báo không thực hiện ACK.

**AI và Automation:** báo cáo được tạo từ alert mẫu; action yêu cầu approve/reject trước khi mô phỏng thực thi. Incident đã Resolve chặn quyết định/thực thi tiếp. Không gọi model, retrieval, lệnh hệ thống hay hạ tầng bên ngoài.

**Escalation:** mở People → Escalation policies. Mỗi service có policy hai level, nhiều user target, timeout/nhắc lại hữu hạn và một backstop. Save tăng phiên bản; mô phỏng giữ snapshot và tiến thời gian bằng nút No ACK. ACK dừng các bước còn lại; backstop chỉ được thông báo một lần. Confirm review hoàn thành onboarding, lưu policy mới yêu cầu review lại. Draft và lượt mô phỏng giữ khi chuyển mục; Reset sample data đặt lại cả hai. Đây là designer cục bộ, chưa áp dụng vào incident/inbox thật và chưa thay thế quyền quản lý service ở backend.

**Profile:** cho sửa tên, chức danh, phòng ban, số điện thoại, địa điểm, tùy chọn múi giờ và ảnh PNG/JPG/WebP tối đa 2 MB. Email/role không sửa được. Múi giờ là tùy chọn demo; timestamp vẫn theo trình duyệt.

**Dữ liệu:** state giữ nguyên khi chuyển mục trong workspace; rời workspace hoặc tải lại trang sẽ reset. Reset sample data khôi phục incident/inbox, onboarding, lịch, escalation policies và cấu hình integration; báo cáo AI, action và profile đang có được giữ lại.

**Xác thực:** `sessionStorage` chỉ lưu dấu hiệu phiên demo, không lưu mật khẩu được nhập. Logout xóa dấu hiệu này. Signup chỉ kiểm tra form; chưa xác minh invitation hoặc tạo tài khoản. Kiểm tra mật khẩu tám ký tự là quy tắc UI tạm thời.

Khi nối backend, cần thay fixture và guard demo bằng API kiểm tra xác thực, quyền đọc, team/service/incident scope, điều kiện chuyển trạng thái và giới hạn automation. Dữ liệu mẫu và kiểm tra phía frontend hiện chỉ phục vụ trình diễn.
