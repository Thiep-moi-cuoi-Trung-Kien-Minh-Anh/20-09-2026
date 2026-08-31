# Tóm tắt tiến độ dự án: Thiệp Cưới Online (Trung Kiên & Minh Anh)
Cập nhật lần cuối: 2026-08-31 (rà soát lại toàn bộ tiến độ, không chỉnh code)

## Bối cảnh
- Site tĩnh HTML/CSS/JS, 10/10 module (M0–M10) đã hoàn thành từ trước.
- File `CURRENT_SESSION.md` trước đó (24/08) đã cũ — nhiều việc "dang dở" ghi trong đó
  thực ra đã được xử lý xong qua các PR sau này. File này thay thế bản cũ bằng tiến độ
  thực tế tính đến ngày cập nhật.

## Trạng thái hiện tại trên `main`
- Nhánh làm việc hiện tại: `claude/project-progress-status-ksfrvy` (tạo từ `main`,
  chưa có thay đổi code — chỉ dùng để đọc/báo cáo tiến độ).
- Các PR đã merge vào `main` kể từ lần tổng kết trước: #1, #3, #4, #5, #6.

### Nội dung thật đã điền (`config.js`)
- `couple`: Lê Trung Kiên & Nguyễn Minh Anh (hiển thị ngắn: Trung Kiên & Minh Anh).
- `wedding`: mốc chính Lễ thành hôn — 14:30, Chủ Nhật 20/09/2026.
- `events.items`: **đã rút gọn chỉ còn 2 mốc** (khác với bản ghi cũ là 5 mốc):
  1. Tiệc cưới (nhà gái) — 17:30, Thứ Sáu 18.09.2026, Promes Center, Cầu Giấy, Hà Nội.
  2. Tiệc cưới (nhà trai) — 16:00, Chủ Nhật 20.09.2026, xóm Hưng Long, Võ Nhai, Thái Nguyên.
- `gallery.images`: 5 ảnh cưới thật (`gallery-01..05.jpg`), alt text vẫn là bản Claude đặt tạm,
  **chưa thấy user sửa lại**.
- Welcome screen: lời chào đã được cập nhật lại (PR #4).
- RSVP: đã bỏ trường "lời nhắn" bị trùng với mục Lời chúc (PR #5).
- Nhạc nền: **đã có file thật** `assets/music/background.mp3` (~6.5MB, "Married Life piano cover"),
  `autoplayOnOpen: true` — mục này trước đây ghi "chưa có" nay đã xong.

### Vẫn còn thiếu / chưa xử lý
- [ ] 3 section vẫn đang **ẩn** (`hidden` trong `index.html`), chưa có nội dung thật:
      `#about` (Giới thiệu/câu chuyện tình yêu), `#timeline` (Timeline), `#gift` (Mừng cưới).
- [ ] `config.js -> site.url` vẫn để trống — chưa deploy nên chưa có URL thật.
- [ ] `rsvp.submitEndpoint`, `wishes.submitEndpoint`/`fetchEndpoint` vẫn để trống —
      RSVP và Lời chúc mới lưu tạm vào `localStorage`, chưa thu thập được phản hồi thật
      từ khách mời.
- [ ] Chưa deploy chính thức lên GitHub Pages/Netlify/Vercel.
- [ ] Alt text ảnh Album vẫn là bản Claude đặt tạm, user chưa xác nhận/sửa lại.
- [ ] **Phát hiện khi rà soát lần này**: `rsvp.subtitle` vẫn ghi "xác nhận trước ngày
      01.09.2026" (mốc ăn hỏi cũ) — nhưng mốc ăn hỏi 12/09 đã bị xoá khỏi `events.items`
      từ PR #4. Hạn RSVP này có thể không còn hợp lý so với 2 mốc tiệc cưới hiện tại
      (18/09 và 20/09) — **cần user xác nhận lại hạn RSVP phù hợp**.

## Prompt mở đầu cho session tiếp theo
> Tiếp tục dự án Thiệp Cưới Online (repo `letrungkien223-design/thiep-moi-online`, code mới nhất
> đã có trên `main`). Việc còn dang dở: (1) xác nhận lại hạn RSVP trong `config.js` cho khớp
> 2 mốc tiệc cưới hiện tại (18/09 và 20/09/2026); (2) bổ sung nội dung rồi bỏ `hidden` cho 3
> mục Giới thiệu/Timeline/Mừng cưới nếu user sẵn sàng; (3) cấu hình `submitEndpoint`/`fetchEndpoint`
> cho RSVP và Lời chúc; (4) deploy thật rồi điền `site.url`. Xem file
> `.claude/context/CURRENT_SESSION.md` để biết chi tiết đầy đủ.
