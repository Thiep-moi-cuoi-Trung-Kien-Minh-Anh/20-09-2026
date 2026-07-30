/**
 * ============================================================================
 *  SCRIPT.JS — Entry point, điều phối các tính năng toàn cục (global infra)
 * ============================================================================
 *  Cấu trúc file (mỗi module M1-M9 sẽ thêm 1 hàm init... mới và gọi nó trong
 *  initApp() ở cuối file, KHÔNG động vào các hàm global infra bên dưới):
 *    1. Đồng bộ nội dung từ config.js
 *    1b. Welcome Screen (M1)
 *    1c. Parallax nhẹ cho ảnh nền Welcome Screen (M9)
 *    2. Loading Screen
 *    3. Dark / Light Mode
 *    4. Scroll Progress Bar
 *    5. Back To Top
 *    5b. Scroll Reveal (dùng chung cho mọi module từ M2 trở đi)
 *    5c. About Section (M2)
 *    5d. Countdown (M2)
 *    5e. Timeline (M3)
 *    5f. Events / Wedding Info (M4)
 *    5g. Gallery + Lightbox (M5)
 *    5h. RSVP Form (M6)
 *    5i. Wishes Wall (M8)
 *    5j. Falling Flowers (M9)
 *    5k. Music Toggle (M9)
 *    5l. Footer (M9)
 *    6. Khởi chạy ứng dụng
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
   1. ĐỒNG BỘ NỘI DUNG TỪ CONFIG.JS
   Áp dụng bảng màu trong WEDDING_CONFIG.theme.colors lên CSS variables,
   để việc đổi màu chỉ cần sửa config.js chứ không cần đụng tới style.css.
---------------------------------------------------------------------------- */
function applyThemeColorsFromConfig() {
  const colors = WEDDING_CONFIG?.theme?.colors;
  if (!colors) return;

  const root = document.documentElement;
  root.style.setProperty("--color-white", colors.white);
  root.style.setProperty("--color-ivory", colors.ivory);
  root.style.setProperty("--color-champagne-gold", colors.champagneGold);
  root.style.setProperty("--color-rose-gold", colors.roseGold);
  root.style.setProperty("--color-sage-green", colors.sageGreen);
  root.style.setProperty("--color-text-dark", colors.textDark);
  root.style.setProperty("--color-text-light", colors.textLight);
}

function syncSiteMetaFromConfig() {
  const { site } = WEDDING_CONFIG;

  if (site?.title) document.title = site.title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (site?.description && descriptionTag) {
    descriptionTag.setAttribute("content", site.description);
  }
}

/* ----------------------------------------------------------------------------
   1b. WELCOME SCREEN (M1)
   - Điền tên/ngày cưới từ config.
   - Kiểm tra ảnh nền (welcome.backgroundImage) tải được hay không trước khi
     áp dụng, để tránh vỡ giao diện khi chưa có ảnh thật.
   - Xử lý nút "Mở Thiệp": phát hiệu ứng mở, sau đó mở khoá cuộn trang.
---------------------------------------------------------------------------- */
function populateWelcomeScreen() {
  const { couple, wedding, welcome } = WEDDING_CONFIG;

  const groomEl = document.getElementById("welcomeGroomName");
  const brideEl = document.getElementById("welcomeBrideName");
  const dateEl = document.getElementById("welcomeDate");
  const eyebrowEl = document.getElementById("welcomeEyebrow");
  const openLabelEl = document.getElementById("welcomeOpenLabel");

  if (groomEl && couple?.groomFullName) groomEl.textContent = couple.groomFullName;
  if (brideEl && couple?.brideFullName) brideEl.textContent = couple.brideFullName;
  if (dateEl && wedding?.displayDate) dateEl.textContent = wedding.displayDate;
  if (eyebrowEl && welcome?.greetingLabel) eyebrowEl.textContent = welcome.greetingLabel;
  if (openLabelEl && welcome?.openButtonLabel) openLabelEl.textContent = welcome.openButtonLabel;
}

