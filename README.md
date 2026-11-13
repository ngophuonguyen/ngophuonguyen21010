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

## Dữ liệu và giới hạn hiện tại

- Tiến độ lưu trong localStorage của trình duyệt (`uyen-days`, `uyen-words`). Bản mã nguồn không chứa tiến độ riêng của Uyên. Khi đổi tên miền, thiết bị hoặc trình duyệt, dữ liệu cũ không tự chuyển sang.
- Phần nghe dùng Web Speech API và giọng đọc tiếng Đức có trên thiết bị; chất lượng và tính khả dụng tùy trình duyệt/hệ điều hành.
- 30 chủ đề là khung lộ trình. Bộ từ vựng và câu hỏi còn nhỏ, có nội dung dùng lại; chưa phải 30 giáo án hoàn chỉnh riêng biệt.
- Nội dung do AI soạn, chưa tích hợp sách/file từ vựng riêng và chưa có đồng bộ tài liệu tự động.
- Không có backend, đăng nhập, dữ liệu đám mây hoặc dịch vụ AI chạy trong ứng dụng.

## Kiểm tra

Bản xuất được kiểm tra bằng `npm run build` (TypeScript và Vite). Đối chiếu mã `src/App.tsx` và `src/styles.css` với phiên bản gốc để giữ nguyên nội dung. Việc triển khai GitHub Pages chỉ chạy khi bạn đưa repository lên GitHub và bật Pages.
