# Tóm tắt session: Xây dựng website thiệp cưới online (Vanilla HTML/CSS/JS) theo iterative development, M0–M10 hoàn thành
Thời gian: 2026-07-30 07:03

## Mục tiêu / bối cảnh ban đầu
- User (letrungkien223@gmail.com) yêu cầu xây dựng website thiệp cưới online cao cấp (Elegant + Luxury + Minimalist + Romantic), triển khai được lên GitHub Pages/Netlify/Vercel.
- Stack bắt buộc: HTML5 + CSS3 + Vanilla JS thuần (không React/Vue), responsive, tối ưu SEO cơ bản và hiệu năng.
- Các section bắt buộc: Welcome (mở thiệp), Giới thiệu, Countdown, Timeline, Thông tin lễ cưới (nhà trai/nhà gái/tiệc cưới + Google Maps), Album ảnh (masonry + lightbox), RSVP, Mừng cưới (QR ngân hàng + sao chép STK), Lời chúc (wishes wall), Footer.
- Tính năng bắt buộc: Dark/Light mode, nhạc nền, hoa rơi, smooth scroll, lazy-load ảnh, thanh tiến trình scroll, back-to-top, loading animation, scroll-reveal.
- Toàn bộ nội dung tuỳ biến (tên, ngày, địa điểm, ảnh, QR, màu sắc) phải gom vào một file config trung tâm cho người không biết code chỉnh sửa được.
- Yêu cầu quy trình: làm theo Work Breakdown Structure (WBS), triển khai từng module một (M0→M10), đợi user xác nhận rồi mới làm tiếp, luôn giữ project chạy được sau mỗi bước.
- Repo: `letrungkien223-design/Thiep-moi-online`, branch làm việc: `claude/wedding-invitation-site-fn88ff`.

## Quyết định quan trọng đã chốt
- Kiến trúc: 1 file `config.js` chứa object toàn cục `WEDDING_CONFIG` (load trước `script.js`), 1 `initApp()` gọi các `init...()` theo từng module — không dùng framework, không build step.
- Theme bằng CSS custom properties + `:root[data-theme="dark"]`, JS đồng bộ màu từ config vào CSS var lúc runtime.
- Scroll reveal dùng IntersectionObserver dùng chung cho toàn site (`.reveal` + `observeReveal()`).
- Ảnh lỗi/thiếu → fallback bằng class `is-fallback` (không hiện icon ảnh vỡ), áp dụng cho gallery, QR mừng cưới.
- Gallery masonry dùng CSS columns (không thư viện), lightbox tự viết.
- RSVP & Lời chúc: có `submitEndpoint`/`fetchEndpoint` (Google Apps Script) tuỳ chọn, fallback `localStorage` nếu chưa cấu hình.
- Nhạc nền: autoplay bằng cách gọi `audio.play()` trong cùng call stack với sự kiện click "Mở Thiệp" (qua custom event `invitation:opened`) để né chính sách autoplay trình duyệt.
- Parallax dùng `background-position-y` (không dùng `transform`) để tránh xung đột với animation Ken Burns (`transform`) đang chạy trên cùng phần tử welcome photo.
- SEO: JSON-LD schema.org/Event chèn động, canonical/og:url/og:image chỉ chèn khi `config.site.url` khác rỗng, favicon SVG tự vẽ, có `robots.txt` + `sitemap.xml` placeholder domain.
- Quy trình test: chạy local `python3 -m http.server`, dùng Playwright headless Chromium kiểm tra từng module trước khi commit.
- Đã hoàn thành đủ 10/10 module theo đúng thứ tự WBS (kể cả M7 vốn bị skip tạm thời rồi quay lại làm sau).

## Thay đổi đã thực hiện
Toàn bộ code nằm ở thư mục gốc repo (`/home/user/Thiep-moi-online`), các file chính:
- `index.html` — cấu trúc single-page đầy đủ mọi section theo thứ tự: Welcome, About, Countdown, Timeline, Events, Gallery, RSVP, Gift (Mừng cưới), Wishes, Footer + lightbox + back-to-top + loading screen + scroll progress bar.
- `config.js` — `WEDDING_CONFIG` đầy đủ: `site, couple, wedding, welcome, about, countdown, timeline, events, gallery, rsvp, gift, wishes, music, footer`.
- `style.css` — design tokens, dark theme override, CSS cho từng section, đánh số comment section 1→20 (kể cả 16b Gift).
- `script.js` — `initApp()` gọi tuần tự toàn bộ `init...()` cho mọi module, gồm cả `initGiftSection()`, `copyTextToClipboard()` (Clipboard API + `execCommand` fallback).
- `README.md` — hướng dẫn chỉnh nội dung, tích hợp Google Sheets/Firebase (mẫu code Apps Script `doPost`/`doGet`), SEO, và hướng dẫn deploy chi tiết GitHub Pages / Netlify / Vercel; mục "Trạng thái hiện tại" đánh dấu M0–M10 đã xong; mục "Đề xuất cải tiến tương lai" còn: tối ưu ảnh WebP/AVIF, PWA (manifest + service worker), i18n đa ngôn ngữ, trang quản trị Lời chúc/RSVP, analytics, test tự động Playwright, rà soát a11y.
- `robots.txt`, `sitemap.xml` (placeholder domain), `assets/icons/favicon.svg` (tự vẽ, không phụ thuộc ngoài), thư mục `assets/{images,icons,music,fonts}/.gitkeep`, `.nojekyll`.

