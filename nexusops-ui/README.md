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
| `/#pricing` | Gói Free, chức năng và quyền; CTA đến Login/Sign Up |
| `/#login` | Đăng nhập demo Responder |
| `/#signup` | Form tạo tài khoản theo lời mời, hiện là preview |
| `/#workspace` | Workspace; hiển thị Login nếu chưa có dấu hiệu phiên demo |

- Email: `responder@nexusops.demo`
- Mật khẩu: `NexusOps@2026`
- Nút **Use demo account** điền nhanh thông tin; bấm **Log in** để vào workspace.

Các mục Incidents, Inbox, Services, People, AI Investigation, Automation và Profile được điều khiển bằng state trong workspace. People gồm Members/Teams, tìm kiếm, bộ lọc, hồ sơ thành viên và incident được giao. Chúng chưa có URL riêng; Back/Forward của trình duyệt chỉ theo lịch sử hash cấp trang.

## Cấu trúc mã nguồn

| Đường dẫn | Trách nhiệm |
|---|---|
| `src/App.tsx` | Landing page, điều hướng hash và cổng vào phiên demo |
| `src/components/ProductsMenu.tsx` | Dropdown giới thiệu Product/Platform |
| `src/components/SolutionsMenu.tsx` | Dropdown tình huống, vấn đề và cách hỗ trợ |
| `src/components/ResourcesMenu.tsx` | Mega menu Documentation/Guides/Resources với mô tả mở rộng |
| `src/pages/PricingPage.tsx` | Trang Pricing một gói Free và mô tả quyền theo MVP |
| `src/pages/AuthPage.tsx` | Login/Sign Up, kiểm tra form và hỗ trợ nhập mật khẩu |
| `src/demo/auth.ts` | Tài khoản mẫu và dấu hiệu phiên demo trong `sessionStorage` |
| `src/features/responder/ResponderDashboard.tsx` | Danh sách incident, bộ lọc, inbox và điều hướng workspace |
| `src/features/responder/IncidentDetails.tsx` | Bảng chi tiết, ACK, Resolve và ghi chú |
| `src/features/responder/WorkspacePages.tsx` | Services, People, AI, Automation và Profile |
| `src/features/responder/PeoplePage.tsx` | Danh bạ Members/Teams, tìm kiếm, lọc và chi tiết thành viên theo phạm vi team mẫu |
| `src/features/responder/OnboardingPage.tsx` | Checklist sáu bước và màn hình cấu hình/thử nghiệm dành cho Responder |
| `src/features/responder/SchedulePage.tsx` | Lịch tuần, form tạo/sửa/xóa ca và hiệu ứng CSS 3D |
| `src/features/responder/schedule.ts` | Timestamp/múi giờ, kiểm tra thời lượng và chồng ca, điều kiện hoàn thành onboarding |
| `src/features/responder/onboarding.ts` | Tính tiến độ setup từ xác nhận, thông báo đã đọc và vòng đời incident thử |
| `src/features/responder/model.ts` | Fixture incident/inbox và reducer cập nhật trạng thái |
| `src/features/responder/workspace-types.ts` | Kiểu dữ liệu profile và các mục điều hướng |
| `src/motion.css` | Hiệu ứng chuyển trang, hover/click và reduced motion |

CSS của các component/trang được đặt cạnh file tương ứng. Giao diện dùng Tailwind CSS và icon Lucide React.

## Hành vi của demo

**Incident:** Assigned to me gồm sáu incident của tài khoản hiện tại; All gồm chín incident mẫu trong team. Incident giao cho đồng đội chỉ đọc. ACK chỉ dành cho incident Triggered được giao cho mình; Resolve yêu cầu đã ACK và có lý do. Đọc thông báo không thực hiện ACK.

**AI và Automation:** báo cáo được tạo từ alert mẫu; action yêu cầu approve/reject trước khi mô phỏng thực thi. Incident đã Resolve chặn quyết định/thực thi tiếp. Không gọi model, retrieval, lệnh hệ thống hay hạ tầng bên ngoài.

**Profile:** cho sửa tên, chức danh, phòng ban, số điện thoại, địa điểm, tùy chọn múi giờ và ảnh PNG/JPG/WebP tối đa 2 MB. Email/role không sửa được. Múi giờ là tùy chọn demo; timestamp vẫn theo trình duyệt.

**Dữ liệu:** state giữ nguyên khi chuyển mục trong workspace; rời workspace hoặc tải lại trang sẽ reset. Reset sample data chỉ khôi phục incident/inbox, giữ báo cáo AI, action và profile đang có.

**Xác thực:** `sessionStorage` chỉ lưu dấu hiệu phiên demo, không lưu mật khẩu được nhập. Logout xóa dấu hiệu này. Signup chỉ kiểm tra form; chưa xác minh invitation hoặc tạo tài khoản. Kiểm tra mật khẩu tám ký tự là quy tắc UI tạm thời.

Khi nối backend, cần thay fixture và guard demo bằng API kiểm tra xác thực, quyền đọc, team/service/incident scope, điều kiện chuyển trạng thái và giới hạn automation. Dữ liệu mẫu và kiểm tra phía frontend hiện chỉ phục vụ trình diễn.
