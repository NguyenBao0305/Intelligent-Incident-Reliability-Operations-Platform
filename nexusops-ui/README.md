# NexusOps UI

Frontend React + TypeScript + Vite cho landing page và workspace đa vai trò NexusOps. **Cập nhật 03/10/2026.** Xem [README dự án](../README.md) để đọc tổng quan, ma trận quyền, ý nghĩa từng màn, luồng invitation và giới hạn MVP.

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Chạy từ `nexusops-ui`, mở origin do Vite cung cấp. `npm run build` kiểm tra TypeScript và tạo `dist/`; `npm run lint` chạy ESLint; `npm run preview` phục vụ bản build.

## Đăng nhập demo

| Tài khoản mẫu | Vai trò |
|---|---|
| `admin@nexusops.demo` | Account Admin |
| `manager@nexusops.demo` | Team Manager |
| `responder@nexusops.demo` | Responder |
| `viewer@nexusops.demo` | Viewer |
| `commander@nexusops.demo` | Team Manager + Responder, được gán Commander cho incident #1048 |

Mật khẩu khởi tạo chung: `NexusOps@2026`. Tại Login chọn **Demo account**, bấm **Use demo account**, rồi Log in. Đây là chọn một tài khoản mẫu, không phải tự chọn quyền cho tài khoản đang đăng ký. Khi đổi mật khẩu hoặc quyền, thông tin mới được dùng cho những lần đăng nhập sau.

## Điều hướng

| Đường dẫn | Nội dung |
|---|---|
| `/` | Landing page, dropdown Products và Solutions |
| `/#customers` | Trang Customer riêng; nhóm người dùng và hành trình MVP minh họa, không có testimonial giả |
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

Các màn workspace có hash riêng; truy cập trực tiếp vẫn kiểm tra phiên và quyền. Logo trở về Overview cho Admin/Manager/Viewer, Incidents cho Responder thuần.

| Hash sau `/#workspace/` | Nội dung và quyền |
|---|---|
| `overview` | Tổng quan theo role, READ |
| `incidents` | Danh sách/chi tiết, READ; mutation cần assignment + permission + trạng thái |
| `services` | Đọc READ; tạo/sửa SERVICE_MANAGE |
| `people` | PEOPLE_VIEW; tab invitation/quyền và quản lý thành viên dành Admin |
| `schedule` | Đọc READ; chỉnh SCHEDULE_MANAGE |
| `escalation` | Đọc READ; chỉnh ESCALATION_MANAGE |
| `integrations` | INTEGRATION_MANAGE |
| `status`, `analytics` | READ |
| `reviews` | READ; draft chỉ editor/reviewer, bản approved/completed cho người đọc |
| `automation` | AUTOMATION_EXECUTE; quyết định/thực thi cần assignment trên incident |
| `audit` | AUDIT_VIEW, hiện chỉ Admin |
| `profile`, `inbox`, `setup` | Hồ sơ, thông báo và checklist của tài khoản hiện tại |

