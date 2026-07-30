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

  // --- Welcome Screen (bìa thiệp) ---
  welcome: {
    // Đường dẫn ảnh nền toàn màn hình. Đặt file ảnh vào assets/images/ rồi
    // sửa đường dẫn dưới đây. Để trống "" nếu chưa có ảnh — trang sẽ tự
    // dùng nền gradient thay thế, vẫn đẹp và không bị vỡ layout.
    backgroundImage: "assets/images/welcome-bg.jpg",
    greetingLabel: "Trân trọng kính mời",
    openButtonLabel: "Mở Thiệp",
  },

  // --- Giới thiệu (ảnh cưới + lời chào + câu chuyện đôi lứa) ---
  about: {
    // Đặt ảnh vào assets/images/ rồi sửa đường dẫn. Để trống "" nếu chưa có
    // ảnh — mục này sẽ tự hiện khung placeholder thay vì bị vỡ layout.
    photo: "assets/images/about.jpg",
    greeting: "Yêu thương gửi đến những người bạn quý mến,",
    // Mỗi phần tử trong mảng là một đoạn văn (paragraph) riêng biệt
    story: [
      "Chúng tôi gặp nhau trong một ngày rất bình thường, nhưng đó lại là khởi đầu của một hành trình đặc biệt.",
      "Sau tất cả những tháng ngày cùng nhau cười, cùng nhau trưởng thành, chúng tôi quyết định nắm tay nhau đi hết quãng đường còn lại.",
    ],
  },

  // --- Đếm ngược ngày cưới (thời gian thực) ---
  countdown: {
    title: "Ngày trọng đại sẽ đến trong",
    labels: {
      days: "Ngày",
      hours: "Giờ",
      minutes: "Phút",
      seconds: "Giây",
    },
    completedText: "Chúng tôi đã chính thức nên duyên vợ chồng! Cảm ơn vì đã luôn đồng hành cùng chúng tôi.",
  },

  // --- Timeline (các mốc trong hành trình tình yêu) ---
  // Thêm/bớt/sửa thứ tự mốc bằng cách chỉnh mảng milestones bên dưới,
  // "icon" là 1 emoji hiển thị trong vòng tròn đánh dấu, có thể để trống.
  timeline: {
    title: "Chuyện tình của chúng tôi",
    milestones: [
      {
        date: "Mùa thu, 2019",
        title: "Gặp nhau",
        description: "Một buổi chiều tình cờ, chúng tôi gặp nhau lần đầu và có những ấn tượng khó quên.",
        icon: "✨",
      },
      {
        date: "Mùa xuân, 2021",
        title: "Yêu nhau",
        description: "Sau thời gian tìm hiểu, chúng tôi chính thức trở thành một đôi và cùng nhau viết tiếp câu chuyện.",
        icon: "💕",
      },
      {
        date: "Mùa hè, 2025",
        title: "Đính hôn",
        description: "Lời hứa gắn bó trăm năm được trao nhau trong sự chúc phúc của gia đình hai bên.",
        icon: "💍",
      },
      {
        date: "12.12.2026",
        title: "Ngày cưới",
        description: "Chúng tôi chính thức về chung một nhà, bắt đầu hành trình mới với thật nhiều yêu thương.",
        icon: "💒",
      },
    ],
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
