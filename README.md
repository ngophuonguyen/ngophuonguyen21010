# Deutsch mit Uyên

Trang học tiếng Đức B1–B2 dành cho Uyên: lộ trình 30 ngày, thẻ từ Đức–Việt, giải thích ngữ pháp, luyện nghe và trắc nghiệm.

## Mã nguồn này là gì?

Bản xuất từ trang https://deutsch-mit-uyen.encouragingmodel.chatgpt.site, chuẩn bị ngày 13/11/2026.
Giữ nguyên mã giao diện, dữ liệu bài học và cách lưu tiến độ của phiên bản hiện tại trong `src/App.tsx` và `src/styles.css`. Phần khởi chạy được chuyển từ nền tảng Sites/Vinext sang React + Vite để chạy độc lập và triển khai lên GitHub Pages. Không cần tài khoản ChatGPT hoặc API key để chạy bản này.

## Chạy trên máy tính

Cài Node.js 22.13 trở lên (khuyến nghị Node.js 22 LTS), mở terminal trong thư mục có `package.json`:

```bash
npm ci
npm run dev
```

Mở địa chỉ do terminal hiển thị. Đừng mở trực tiếp `index.html` bằng cách nhấp đúp; mã TSX cần được biên dịch.

Tạo và xem bản triển khai:

```bash
npm run build
npm run preview
```

Thư mục `dist/` là kết quả build; được tạo lại bằng lệnh trên.

## Đưa lên GitHub

1. Giải nén ZIP. Tạo repository mới trên GitHub, ví dụ `deutsch-mit-uyen`.
2. Đưa toàn bộ nội dung của thư mục này vào thư mục gốc repository: `package.json`, `src/`, `public/`, `index.html`, các tệp cấu hình và cả `.github/`. Không tải nguyên ZIP lên thay cho các tệp nguồn. Có thể dùng GitHub Desktop để thêm repository và Publish repository; hoặc dùng Git như dưới đây.
3. Nếu dùng Git, tại thư mục đã giải nén, thay URL ví dụ bằng URL repository của bạn:

```bash
git init
git add .
git commit -m "Add Deutsch mit Uyen"
git branch -M main
git remote add origin https://github.com/TEN_TAI_KHOAN/deutsch-mit-uyen.git
git push -u origin main
```

4. Chỉ lưu mã nguồn thì dừng ở đây. Nếu muốn có trang web trực tuyến, vào repository → **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. Vào **Actions → Deploy GitHub Pages → Run workflow**. Những lần push tiếp theo lên nhánh `main` sẽ tự build và triển khai. Sau khi thành công, lấy đường dẫn web trong **Settings → Pages**.

Nguồn hướng dẫn GitHub: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

`base: './'` đã được thiết lập để hỗ trợ đường dẫn repository trên GitHub Pages. Workflow trong `.github/workflows/deploy.yml` build bằng Node.js 22 và dùng `package-lock.json` để cố định các phụ thuộc.

## Chỉnh sửa nội dung

- `src/App.tsx`: giao diện React, danh sách 30 chủ đề (`topics`), từ vựng (`words`), câu hỏi (`questions`), tương tác và giọng đọc.
- `src/styles.css`: màu sắc, kiểu chữ, bố cục và hiển thị điện thoại.
- `src/main.tsx`: điểm khởi chạy React.
- `index.html`: tiêu đề, mô tả, ngôn ngữ trang.
- `public/favicon.svg`: biểu tượng trang.
- `.github/workflows/deploy.yml`: tự động triển khai GitHub Pages.

## Tài khoản, tiến độ và bài nghe (bản nâng cấp)

- Thư viện nghe: hai video Easy German nhúng theo yêu cầu, nguồn Goethe B1/B2 và tài nguyên giáo trình Sicher! của Hueber, kèm các bước tự luyện và đánh dấu hoàn thành.
- Chế độ khách lưu trên thiết bị, tiếp nhận tiến độ cũ của bản đầu tiên.
- Mã đăng nhập Google qua Supabase, lưu ngày học, từ vựng, bài nghe và lịch sử kiểm tra theo từng tài khoản; hàng đợi gửi lại khi có mạng.
- **Đăng nhập và dữ liệu trực tuyến chưa được kích hoạt** nếu chưa có dự án Supabase và cấu hình Google. Xem [SETUP_SUPABASE.md](SETUP_SUPABASE.md) để triển khai thật.
- Schema và chính sách dữ liệu riêng từng người học: `supabase/schema.sql`.
- Không dùng khóa secret/service_role trong trình duyệt. Publishable key phải đi cùng RLS.
- Danh mục nguồn: `src/ListeningLibrary.tsx`. Không tải lại video, sao chép sách hoặc transcript. Các bước luyện do ứng dụng soạn; đối chiếu đáp án chính thức tại nguồn.
- Chưa nhập sách riêng của Uyên. Cần PDF/tên sách, phiên bản và chương để bổ sung.
- 30 chủ đề vẫn là khung lộ trình với bộ ngữ pháp/từ vựng nhỏ, chưa phải 30 giáo án hoàn chỉnh.
- Bài Anna giữ lại dưới nhãn giọng tổng hợp do AI soạn, tách khỏi thư viện nguồn thực tế.

## Kiểm tra

`npm test`: kiểm tra lọc dữ liệu tiến độ lỗi, chuyển dữ liệu cũ, bỏ đánh dấu và bản ghi kết quả kiểm tra.
`npm run build`: kiểm tra TypeScript và build Vite.
Chưa kiểm thử đăng nhập Google, RLS hoặc đồng bộ với backend thật trước khi cấu hình Supabase.