AI mẫu mở trong chi tiết incident; không có route AI riêng. Workspace dùng một team, role map cố định; Viewer không kết hợp role khác. Commander là assignment, xem [ma trận đầy đủ](../README.md#workspace).

## Cấu trúc mã nguồn đang sử dụng

| File/thư mục | Trách nhiệm |
|---|---|
| `src/App.tsx` | Landing, hash navigation, cổng phiên và render Workspace |
| `src/pages/AuthPage.tsx` | Login, nhận invitation, validation và tài khoản mẫu |
| `src/features/access/policy.ts` | Role, permission, team scope và incident assignment |
| `src/features/access/store.ts` | Seed, lưu trữ, session, password, invitations, reducer kiểm tra mọi mutation |
| `src/features/access/Workspace.tsx` | Layout, menu theo quyền, overview, status, analytics, inbox, onboarding |
| `src/features/access/PeopleAccess.tsx` | Members, invitations, role matrix, team |
| `src/features/access/Configuration.tsx` | Services, scheduler, escalation, integration |
| `src/features/access/Operations.tsx` | Incident filters/assignment, AI mẫu, action và PIR |
| `src/features/access/ProfileAudit.tsx` | Hồ sơ/avatar, mật khẩu, audit search/filter |
| `src/features/access/useNow.ts` | Cập nhật thời gian giao diện mỗi 30 giây |
| `src/features/access/workspace.css` | Bố cục xanh, responsive, calendar, minh họa và reduced motion |
| `src/features/responder/IncidentDetails.tsx` | Drawer incident được workspace mới tái sử dụng |
| `src/features/responder/model.ts`, `escalation.ts`, `schedule.ts` | Fixture và helper được tái sử dụng |
| `src/components/*Menu.tsx` | Products, Solutions, Resources |
| `src/components/LandingStory.tsx` | Phần scroll giới thiệu có minh họa thay review khách hàng |
| `src/pages/*Page.tsx` | Pricing, bốn Product và PlatformCapabilityPage cho bốn năng lực Platform |

`ResponderDashboard.tsx`, `SchedulePage.tsx`, `RotationBuilder.tsx`, `EscalationPage.tsx`, các màn workspace cũ và `src/demo/auth.ts` vẫn còn trong source, nhưng không phải entry point workspace/auth hiện tại. Không sửa các màn cũ rồi kỳ vọng App tự hiển thị chúng. Rotation builder, mô phỏng No ACK/Simulate ACK, Reset sample data và Unread only của phiên bản cũ không có trên workspace mới.

## Luồng dữ liệu và giới hạn kỹ thuật

- `useData()` dùng `useSyncExternalStore`; thay đổi đi qua `dispatch()` → `reduceCommand()` → lưu snapshot → thông báo subscriber. Guard trong reducer kiểm tra role/scope/assignment/trạng thái, ngoài việc ẩn nút trên UI.
- localStorage `nexusops.workspace.roles.v1` lưu users, invitations, services, incidents, shifts, policies, integrations, reviews, actions, audit và notices. Tải lại/đăng xuất không xóa dữ liệu đã lưu. Fixture được dùng nếu chưa có snapshot hợp lệ; không migrate dữ liệu demo cũ.
- sessionStorage `nexusops.identity.v1` lưu ID và version phiên. Đổi role, trạng thái hoặc mật khẩu làm mất hiệu lực phiên cũ. Dữ liệu chia sẻ cùng origin; không chia sẻ giữa thiết bị/trình duyệt. Sự kiện storage cập nhật snapshot ở tab khác, chưa có giao dịch nguyên tử đa tab.
- Credential mới dùng PBKDF2 SHA-256, salt riêng; password tối thiểu 8 ký tự. Tài khoản seed dùng mật khẩu công khai. Mã invitation có hạn 72 giờ nhưng chỉ là mã demo lưu cục bộ. Chưa có mail, API auth, database hay cơ chế bảo mật server.
- Lịch lưu timestamp, ba múi giờ UTC/Ho Chi Minh/Singapore. Ca 30 phút–7 ngày, chặn overlap cùng service/layer. Không routing theo lịch hoặc sinh rotation trong workspace mới.
- Test integration tạo incident từ target đủ quyền đầu tiên ở level 1; không tự tăng cấp hoặc gửi paging. Inbox riêng mỗi user, đọc notification không ACK.
- Automation chỉ inspect-health mô phỏng, phải duyệt trước khi execute, hai lần/service/15 phút. Không có lệnh shell, model thật, snapshot hash/circuit breaker server.
- PIR là workflow đơn giản với một follow-up và owner. Người đọc chỉ thấy approved/completed; editor được giao và Manager/Admin thấy draft theo quyền.
- Avatar JPG/PNG/WebP tối đa 2 MB; lưu vào localStorage có thể chạm quota, UI báo lỗi khi lưu thất bại. Profile timezone không thay toàn bộ timestamp trình duyệt.
- Quyền frontend và audit cục bộ không chống sửa bằng devtools. M1 cần triển khai lại kiểm tra quyền trong backend, API user/permissions, invitation accept có transaction, session và audit bất biến.

## Trạng thái kiểm tra

Lần hiện thực workspace gần nhất đã chạy build, lint và 12 kiểm tra logic quyền thành công. Chưa xác nhận trực quan toàn bộ giao diện vì công cụ trình duyệt lỗi khởi động. Lần cập nhật README này chỉ thay tài liệu, không chạy lại test ứng dụng.