function loadWelcomeBackground() {
  const welcomeScreen = document.getElementById("welcome");
  const bgUrl = WEDDING_CONFIG?.welcome?.backgroundImage;
  if (!welcomeScreen) return;

  if (!bgUrl) {
    welcomeScreen.classList.add("no-photo");
    return;
  }

  const testImage = new Image();
  testImage.onload = () => {
    document.documentElement.style.setProperty("--welcome-bg-image", `url("${bgUrl}")`);
    welcomeScreen.classList.add("has-photo");
  };
  testImage.onerror = () => {
    welcomeScreen.classList.add("no-photo");
  };
  testImage.src = bgUrl;
}

function openInvitation(welcomeScreen, openButton) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("invitation-opening");
  welcomeScreen.classList.add("is-opening");
  openButton.classList.add("is-clicked");

  const unlock = () => {
    document.body.classList.remove("invitation-locked", "invitation-opening");
    document.body.classList.add("invitation-opened");
    welcomeScreen.classList.remove("is-opening");
    welcomeScreen.classList.add("is-open");
    // Cho các module khác (vd. M9 Nhạc nền) biết thiệp đã mở, để có thể
    // thử tự phát nhạc ngay trong cùng cử chỉ click của người dùng.
    document.dispatchEvent(new CustomEvent("invitation:opened"));
  };

  if (prefersReducedMotion) {
    unlock();
  } else {
    setTimeout(unlock, 900);
  }
}

function initWelcomeScreen() {
  const welcomeScreen = document.getElementById("welcome");
  const openButton = document.getElementById("openInvitationBtn");
  if (!welcomeScreen || !openButton) return;

  populateWelcomeScreen();
  loadWelcomeBackground();

  openButton.addEventListener("click", () => openInvitation(welcomeScreen, openButton), { once: true });
}

/* ----------------------------------------------------------------------------
   1c. PARALLAX NHẸ (M9)
   Ảnh nền Welcome Screen dịch chuyển nhẹ theo scroll (chậm hơn nội dung),
   dùng background-position-y (không đụng tới "transform" — thuộc tính đó
   đã bị animation kenburns ở trên chiếm giữ, set qua đó sẽ vô tác dụng).
   Bỏ qua hoàn toàn nếu prefers-reduced-motion.
---------------------------------------------------------------------------- */
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const welcomeScreen = document.getElementById("welcome");
  const photoLayer = document.querySelector(".welcome-screen__photo");
  if (!welcomeScreen || !photoLayer) return;

  const MAX_OFFSET_PX = 40;
  const SPEED = 0.15;

  const applyParallax = () => {
    const rect = welcomeScreen.getBoundingClientRect();
    const offset = Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, rect.top * -SPEED));
    photoLayer.style.backgroundPositionY = `calc(50% + ${offset}px)`;
  };

  window.addEventListener("scroll", applyParallax, { passive: true });
  window.addEventListener("resize", applyParallax);
  applyParallax();
}

/* ----------------------------------------------------------------------------
   2. LOADING SCREEN
   Ẩn màn hình loading khi trang đã tải xong toàn bộ tài nguyên (window.load),
   đảm bảo hiển thị tối thiểu 400ms để tránh hiệu ứng chớp nháy khi mạng nhanh.
---------------------------------------------------------------------------- */
function initLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  if (!loadingScreen) return;

  const MIN_DISPLAY_MS = 400;
  const shownAt = performance.now();

  const hideLoadingScreen = () => {
    const elapsed = performance.now() - shownAt;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(() => {
      loadingScreen.classList.add("is-hidden");
    }, remaining);
  };

  if (document.readyState === "complete") {
    hideLoadingScreen();
  } else {
    window.addEventListener("load", hideLoadingScreen, { once: true });
  }
}

/* ----------------------------------------------------------------------------
   3. DARK / LIGHT MODE
   Thứ tự ưu tiên: lựa chọn đã lưu của người dùng (localStorage) >
   config.theme.defaultMode > light.
---------------------------------------------------------------------------- */
const THEME_STORAGE_KEY = "wedding-theme-preference";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return WEDDING_CONFIG?.theme?.defaultMode === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function initThemeToggle() {
  setTheme(getPreferredTheme());

  const toggleButton = document.getElementById("themeToggle");
  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
}