Lịch sử commit (đã push hết lên `origin/claude/wedding-invitation-site-fn88ff`):
- `bda0fd5` M7: Gift/mừng cưới section (bank QR, account number, copy button) — commit mới nhất
- `a405d36` M10: SEO polish + complete documentation (deploy guides, future work)
- `fb3fca0` M9: Footer, background music toggle, falling flowers, subtle parallax
- `ccf4dbb` M8: Wishes wall (submit form + display list, newest first)
- `bef5ce4` M6: RSVP form (attendance, guest count, wishes)
- (trước đó còn M0–M5 cũng đã commit/push, không liệt kê lại chi tiết ở đây)

Lệnh đã chạy để xác nhận trạng thái sạch:
- `git status` → working tree clean, up to date với origin.
- `git log --oneline -5` → xác nhận thứ tự commit như trên.

## Việc còn dang dở / bước tiếp theo
- [ ] Thay ảnh/nhạc/QR thật vào `assets/` (hiện đang dùng placeholder, ví dụ `assets/images/qr-groom.jpg`, `qr-bride.jpg` chưa tồn tại — cố ý, dùng graceful fallback).
- [ ] Điền nội dung thật (tên cô dâu chú rể, ngày cưới, địa điểm, số tài khoản thật...) vào `config.js`.
- [ ] Điền `config.js → site.url` sau khi có domain thật, cập nhật lại `sitemap.xml`.
- [ ] Deploy thử lên GitHub Pages / Netlify / Vercel theo hướng dẫn trong README để lấy link demo.
- [ ] (Tuỳ chọn) Triển khai các mục "cải tiến tương lai": tối ưu ảnh WebP/AVIF, PWA, i18n, trang quản trị, analytics, test tự động, rà soát a11y.
- Chưa có yêu cầu cụ thể nào từ user cho bước tiếp theo — đang chờ chỉ đạo.

## Vấn đề / lỗi đã gặp và cách xử lý
- **M5 — Gallery masonry bị collapse về height 0**: do `loading="lazy"` không có kích thước dự trữ trước khi ảnh load/error. → Fix: thêm `aspect-ratio: auto 3/4; object-fit: cover;` cho `.gallery-item img`.
- **M9 — Xung đột property parallax vs Ken Burns animation**: cả hai định dùng `transform` trên cùng phần tử welcome photo, animation CSS sẽ override style JS. → Fix: chuyển parallax sang dùng `background-position-y` thay vì `transform`.
- **Autoplay nhạc nền bị chặn bởi trình duyệt**: giải quyết bằng cách gọi `audio.play()` trong cùng user-gesture (sự kiện click mở thiệp) qua custom event `invitation:opened`; có nút toggle thủ công làm fallback nếu bị chặn.
- **Duplicate TODO comment sót lại trong `initApp()`** ở M3/M9: phát hiện qua `grep -n "TODO (M"`, dọn bằng Edit trước khi commit.
- Không có lỗi nào do user report trực tiếp — toàn bộ lỗi trên tự phát hiện qua bước test bằng Playwright trước khi commit mỗi module.

## Prompt mở đầu cho session mới
> Tiếp tục project thiệp cưới online tại repo `letrungkien223-design/Thiep-moi-online`, branch `claude/wedding-invitation-site-fn88ff`. Toàn bộ 10 module M0–M10 trong WBS đã hoàn thành, code sạch, đã test bằng Playwright và push lên remote (commit mới nhất `bda0fd5`). Đọc file `.claude/context/CURRENT_SESSION.md` để nắm chi tiết kiến trúc, các quyết định kỹ thuật, và các lỗi đã fix. Việc tiếp theo (nếu user yêu cầu): thay asset thật vào `assets/`, điền nội dung thật vào `config.js`, deploy thử lên GitHub Pages/Netlify/Vercel, hoặc triển khai một trong các mục cải tiến tương lai trong README (WebP/AVIF, PWA, i18n, trang quản trị, analytics, test tự động, a11y).
