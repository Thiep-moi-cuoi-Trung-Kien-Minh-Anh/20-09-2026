# Thiệp Cưới Online

Website thiệp cưới online, tĩnh (static — HTML/CSS/JS thuần, không framework, không bước build),
sẵn sàng deploy lên GitHub Pages, Netlify hoặc Vercel để chia sẻ bằng một đường link.

## Trạng thái hiện tại

Dự án được xây dựng theo từng module (iterative). Đã hoàn thành:

- **M0 — Scaffold & Global Infrastructure**: khung HTML, hệ thống màu/font, Dark/Light Mode, Loading Screen, Scroll Progress Bar, Back To Top.
- **M1 — Welcome Screen**: bìa thiệp toàn màn hình + hiệu ứng mở thiệp.
- **M2 — Giới thiệu + Countdown**: ảnh cưới, lời chào, câu chuyện, đếm ngược thời gian thực.
- **M3 — Timeline**: các mốc Gặp nhau / Yêu nhau / Đính hôn / Ngày cưới.
- **M4 — Thông tin lễ cưới**: Lễ nhà trai / Lễ nhà gái / Tiệc cưới, kèm bản đồ + chỉ đường.
- **M5 — Album ảnh**: album cuộn dạng slideshow ảnh lớn + dải thumbnail điều hướng.
- **M6 — RSVP**: form xác nhận tham dự, sẵn sàng kết nối Google Sheets.
- **M7 — Mừng cưới**: QR ngân hàng, số tài khoản, chủ tài khoản, nút sao chép.
- **M8 — Lời chúc**: form gửi lời chúc + bức tường hiển thị, sẵn sàng kết nối Firebase/Google Sheets.
- **M9 — Footer + Nhạc nền + Hoa rơi + Parallax nhẹ**: hoàn thiện các hiệu ứng toàn cục.
- **M10 — SEO cơ bản + tài liệu hướng dẫn** (file này).

Toàn bộ 10 module trong kế hoạch ban đầu đã hoàn thành. Xem mục "Đề xuất cải tiến
trong tương lai" bên dưới cho các hướng phát triển tiếp theo.

## Cấu trúc thư mục

```
/
├── index.html       # Khung trang, toàn bộ section nội dung
├── style.css        # Toàn bộ CSS (chia section rõ ràng bằng comment, có đánh số)
├── script.js        # Toàn bộ JS (chia section rõ ràng bằng comment, có đánh số)
├── config.js        # ⭐ SỬA NỘI DUNG Ở ĐÂY — xem bảng bên dưới
├── robots.txt        # Cho phép crawler index toàn bộ trang
├── sitemap.xml        # Cần sửa URL sau khi deploy (xem phần SEO)
├── .nojekyll          # Để GitHub Pages không xử lý Jekyll
└── assets/
    ├── images/        # Ảnh cưới, ảnh cover, album, QR chuyển khoản...
    ├── icons/          # Icon SVG (đã có sẵn favicon.svg)
    ├── music/          # Nhạc nền (mp3)
    └── fonts/          # Font tự host (nếu không dùng Google Fonts CDN)
```

## Cách chỉnh sửa nội dung

Mở file **`config.js`** — toàn bộ nội dung có thể tuỳ biến nằm trong object `WEDDING_CONFIG`,
chia theo từng mục rõ ràng. **Không cần sửa** `index.html`, `style.css` hay `script.js` cho các
thay đổi nội dung thông thường.

