/**
 * ============================================================================
 *  CẤU HÌNH WEBSITE THIỆP CƯỚI — SỬA NỘI DUNG Ở ĐÂY, KHÔNG CẦN ĐỘNG VÀO CODE
 * ============================================================================
 *  File này là nguồn dữ liệu DUY NHẤT cho toàn bộ website: tên cô dâu chú rể,
 *  ngày cưới, màu sắc, ảnh, địa điểm, QR chuyển khoản...
 *  Các mục (giới thiệu, timeline, lễ cưới, album, RSVP, mừng cưới, lời chúc)
 *  sẽ được bổ sung dần vào object bên dưới khi từng module tương ứng
 *  được triển khai (M2 - M9). Ở bước hiện tại (M0) chỉ có các mục nền tảng.
 * ============================================================================
 */

const WEDDING_CONFIG = {
  // --- Thông tin chung cho thẻ <title>, mô tả SEO, chia sẻ mạng xã hội ---
  site: {
    title: "Kiên & Người Thương | Thiệp Cưới Online",
    description: "Trân trọng kính mời bạn đến chung vui trong ngày cưới của chúng tôi.",
  },

  // --- Tên cô dâu / chú rể ---
  couple: {
    groomName: "Chú Rể",
    brideName: "Cô Dâu",
    groomFullName: "Nguyễn Văn A",
    brideFullName: "Trần Thị B",
  },

  // --- Ngày giờ cưới (dùng ISO 8601, có timezone +07:00 cho Việt Nam) ---
  wedding: {
    // Countdown (M2) sẽ đếm ngược tới thời điểm này
    dateISO: "2026-12-12T10:00:00+07:00",
    // Chuỗi hiển thị thân thiện trên Welcome Screen
    displayDate: "12 . 12 . 2026",
  },

  // --- Giao diện: chế độ mặc định + bảng màu (Elegant Luxury Minimalist) ---
  theme: {
    // "light" hoặc "dark" — người dùng vẫn có thể tự đổi bằng nút toggle,
    // lựa chọn của họ sẽ được ghi nhớ (localStorage) và ưu tiên hơn giá trị này
    defaultMode: "light",
    colors: {
      white: "#ffffff",
      ivory: "#fdfbf6",
      champagneGold: "#c9a86a",
      roseGold: "#b76e79",
      sageGreen: "#9caf88",
      textDark: "#3a3630",
      textLight: "#faf7f2",
    },
  },

  // ------------------------------------------------------------------------
  // Các mục dưới đây sẽ được bổ sung ở những module tiếp theo, không xoá:
  // story        -> M2 Giới thiệu
  // timeline      -> M3 Timeline
  // events        -> M4 Thông tin lễ cưới
  // gallery       -> M5 Album ảnh
  // rsvp          -> M6 RSVP
  // gift          -> M7 Mừng cưới
  // wishes        -> M8 Lời chúc
  // music         -> M9 Nhạc nền
  // ------------------------------------------------------------------------
};