/* ----------------------------------------------------------------------------
   4. SCROLL PROGRESS BAR
---------------------------------------------------------------------------- */
function initScrollProgressBar() {
  const bar = document.getElementById("scrollProgressBar");
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

/* ----------------------------------------------------------------------------
   5. BACK TO TOP
---------------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const SHOW_AFTER_PX = 400;

  const toggleVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > SHOW_AFTER_PX);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ----------------------------------------------------------------------------
   5b. SCROLL REVEAL
   Cơ chế fade-in dùng chung cho mọi section: phần tử có class "reveal" sẽ
   được quan sát bằng IntersectionObserver, thêm class "is-visible" khi cuộn
   vào khung nhìn. Các module sau (M3+) chỉ cần thêm class "reveal" vào HTML;
   nếu nội dung được chèn động bằng JS (vd. Gallery, Lời chúc) thì gọi thêm
   observeReveal(el) cho phần tử mới.
---------------------------------------------------------------------------- */
let scrollRevealObserver;

function observeReveal(element) {
  if (scrollRevealObserver && element) scrollRevealObserver.observe(element);
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  scrollRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => scrollRevealObserver.observe(el));
}

/* ----------------------------------------------------------------------------
   5c. ABOUT SECTION (M2)
   Điền ảnh cưới, lời chào và câu chuyện đôi lứa từ config.about.
   Nếu ảnh chưa được cấu hình hoặc load lỗi, hiện khung placeholder thay vì
   để ảnh vỡ (giữ layout luôn đẹp kể cả khi người dùng chưa thêm ảnh thật).
---------------------------------------------------------------------------- */
function initAboutSection() {
  const { about, couple } = WEDDING_CONFIG;
  const mediaEl = document.querySelector(".about-section__media");
  const photoEl = document.getElementById("aboutPhoto");
  const greetingEl = document.getElementById("aboutGreeting");
  const storyEl = document.getElementById("aboutStory");
  if (!about) return;

  if (greetingEl && about.greeting) greetingEl.textContent = about.greeting;

  if (storyEl && Array.isArray(about.story)) {
    storyEl.innerHTML = "";
    about.story.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      storyEl.appendChild(p);
    });
  }

  if (photoEl && about.photo) {
    photoEl.alt = `Ảnh cưới của ${couple?.groomFullName ?? ""} & ${couple?.brideFullName ?? ""}`;
    photoEl.addEventListener("error", () => mediaEl?.classList.add("is-fallback"), { once: true });
    photoEl.src = about.photo;
  } else {
    mediaEl?.classList.add("is-fallback");
  }
}

