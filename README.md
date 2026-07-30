# Thiệp Cưới Online

Website thiệp cưới online, tĩnh (static), sẵn sàng deploy lên GitHub Pages, Netlify hoặc Vercel.

## Trạng thái hiện tại

Dự án đang được xây dựng theo từng module (xem WBS trong lịch sử trao đổi). Hiện tại đã hoàn thành:

- **M0 — Scaffold & Global Infrastructure**: khung HTML, hệ thống màu/font, Dark/Light Mode, Loading Screen, Scroll Progress Bar, Back To Top.

Các module tiếp theo (Welcome Screen, Countdown, Timeline, Lễ cưới, Album, RSVP, Mừng cưới, Lời chúc, Footer...) sẽ được bổ sung dần.

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

## Hướng dẫn deploy

Hướng dẫn deploy chi tiết lên GitHub Pages / Netlify / Vercel sẽ được bổ sung khi
website hoàn thiện các module nội dung (dự kiến ở module cuối M10).
