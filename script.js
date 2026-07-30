/**
 * ============================================================================
 *  SCRIPT.JS — Entry point, điều phối các tính năng toàn cục (global infra)
 * ============================================================================
 *  Cấu trúc file (mỗi module M1-M9 sẽ thêm 1 hàm init... mới và gọi nó trong
 *  initApp() ở cuối file, KHÔNG động vào các hàm global infra bên dưới):
 *    1. Đồng bộ nội dung từ config.js
 *    1b. Welcome Screen (M1)
 *    2. Loading Screen
 *    3. Dark / Light Mode
 *    4. Scroll Progress Bar
 *    5. Back To Top
 *    5b. Scroll Reveal (dùng chung cho mọi module từ M2 trở đi)
 *    5c. About Section (M2)
 *    5d. Countdown (M2)
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
  initAboutSection();
  initCountdown();
  initScrollReveal();

  // TODO (M3): initTimeline();
  // TODO (M4): initEventsSection();
  // TODO (M5): initGallery();
  // TODO (M6): initRsvpForm();
  // TODO (M7): initGiftSection();
  // TODO (M8): initWishesWall();
  // TODO (M9): initFooter(); initMusicPlayer(); initFallingFlowers();
}

document.addEventListener("DOMContentLoaded", initApp);
