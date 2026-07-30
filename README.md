# Thiệp Cưới Online

Website thiệp cưới online, tĩnh (static), sẵn sàng deploy lên GitHub Pages, Netlify hoặc Vercel.

## Trạng thái hiện tại

Dự án đang được xây dựng theo từng module (xem WBS trong lịch sử trao đổi). Hiện tại đã hoàn thành:

- **M0 — Scaffold & Global Infrastructure**: khung HTML, hệ thống màu/font, Dark/Light Mode, Loading Screen, Scroll Progress Bar, Back To Top.
- **M1 — Welcome Screen**: bìa thiệp toàn màn hình + hiệu ứng mở thiệp.
- **M2 — Giới thiệu + Countdown**: ảnh cưới, lời chào, câu chuyện, đếm ngược thời gian thực.
- **M3 — Timeline**: các mốc Gặp nhau / Yêu nhau / Đính hôn / Ngày cưới.
- **M4 — Thông tin lễ cưới**: Lễ nhà trai / Lễ nhà gái / Tiệc cưới, kèm bản đồ + chỉ đường.
- **M5 — Album ảnh**: Masonry gallery + Lightbox.
- **M6 — RSVP**: form xác nhận tham dự, sẵn sàng kết nối Google Sheets.

Các module tiếp theo (Mừng cưới, Lời chúc, Footer...) sẽ được bổ sung dần.

## Cấu trúc thư mục

```
/
├── index.html      # Khung trang, các section nội dung
├── style.css       # Toàn bộ CSS (chia section rõ ràng bằng comment)
├── script.js       # Toàn bộ JS (chia section rõ ràng bằng comment)
├── config.js       # ⭐ SỬA NỘI DUNG Ở ĐÂY: tên, ngày cưới, màu sắc...
└── assets/
    ├── images/      # Ảnh cưới, ảnh cover, album, QR chuyển khoản...
    ├── icons/       # Icon SVG
    ├── music/        # Nhạc nền (mp3)
    └── fonts/        # Font tự host (nếu không dùng Google Fonts CDN)
```

## Cách chỉnh sửa nội dung

Mở file **`config.js`** — mọi thông tin có thể tuỳ biến (tên cô dâu chú rể, ngày cưới,
màu sắc chủ đạo...) đều nằm trong object `WEDDING_CONFIG`. Không cần sửa `index.html`,
`style.css` hay `script.js`.

## Chạy thử ở máy local

Không cần cài đặt gì — chỉ cần mở trực tiếp file `index.html` bằng trình duyệt,
hoặc dùng một static server đơn giản, ví dụ:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

## Kết nối RSVP với Google Sheets (tuỳ chọn)

Mặc định, khi chưa cấu hình, form RSVP chỉ lưu tạm phản hồi vào `localStorage`
của trình duyệt (xem hàm `submitRsvp` trong `script.js`) — đủ để demo nhưng
**không** thu thập được phản hồi thật từ khách mời. Để nhận phản hồi vào một
Google Sheet dùng chung:

1. Tạo một Google Sheet mới.
2. Vào menu **Extensions > Apps Script**, xoá code mẫu và dán đoạn sau:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.submittedAt,
       data.name,
       data.phone,
       data.attending,
       data.guests,
       data.message,
     ]);
     return ContentService.createTextOutput("OK");
   }
   ```

3. Bấm **Deploy > New deployment**, chọn loại **Web app**, thiết lập
   "Execute as": **Me**, "Who has access": **Anyone**, rồi bấm **Deploy**.
4. Sao chép URL Web App được cấp, dán vào `config.js`:

   ```javascript
   rsvp: {
     // ...
     submitEndpoint: "https://script.google.com/macros/s/XXXXXXXX/exec",
   },
   ```

Từ lúc đó, mỗi lượt RSVP hợp lệ sẽ được ghi thành một dòng mới trong Sheet.

## Hướng dẫn deploy

Hướng dẫn deploy chi tiết lên GitHub Pages / Netlify / Vercel sẽ được bổ sung khi
website hoàn thiện các module nội dung (dự kiến ở module cuối M10).
