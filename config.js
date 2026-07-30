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

  // --- Thông tin lễ cưới (Lễ nhà trai / Lễ nhà gái / Tiệc cưới) ---
  // Chỉ cần điền "address" đầy đủ, chính xác — bản đồ nhúng và nút "Chỉ
  // đường" sẽ tự động tạo ra từ địa chỉ này (không cần lấy mã nhúng
  // Google Maps thủ công, cũng không cần API key).
  events: {
    title: "Thông tin lễ cưới",
    items: [
      {
        label: "Lễ nhà trai",
        venueName: "Tư gia nhà trai",
        time: "08:00, Thứ Bảy, 12.12.2026",
        address: "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      },
      {
        label: "Lễ nhà gái",
        venueName: "Tư gia nhà gái",
        time: "09:30, Thứ Bảy, 12.12.2026",
        address: "456 Đường Lê Lợi, Quận 3, TP. Hồ Chí Minh",
      },
      {
        label: "Tiệc cưới",
        venueName: "Trung tâm Tiệc cưới Diamond Place",
        time: "18:00, Thứ Bảy, 12.12.2026",
        address: "789 Đường Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh",
      },
    ],
  },

  // --- Album ảnh (Gallery dạng Masonry + Lightbox) ---
  // Thêm/bớt ảnh bằng cách chỉnh mảng "images". Đặt file ảnh vào
  // assets/images/ rồi sửa đường dẫn — ảnh nào chưa có/lỗi sẽ tự hiện
  // khung placeholder thay vì vỡ layout.
  gallery: {
    title: "Album ảnh",
    images: [
      { src: "assets/images/gallery-01.jpg", alt: "Khoảnh khắc 1" },
      { src: "assets/images/gallery-02.jpg", alt: "Khoảnh khắc 2" },
      { src: "assets/images/gallery-03.jpg", alt: "Khoảnh khắc 3" },
      { src: "assets/images/gallery-04.jpg", alt: "Khoảnh khắc 4" },
      { src: "assets/images/gallery-05.jpg", alt: "Khoảnh khắc 5" },
      { src: "assets/images/gallery-06.jpg", alt: "Khoảnh khắc 6" },
    ],
  },

  // --- RSVP (form xác nhận tham dự) ---
  rsvp: {
    title: "Xác nhận tham dự",
    subtitle: "Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi. Vui lòng xác nhận trước ngày 01.12.2026.",
    submitLabel: "Gửi xác nhận",
    attendingYesLabel: "Có, tôi sẽ tham dự",
    attendingNoLabel: "Rất tiếc, tôi không thể tham dự",
    successMessage: "Cảm ơn bạn đã xác nhận! Hẹn gặp bạn trong ngày trọng đại của chúng tôi.",
    errorMessage: "Rất tiếc, đã có lỗi xảy ra khi gửi. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.",

    // ĐỂ KẾT NỐI RSVP VỚI GOOGLE SHEETS (không cần server riêng):
    // 1. Tạo 1 Google Sheet mới, vào menu Extensions > Apps Script.
    // 2. Dán đoạn code mẫu (xem README.md) để nhận JSON và ghi thành 1
    //    dòng mới vào Sheet.
    // 3. Deploy > New deployment > chọn "Web app", Execute as: Me,
    //    Who has access: Anyone, rồi bấm Deploy để lấy URL.
    // 4. Dán URL đó vào "submitEndpoint" bên dưới.
    // Để trống "" nếu chưa cấu hình — form vẫn hoạt động, chỉ lưu tạm
    // dữ liệu vào localStorage của trình duyệt (xem hàm submitRsvp trong script.js).
    submitEndpoint: "",
  },

  // --- Lời chúc (bức tường lời chúc từ khách mời) ---
  wishes: {
    title: "Lời chúc",
    subtitle: "Những lời chúc phúc từ người thân, bạn bè dành cho chúng tôi",
    submitLabel: "Gửi lời chúc",
    successMessage: "Cảm ơn lời chúc của bạn!",
    errorMessage: "Không gửi được lời chúc, vui lòng thử lại.",

    // Lời chúc mẫu hiển thị sẵn — xoá hoặc thay bằng lời chúc thật tuỳ ý,
    // luôn hiển thị bên dưới các lời chúc mới gửi.
    seedWishes: [
      { name: "Gia đình hai bên", message: "Chúc hai con trăm năm hạnh phúc, bách niên giai lão!" },
      { name: "Bạn bè thân thiết", message: "Chúc mừng hạnh phúc! Chúc hai bạn luôn yêu thương nhau như ngày đầu." },
    ],

    // ĐỂ KẾT NỐI VỚI FIREBASE HOẶC GOOGLE SHEETS:
    // - submitEndpoint: URL POST nhận JSON {name, message, submittedAt} để
    //   lưu lời chúc mới (Firebase Realtime Database REST API, hoặc Google
    //   Apps Script Web App — xem hướng dẫn RSVP ở trên, dùng chung cách làm).
    // - fetchEndpoint: URL GET trả về mảng JSON [{name, message, submittedAt}, ...]
    //   để hiển thị lời chúc từ MỌI khách mời (không chỉ trên máy hiện tại).
    // Để trống "" nếu chưa cấu hình — trang sẽ lưu/đọc lời chúc mới từ
    // localStorage của trình duyệt (chỉ hiển thị trên máy của người gửi).
    submitEndpoint: "",
    fetchEndpoint: "",
  },

  // ------------------------------------------------------------------------
  // Các mục dưới đây sẽ được bổ sung ở những module tiếp theo, không xoá:
  // gift          -> M7 Mừng cưới
  // music         -> M9 Nhạc nền
  // ------------------------------------------------------------------------
};