| Mục trong `config.js` | Điều khiển                                                             |
| ---------------------- | ------------------------------------------------------------------------ |
| `site`                  | Tiêu đề trang, mô tả SEO, URL sau khi deploy, ảnh chia sẻ mạng xã hội       |
| `couple`                | Tên ngắn gọn + tên đầy đủ của cô dâu, chú rể                                |
| `wedding`               | Ngày giờ cưới (dùng cho Countdown) + chuỗi ngày hiển thị                    |
| `theme`                 | Chế độ sáng/tối mặc định + bảng màu thương hiệu                             |
| `welcome`               | Ảnh nền, lời mời, nhãn nút "Mở Thiệp"                                       |
| `about`                 | Ảnh cưới, lời chào, câu chuyện tình yêu (mảng đoạn văn)                     |
| `countdown`             | Tiêu đề + nhãn Ngày/Giờ/Phút/Giây + thông điệp khi đã tới ngày cưới          |
| `timeline`              | Danh sách mốc thời gian (Gặp nhau, Yêu nhau, Đính hôn, Cưới...)              |
| `events`                | Danh sách địa điểm (Lễ nhà trai/gái, Tiệc cưới) — chỉ cần địa chỉ text thường |
| `gallery`                | Danh sách ảnh trong Album                                                   |
| `rsvp`                   | Nội dung form RSVP + endpoint kết nối Google Sheets (tuỳ chọn)               |
| `gift`                   | Danh sách tài khoản ngân hàng (ảnh QR, số TK, chủ TK) cho mục Mừng cưới      |
| `wishes`                 | Lời chúc mẫu + endpoint kết nối Firebase/Google Sheets (tuỳ chọn)            |
| `music`                  | Đường dẫn nhạc nền, âm lượng, có tự phát khi mở thiệp hay không              |
| `footer`                 | Câu cảm ơn ở footer (tên + năm tự lấy lại từ `couple`/`wedding`)             |

## Chạy thử ở máy local

Không cần cài đặt gì — chỉ cần mở trực tiếp file `index.html` bằng trình duyệt,
hoặc dùng một static server đơn giản (khuyến khích, để `loading="lazy"` và các
request khác hoạt động đúng như môi trường thật):

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

## Kết nối RSVP / Lời chúc với Google Sheets hoặc Firebase (tuỳ chọn)

Mặc định, khi chưa cấu hình, form RSVP và Lời chúc chỉ lưu tạm vào `localStorage`
của trình duyệt — đủ để demo nhưng **không** thu thập được phản hồi thật từ khách mời
(dữ liệu chỉ nằm trên máy của người gửi). Để nhận phản hồi vào một nơi dùng chung:

### Cách 1 — Google Sheets (khuyến khích, miễn phí, không cần server riêng)