/* ----------------------------------------------------------------------------
   5d. COUNTDOWN (M2)
   Đếm ngược thời gian thực tới WEDDING_CONFIG.wedding.dateISO, cập nhật mỗi
   giây. Khi đã tới/qua ngày cưới, ẩn các ô số và hiện thông điệp hoàn tất.
---------------------------------------------------------------------------- */
function updateCountdownDisplay(targetDate, els, completedText) {
  const diffMs = targetDate.getTime() - Date.now();

  if (diffMs <= 0) {
    if (els.intervalId) clearInterval(els.intervalId);
    els.grid.hidden = true;
    els.completed.hidden = false;
    els.completed.textContent = completedText;
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  els.days.textContent = String(days).padStart(2, "0");
  els.hours.textContent = String(hours).padStart(2, "0");
  els.minutes.textContent = String(minutes).padStart(2, "0");
  els.seconds.textContent = String(seconds).padStart(2, "0");
}

function initCountdown() {
  const { wedding, countdown } = WEDDING_CONFIG;
  const grid = document.getElementById("countdown");
  const completedEl = document.getElementById("countdownCompleted");
  const titleEl = document.getElementById("countdownTitle");
  if (!wedding?.dateISO || !grid || !completedEl) return;

  const targetDate = new Date(wedding.dateISO);
  if (Number.isNaN(targetDate.getTime())) return;

  if (titleEl && countdown?.title) titleEl.textContent = countdown.title;

  if (countdown?.labels) {
    document.querySelectorAll("#countdown .countdown__label").forEach((labelEl) => {
      const unit = labelEl.dataset.unit;
      if (countdown.labels[unit]) labelEl.textContent = countdown.labels[unit];
    });
  }

  const els = {
    grid,
    completed: completedEl,
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    minutes: document.getElementById("cdMinutes"),
    seconds: document.getElementById("cdSeconds"),
    intervalId: null,
  };

  const completedText = countdown?.completedText || "Đã đến ngày cưới!";

  updateCountdownDisplay(targetDate, els, completedText);
  els.intervalId = setInterval(() => updateCountdownDisplay(targetDate, els, completedText), 1000);
}

/* ----------------------------------------------------------------------------
   5e. TIMELINE (M3)
   Sinh danh sách mốc thời gian từ config.timeline.milestones. Được gọi
   TRƯỚC initScrollReveal() để các item mới tạo cũng được quan sát reveal.
---------------------------------------------------------------------------- */
function buildTimelineItem(milestone, index) {
  const li = document.createElement("li");
  li.className = "timeline__item reveal";
  li.style.transitionDelay = `${Math.min(index, 4) * 0.12}s`;

  const marker = document.createElement("span");
  marker.className = "timeline__marker";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = milestone.icon || "♥";

  const card = document.createElement("div");
  card.className = "timeline__card";

  const dateEl = document.createElement("p");
  dateEl.className = "timeline__date font-script";
  dateEl.textContent = milestone.date || "";

  const titleEl = document.createElement("h3");
  titleEl.className = "timeline__title";
  titleEl.textContent = milestone.title || "";

  const descEl = document.createElement("p");
  descEl.className = "timeline__desc";
  descEl.textContent = milestone.description || "";

  card.append(dateEl, titleEl, descEl);
  li.append(marker, card);
  return li;
}

function initTimeline() {
  const { timeline } = WEDDING_CONFIG;
  const listEl = document.getElementById("timelineList");
  const titleEl = document.getElementById("timelineTitle");

  if (titleEl && timeline?.title) titleEl.textContent = timeline.title;
  if (!listEl || !Array.isArray(timeline?.milestones) || !timeline.milestones.length) return;

  listEl.innerHTML = "";
  timeline.milestones.forEach((milestone, index) => {
    listEl.appendChild(buildTimelineItem(milestone, index));
  });
}

/* ----------------------------------------------------------------------------
   5f. EVENTS / WEDDING INFO (M4)
   Sinh 3 card Lễ nhà trai / Lễ nhà gái / Tiệc cưới từ config.events.items.
   Bản đồ nhúng và nút "Chỉ đường" được tạo tự động từ trường "address"
   (dùng Google Maps dạng "output=embed" / "maps/dir", không cần API key).
---------------------------------------------------------------------------- */
const EVENT_CARD_ICONS = {
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/></svg>',
  compass:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-6 2 2-6 6-2z"/></svg>',
};

function buildEventMetaRow(iconKey, text) {
  const row = document.createElement("p");
  row.className = "event-card__meta";
  row.insertAdjacentHTML("beforeend", EVENT_CARD_ICONS[iconKey]);
  const span = document.createElement("span");
  span.textContent = text || "";
  row.appendChild(span);
  return row;
}

function buildEventCard(event, index) {
  const article = document.createElement("article");
  article.className = "event-card reveal";
  article.style.transitionDelay = `${Math.min(index, 4) * 0.12}s`;

  const label = document.createElement("span");
  label.className = "event-card__label";
  label.textContent = event.label || "";

  const venue = document.createElement("h3");
  venue.className = "event-card__venue";
  venue.textContent = event.venueName || "";

  article.append(label, venue, buildEventMetaRow("clock", event.time), buildEventMetaRow("pin", event.address));

  if (event.address) {
    const mapWrap = document.createElement("div");
    mapWrap.className = "event-card__map";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.title = `Bản đồ ${event.venueName || event.label || ""}`;
    iframe.setAttribute("allowfullscreen", "");
    mapWrap.appendChild(iframe);
    article.appendChild(mapWrap);

    const directionBtn = document.createElement("a");
    directionBtn.className = "event-card__direction-btn";
    directionBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}`;
    directionBtn.target = "_blank";
    directionBtn.rel = "noopener noreferrer";
    directionBtn.insertAdjacentHTML("afterbegin", EVENT_CARD_ICONS.compass);
    const directionLabel = document.createElement("span");
    directionLabel.textContent = "Chỉ đường";
    directionBtn.appendChild(directionLabel);
    article.appendChild(directionBtn);
  }

  return article;
}

function initEventsSection() {
  const { events } = WEDDING_CONFIG;
  const gridEl = document.getElementById("eventsGrid");
  const titleEl = document.getElementById("eventsTitle");

  if (titleEl && events?.title) titleEl.textContent = events.title;
  if (!gridEl || !Array.isArray(events?.items) || !events.items.length) return;

  gridEl.innerHTML = "";
  events.items.forEach((event, index) => gridEl.appendChild(buildEventCard(event, index)));
}

/* ----------------------------------------------------------------------------
   5g. GALLERY + LIGHTBOX (M5)
   Sinh lưới ảnh masonry (CSS columns, xem style.css) từ config.gallery.images,
   lazy-load + fallback khi ảnh lỗi/chưa có, và một lightbox dùng chung để
   xem phóng to + điều hướng ảnh trước/sau (click, phím mũi tên, Esc).
---------------------------------------------------------------------------- */
let galleryPhotos = [];
let currentLightboxIndex = 0;

function buildGalleryItem(photo, index) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "gallery-item reveal";
  item.style.transitionDelay = `${Math.min(index % 6, 5) * 0.08}s`;
  item.setAttribute("aria-label", `Xem ảnh ${index + 1}`);

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = photo.alt || `Ảnh cưới ${index + 1}`;
  img.addEventListener("error", () => item.classList.add("is-fallback"), { once: true });
  img.src = photo.src;

  const fallback = document.createElement("span");
  fallback.className = "gallery-item__fallback";
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = "❀";

  item.append(img, fallback);
  item.addEventListener("click", () => openLightbox(index));
  return item;
}

function renderLightboxImage() {
  const photo = galleryPhotos[currentLightboxIndex];
  if (!photo) return;
  const imgEl = document.getElementById("lightboxImage");
  const counterEl = document.getElementById("lightboxCounter");
  imgEl.src = photo.src;
  imgEl.alt = photo.alt || `Ảnh cưới ${currentLightboxIndex + 1}`;
  counterEl.textContent = `${currentLightboxIndex + 1} / ${galleryPhotos.length}`;
}

function openLightbox(index) {
  currentLightboxIndex = index;
  renderLightboxImage();
  const lightbox = document.getElementById("lightbox");
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  document.getElementById("lightboxClose")?.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

function showPrevPhoto() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  renderLightboxImage();
}

function showNextPhoto() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryPhotos.length;
  renderLightboxImage();
}

function initLightboxControls() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev")?.addEventListener("click", showPrevPhoto);
  document.getElementById("lightboxNext")?.addEventListener("click", showNextPhoto);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPrevPhoto();
    if (event.key === "ArrowRight") showNextPhoto();
  });
}

function initGallery() {
  const { gallery } = WEDDING_CONFIG;
  const gridEl = document.getElementById("galleryGrid");
  const titleEl = document.getElementById("galleryTitle");

  if (titleEl && gallery?.title) titleEl.textContent = gallery.title;
  if (!gridEl || !Array.isArray(gallery?.images) || !gallery.images.length) return;

  galleryPhotos = gallery.images;
  gridEl.innerHTML = "";
  galleryPhotos.forEach((photo, index) => gridEl.appendChild(buildGalleryItem(photo, index)));

  initLightboxControls();
}

/* ----------------------------------------------------------------------------
   5h. RSVP FORM (M6)
   Validate bằng constraint validation gốc của trình duyệt (required + report
   Validity). Khi submit hợp lệ: nếu config.rsvp.submitEndpoint đã được cấu
   hình (vd. Google Apps Script Web App gắn với Google Sheets), gửi JSON tới
   đó; nếu chưa, lưu tạm vào localStorage để không mất dữ liệu trong lúc dev.
---------------------------------------------------------------------------- */
const RSVP_LOCAL_STORAGE_KEY = "wedding-rsvp-local";

function showRsvpStatus(statusEl, message, type) {
  statusEl.textContent = message;
  statusEl.hidden = false;
  statusEl.classList.remove("rsvp-form__status--success", "rsvp-form__status--error");
  statusEl.classList.add(`rsvp-form__status--${type}`);
}

async function submitRsvp(payload, endpoint) {
  if (endpoint) {
    // Google Apps Script Web App không trả CORS header nên phải dùng
    // mode "no-cors" — trình duyệt sẽ không đọc được nội dung response,
    // ta chỉ có thể biết request đã gửi đi thành công (không bị lỗi mạng).
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return;
  }

  // Chưa cấu hình rsvp.submitEndpoint: lưu tạm vào localStorage (chỉ để
  // xem lại lúc phát triển/demo), xem hướng dẫn kết nối Google Sheets
  // trong comment của config.rsvp.
  const stored = JSON.parse(localStorage.getItem(RSVP_LOCAL_STORAGE_KEY) || "[]");
  stored.push(payload);
  localStorage.setItem(RSVP_LOCAL_STORAGE_KEY, JSON.stringify(stored));
}

function initRsvpForm() {
  const { rsvp } = WEDDING_CONFIG;
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  const titleEl = document.getElementById("rsvpTitle");
  const subtitleEl = document.getElementById("rsvpSubtitle");
  const submitLabelEl = document.getElementById("rsvpSubmitLabel");
  const attendingYesOption = document.getElementById("rsvpAttendingYesOption");
  const attendingNoOption = document.getElementById("rsvpAttendingNoOption");
  const attendingSelect = document.getElementById("rsvpAttending");
  const guestsField = document.getElementById("rsvpGuests");
  const guestsWrapper = document.getElementById("rsvpGuestsField");
  const submitBtn = document.getElementById("rsvpSubmitBtn");
  const statusEl = document.getElementById("rsvpStatus");

  if (titleEl && rsvp?.title) titleEl.textContent = rsvp.title;
  if (subtitleEl && rsvp?.subtitle) subtitleEl.textContent = rsvp.subtitle;
  if (submitLabelEl && rsvp?.submitLabel) submitLabelEl.textContent = rsvp.submitLabel;
  if (attendingYesOption && rsvp?.attendingYesLabel) attendingYesOption.textContent = rsvp.attendingYesLabel;
  if (attendingNoOption && rsvp?.attendingNoLabel) attendingNoOption.textContent = rsvp.attendingNoLabel;

  attendingSelect?.addEventListener("change", () => {
    const notAttending = attendingSelect.value === "no";
    if (guestsField) {
      if (notAttending) {
        guestsField.dataset.prevValue = guestsField.value || "1";
        guestsField.value = "0";
      } else {
        guestsField.value = guestsField.dataset.prevValue || "1";
      }
      guestsField.disabled = notAttending;
    }
    guestsWrapper?.classList.toggle("is-disabled", notAttending);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      attending: formData.get("attending"),
      guests: Number(formData.get("guests")) || 0,
      message: (formData.get("message") || "").toString().trim(),
      submittedAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    statusEl.hidden = true;

    try {
      await submitRsvp(payload, rsvp?.submitEndpoint);
      form.reset();
      if (guestsField) guestsField.value = "1";
      guestsWrapper?.classList.remove("is-disabled");
      showRsvpStatus(statusEl, rsvp?.successMessage || "Cảm ơn bạn đã xác nhận!", "success");
    } catch (error) {
      showRsvpStatus(statusEl, rsvp?.errorMessage || "Có lỗi xảy ra, vui lòng thử lại sau.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
    }
  });
}

/* ----------------------------------------------------------------------------
   5i. WISHES WALL (M8)
   Bức tường lời chúc: seedWishes (config) luôn hiển thị, cộng thêm lời chúc
   đã gửi trên máy này (localStorage) hoặc từ xa (wishes.fetchEndpoint nếu
   đã cấu hình Firebase/Google Sheets). Gửi lời chúc mới dùng cùng kiểu
   "submitEndpoint" như RSVP (POST JSON, mode "no-cors").
---------------------------------------------------------------------------- */
const WISHES_LOCAL_STORAGE_KEY = "wedding-wishes-local";

function loadLocalWishes() {
  try {
    return JSON.parse(localStorage.getItem(WISHES_LOCAL_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function saveLocalWishes(list) {
  localStorage.setItem(WISHES_LOCAL_STORAGE_KEY, JSON.stringify(list));
}

function buildWishCard(wish, index) {
  const card = document.createElement("article");
  card.className = "wish-card reveal";
  card.style.transitionDelay = `${Math.min(index % 6, 5) * 0.06}s`;

  const nameEl = document.createElement("p");
  nameEl.className = "wish-card__name";
  nameEl.textContent = wish.name || "Ẩn danh";

  const messageEl = document.createElement("p");
  messageEl.className = "wish-card__message";
  messageEl.textContent = wish.message || "";

  card.append(nameEl, messageEl);
  return card;
}

function renderWishes(listEl, wishes) {
  listEl.innerHTML = "";
  wishes.forEach((wish, index) => {
    const card = buildWishCard(wish, index);
    listEl.appendChild(card);
    observeReveal(card);
  });
}

async function fetchRemoteWishes(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function showWishStatus(statusEl, message, type) {
  statusEl.textContent = message;
  statusEl.hidden = false;
  statusEl.classList.remove("wish-form__status--success", "wish-form__status--error");
  statusEl.classList.add(`wish-form__status--${type}`);
}

async function initWishesWall() {
  const { wishes } = WEDDING_CONFIG;
  const form = document.getElementById("wishForm");
  const listEl = document.getElementById("wishesList");
  if (!form || !listEl) return;

  const titleEl = document.getElementById("wishesTitle");
  const subtitleEl = document.getElementById("wishesSubtitle");
  const submitLabelEl = document.getElementById("wishSubmitLabel");
  const statusEl = document.getElementById("wishStatus");
  const submitBtn = document.getElementById("wishSubmitBtn");

  if (titleEl && wishes?.title) titleEl.textContent = wishes.title;
  if (subtitleEl && wishes?.subtitle) subtitleEl.textContent = wishes.subtitle;
  if (submitLabelEl && wishes?.submitLabel) submitLabelEl.textContent = wishes.submitLabel;

  const seedWishes = Array.isArray(wishes?.seedWishes) ? wishes.seedWishes : [];
  let allWishes = [...loadLocalWishes(), ...seedWishes];

  if (wishes?.fetchEndpoint) {
    try {
      const remoteWishes = await fetchRemoteWishes(wishes.fetchEndpoint);
      allWishes = [...remoteWishes, ...seedWishes];
    } catch (error) {
      // Không tải được lời chúc từ xa: vẫn hiển thị lời chúc mẫu + local
    }
  }

  renderWishes(listEl, allWishes);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const newWish = {
      name: (formData.get("name") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
      submittedAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    statusEl.hidden = true;

    try {
      if (wishes?.submitEndpoint) {
        await fetch(wishes.submitEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWish),
        });
      } else {
        const localWishes = loadLocalWishes();
        localWishes.unshift(newWish);
        saveLocalWishes(localWishes);
      }

      const card = buildWishCard(newWish, 0);
      listEl.prepend(card);
      observeReveal(card);

      form.reset();
      showWishStatus(statusEl, wishes?.successMessage || "Cảm ơn lời chúc của bạn!", "success");
    } catch (error) {
      showWishStatus(statusEl, wishes?.errorMessage || "Không gửi được lời chúc, vui lòng thử lại.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
    }
  });
}

/* ----------------------------------------------------------------------------
   5j. FALLING FLOWERS (M9)
   Hiệu ứng hoa rơi trang trí nhẹ: sinh vài phần tử span rơi từ trên xuống
   bằng CSS animation (2 animation riêng cho rơi + đung đưa, không đụng
   property nhau nên chạy song song không xung đột). Bỏ qua hoàn toàn nếu
   prefers-reduced-motion, hoặc nếu effects.fallingFlowers.enabled === false.
---------------------------------------------------------------------------- */
const DEFAULT_FLOWER_GLYPHS = ["❀", "✿", "🌸"];

function initFallingFlowers() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const container = document.getElementById("fallingFlowers");
  if (!container) return;

  const effectConfig = WEDDING_CONFIG?.effects?.fallingFlowers;
  if (effectConfig?.enabled === false) return;

  const count = effectConfig?.count ?? 14;
  const glyphs = Array.isArray(effectConfig?.glyphs) && effectConfig.glyphs.length
    ? effectConfig.glyphs
    : DEFAULT_FLOWER_GLYPHS;

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-flowers__petal";
    petal.setAttribute("aria-hidden", "true");
    petal.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

    const leftPercent = Math.random() * 100;
    const fallDuration = 10 + Math.random() * 10;
    const swayDuration = fallDuration * 0.6;
    const delay = Math.random() * -20;
    const size = 12 + Math.random() * 10;
    const drift = Math.round(Math.random() * 60 - 30);

    petal.style.left = `${leftPercent}%`;
    petal.style.fontSize = `${size}px`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${delay}s, ${delay}s`;
    petal.style.setProperty("--drift", `${drift}px`);

    container.appendChild(petal);
  }
}

