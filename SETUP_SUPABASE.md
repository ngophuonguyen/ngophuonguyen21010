# Kích hoạt đăng nhập Google và lưu tiến độ

Hiện trạng: mã tích hợp và schema đã có. Đăng nhập thật và dữ liệu trực tuyến chỉ hoạt động sau khi hoàn thành cấu hình bên dưới. Khi chưa cấu hình, website chạy chế độ khách.

## 1. Tạo dự án Supabase

Đăng nhập tại https://supabase.com/dashboard, tạo dự án cho website. Chọn khu vực phù hợp. Xem điều kiện/hạn mức gói đang chọn trước khi xác nhận. Không cần đưa mật khẩu database vào website.

## 2. Khởi tạo bảng dữ liệu

Mở SQL Editor trong dự án, chạy nội dung `supabase/schema.sql` trong repository.
Bảng `learning_items` lưu từng mục riêng theo user_id: ngày học, từ đã nhớ, bài nghe đã hoàn tất và từng lần kiểm tra.
RLS bắt buộc người dùng đăng nhập; chỉ được đọc và sửa dữ liệu có user_id trùng auth.uid(). Khách không được truy cập bảng.

Cần kiểm tra sau khi thiết lập: tạo hai tài khoản thử, lưu tiến độ ở tài khoản A và xác nhận B không đọc/sửa được bản ghi của A. Schema chưa được thực thi hoặc kiểm thử với database thật trong bản nâng cấp ban đầu.

## 3. Cấu hình Google OAuth

Trong Google Cloud Console, tạo hoặc chọn dự án, cấu hình màn hình đồng ý OAuth và tạo OAuth Client ID loại Web application.

- Authorized JavaScript origins: tên miền GitHub Pages của bạn, không bao gồm đường dẫn repository.
- Authorized redirect URIs: dùng chính xác callback URL mà mục Google provider của Supabase hiển thị (thường có dạng `https://PROJECT.supabase.co/auth/v1/callback`).
- Nếu ứng dụng Google đang ở chế độ Testing, thêm email của người học vào test users. Muốn cho người khác sử dụng cần cấu hình phạm vi phát hành phù hợp.

Trong Supabase → Authentication → Sign In / Providers → Google, bật provider và lưu Client ID, Client Secret từ Google. Client Secret chỉ nằm trong Supabase, không đưa lên GitHub hoặc code trình duyệt.

Trong Supabase → Authentication → URL Configuration:

- Site URL: đường dẫn website GitHub Pages thực tế, gồm đường dẫn repository và dấu `/` cuối.
- Redirect URLs: thêm chính xác đường dẫn tương tự. Có thể thêm `http://localhost:5173/` để thử trên máy.

Website dùng PKCE, quay về đường dẫn trang hiện tại và không đòi một route `/callback` trên GitHub Pages.

## 4. Nối cấu hình vào GitHub Pages

Trong Supabase, lấy Project URL và **publishable key** của dự án.
Trong GitHub repository → Settings → Secrets and variables → Actions → Variables, tạo hai Repository variables:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Giá trị lần lượt là Project URL và publishable key. Đây là cấu hình dành cho trình duyệt; quyền đọc/ghi do RLS kiểm soát. Không dùng secret key hoặc service_role key ở đây.

Trong tab Actions, chạy lại workflow **Deploy GitHub Pages**. Các biến được đưa vào lúc build; chỉ đổi biến mà không build lại sẽ không cập nhật website.

Chạy thử trên máy: sao chép `.env.example` thành `.env.local`, điền hai giá trị, chạy `npm ci` và `npm run dev`.

## 5. Kiểm tra hoạt động

1. Đăng nhập bằng Google. Nếu Google chặn, kiểm tra test users, callback URL và provider đã bật.
2. Hoàn thành một bài kiểm tra, đánh dấu một từ và một bài nghe.
3. Chờ thông báo “Đã lưu vào tài khoản”, tải lại trang và kiểm tra.
4. Mở thiết bị khác, đăng nhập cùng tài khoản và đối chiếu.
5. Đổi tài khoản: tiến độ phải tách biệt. Tiến độ khách chỉ được nhập khi người học chủ động bấm “Nhập tiến độ khách trên máy này”.
6. Tắt mạng khi đang học: thay đổi giữ trong bộ nhớ trình duyệt, chờ gửi lại khi có mạng. Không xóa dữ liệu trình duyệt trước khi đồng bộ hoàn tất. Nếu đăng nhập lại lúc ngoại tuyến và chưa tải được dữ liệu, ứng dụng chặn sửa cho tới khi tải lại thành công.

Dữ liệu được tải từ server khi mở lại/đăng nhập. Các thiết bị không cập nhật trực tiếp theo thời gian thực. Nếu hai thiết bị sửa cùng một mục, lần ghi được server nhận sau sẽ thắng; các mục khác nhau được lưu độc lập. Ứng dụng không lưu thời lượng học thực tế, điểm nghe hoặc tự chấm bài nghe.

## Tài liệu chính thức

- Google OAuth: https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- JavaScript Auth: https://supabase.com/docs/reference/javascript/auth-signinwithoauth