1. Tạo một Google Sheet mới.
2. Vào menu **Extensions > Apps Script**, xoá code mẫu và dán đoạn sau (dùng chung
   được cho cả RSVP và Lời chúc, chỉ khác cột dữ liệu ghi ra):

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     // RSVP có các trường: name, phone, attending, guests, message
     // Lời chúc có các trường: name, message
     sheet.appendRow([
       data.submittedAt,
       data.name,
       data.phone || "",
       data.attending || "",
       data.guests ?? "",
       data.message || "",
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
   wishes: {
     // ...
     submitEndpoint: "https://script.google.com/macros/s/XXXXXXXX/exec", // có thể dùng chung 1 URL với sheet khác nhau, hoặc deploy 2 Apps Script riêng
   },
   ```

   Để bức tường Lời chúc hiển thị được lời chúc từ **mọi khách mời** (không chỉ máy của
   người gửi), triển khai thêm một hàm `doGet(e)` trả về mảng JSON các lời chúc từ Sheet,
   rồi dán URL đó vào `wishes.fetchEndpoint`.

### Cách 2 — Firebase (Realtime Database / Firestore)

Dùng REST API của Firebase làm `submitEndpoint`/`fetchEndpoint` tương tự Cách 1 — chỉ
cần endpoint nhận `POST` với JSON body và (tuỳ chọn) endpoint `GET` trả về mảng JSON.
Xem tài liệu [Firebase REST API](https://firebase.google.com/docs/database/rest/start).

## SEO cơ bản

- **Meta tags** (title, description, Open Graph, Twitter Card) đã có sẵn giá trị mặc định
  trong `index.html` và được `script.js` đồng bộ lại theo `config.js` mỗi lần tải trang.
- **Sau khi deploy**, điền URL thật vào `config.js -> site.url` để tự động có canonical URL
  + `og:url` + `og:image` dạng URL tuyệt đối (cần cho việc chia sẻ link lên Messenger/Zalo/Facebook
  hiển thị đúng ảnh xem trước).
- Cập nhật **`sitemap.xml`**: thay `https://ten-mien-cua-ban.com/` bằng URL thật (giống `site.url`).
- **`robots.txt`** đã cho phép index toàn trang, không cần chỉnh sửa.
- Trang tự chèn **dữ liệu có cấu trúc JSON-LD** (`schema.org/Event`) lấy từ `config.js`, giúp
  công cụ tìm kiếm hiểu đây là một sự kiện đám cưới.
- **Favicon** dạng SVG có sẵn tại `assets/icons/favicon.svg`, có thể thay bằng file khác.

## Hướng dẫn deploy

### GitHub Pages

1. Đảm bảo code đã ở trên GitHub (nhánh bất kỳ, ví dụ `main`).
2. Vào repo trên GitHub → **Settings > Pages**.
3. Ở mục "Build and deployment", chọn **Source: Deploy from a branch**.
4. Chọn nhánh chứa code (vd. `main`) và thư mục **`/ (root)`**, bấm **Save**.
5. Đợi khoảng 1-2 phút, GitHub sẽ cấp một URL dạng
   `https://<username>.github.io/<ten-repo>/`. File `.nojekyll` đã có sẵn trong repo để
   GitHub Pages phục vụ đúng các file bắt đầu bằng `_` (nếu có) mà không qua xử lý Jekyll.
6. (Tuỳ chọn) Gắn domain riêng ở mục "Custom domain" trong cùng trang Settings.

### Netlify

**Cách 1 — Kéo thả (nhanh nhất, không cần tài khoản Git):**

1. Vào [app.netlify.com/drop](https://app.netlify.com/drop).
2. Kéo cả thư mục project (chứa `index.html`) vào trang.
3. Netlify tự deploy và cấp ngay một URL dạng `https://ten-ngau-nhien.netlify.app`.

**Cách 2 — Kết nối repo Git (khuyến khích, tự deploy lại mỗi khi push):**

1. Đăng nhập [Netlify](https://app.netlify.com), bấm **Add new site > Import an existing project**.
2. Chọn nhà cung cấp Git (GitHub) và chọn repo này.
3. Ở phần cấu hình build: **Build command** để trống, **Publish directory** đặt là `.` (thư mục gốc).
4. Bấm **Deploy site**.

### Vercel

1. Đăng nhập [Vercel](https://vercel.com), bấm **Add New... > Project**.
2. Import repo này từ GitHub.
3. Ở bước cấu hình: **Framework Preset** chọn **Other**, **Build Command** để trống,
   **Output Directory** để trống hoặc `.` (Vercel tự phục vụ file tĩnh ở thư mục gốc).
4. Bấm **Deploy**.

## Đề xuất cải tiến trong tương lai

- **Tối ưu ảnh**: nén/convert ảnh thật sang WebP/AVIF trước khi thêm vào `assets/images/`
  để tải nhanh hơn nữa trên mạng di động.
- **PWA**: thêm `manifest.json` + service worker để khách có thể "Thêm vào màn hình chính"
  và xem lại thiệp khi mất mạng.
- **Đa ngôn ngữ**: tách chuỗi văn bản khỏi `config.js` thành file theo từng ngôn ngữ (vi/en)
  cho khách mời quốc tế.
- **Trang quản trị Lời chúc/RSVP**: một trang riêng (hoặc Google Sheet có sẵn) để xem/duyệt
  phản hồi mà không cần mở trực tiếp Google Sheets.
- **Phân tích truy cập**: gắn Google Analytics/Plausible để biết bao nhiêu khách đã xem thiệp.
- **Kiểm thử tự động**: thêm vài Playwright test cơ bản (mở thiệp, submit RSVP, chuyển ảnh
  trong album) để tránh hồi quy khi chỉnh sửa thêm.
- **Rà soát khả năng tiếp cận (a11y)**: kiểm tra bằng trình đọc màn hình thật, bổ sung
  `aria-live`/focus-trap cho các overlay (nếu có) nếu cần.