/* ----------------------------------------------------------------------------
   5k. MUSIC TOGGLE (M9)
   Nút bật/tắt nhạc nền. Thử tự phát ngay khi nhận sự kiện "invitation:opened"
   (bắn ra từ openInvitation() ở mục 1b) — vì đó vẫn nằm trong cùng một cử
   chỉ click của người dùng nên trình duyệt thường cho phép phát có âm
   thanh; nếu bị chặn, khách vẫn có thể tự bấm nút để bật thủ công.
---------------------------------------------------------------------------- */
function initMusicPlayer() {
  const { music } = WEDDING_CONFIG;
  const audio = document.getElementById("bgMusic");
  const button = document.getElementById("musicToggle");
  if (!audio || !button) return;

  if (!music?.src) {
    button.hidden = true;
    return;
  }

  audio.src = music.src;
  audio.volume = typeof music.volume === "number" ? music.volume : 0.5;

  const setPlayingState = (isPlaying) => {
    button.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute("aria-label", isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền");
  };

  const tryPlay = () => audio.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));

  button.addEventListener("click", () => {
    if (audio.paused) {
      tryPlay();
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  if (music.autoplayOnOpen !== false) {
    document.addEventListener("invitation:opened", tryPlay, { once: true });
  }
}

/* ----------------------------------------------------------------------------
   5l. FOOTER (M9)
   Tên CD-CR và năm tổ chức lấy lại từ config.couple / config.wedding.dateISO
   (không khai báo trùng dữ liệu ở config.footer).
---------------------------------------------------------------------------- */
function initFooter() {
  const { footer, couple, wedding } = WEDDING_CONFIG;

  const thanksEl = document.getElementById("footerThanks");
  const namesEl = document.getElementById("footerNames");
  const yearEl = document.getElementById("footerYear");

  if (thanksEl && footer?.thanksMessage) thanksEl.textContent = footer.thanksMessage;
  if (namesEl && couple) namesEl.textContent = `${couple.groomName} & ${couple.brideName}`;

  if (yearEl && wedding?.dateISO) {
    const year = new Date(wedding.dateISO).getFullYear();
    if (!Number.isNaN(year)) yearEl.textContent = `© ${year}`;
  }
}

/* ----------------------------------------------------------------------------
   6. KHỞI CHẠY ỨNG DỤNG
   Các module tiếp theo (M1-M9) sẽ thêm lời gọi init tương ứng vào đây.
---------------------------------------------------------------------------- */
function initApp() {
  applyThemeColorsFromConfig();
  syncSiteMetaFromConfig();
  initLoadingScreen();
  initThemeToggle();
  initScrollProgressBar();
  initBackToTop();
  initWelcomeScreen();
  initParallax();
  initAboutSection();
  initCountdown();
  initTimeline();
  initEventsSection();
  initGallery();
  initRsvpForm();
  initWishesWall();
  initFallingFlowers();
  initMusicPlayer();
  initFooter();
  initScrollReveal();

  // TODO (M7): initGiftSection();
}

document.addEventListener("DOMContentLoaded", initApp);
