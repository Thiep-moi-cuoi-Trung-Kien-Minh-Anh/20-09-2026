/**
 * ============================================================================
 *  APPS SCRIPT — Web App dùng chung cho RSVP + Lời chúc (Google Sheets)
 * ============================================================================
 *  Cách dùng: xem README.md mục "Kết nối RSVP / Lời chúc với Google Sheets".
 *  Tóm tắt:
 *    1. Tạo 1 Google Sheet, đặt tên 2 tab đúng CHÍNH XÁC (phân biệt hoa/thường):
 *       - "RSVP"     — dòng đầu tiên (header) gợi ý: Thời gian | Họ tên | SĐT | Tham dự | Số khách
 *       - "LoiChuc"  — dòng đầu tiên (header) gợi ý: Thời gian | Họ tên | Lời chúc
 *    2. Vào Extensions > Apps Script, xoá code mẫu, dán toàn bộ file này vào.
 *    3. Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 *    4. Copy URL Web App, dán vào config.js: rsvp.submitEndpoint, wishes.submitEndpoint
 *       VÀ wishes.fetchEndpoint (dùng chung 1 URL cho cả 3 giá trị).
 * ============================================================================
 */

var RSVP_SHEET_NAME = "RSVP";
var WISHES_SHEET_NAME = "LoiChuc";

function getSheet_(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    throw new Error(
      'Không tìm thấy tab "' + name + '" — kiểm tra lại tên tab trong Google Sheet (phân biệt hoa/thường).'
    );
  }
  return sheet;
}

// Nhận dữ liệu RSVP hoặc Lời chúc (POST JSON, phân biệt qua trường "type"),
// ghi thành 1 dòng mới vào đúng tab tương ứng.
function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.type === "wish") {
    getSheet_(WISHES_SHEET_NAME).appendRow([data.submittedAt, data.name, data.message]);
  } else {
    getSheet_(RSVP_SHEET_NAME).appendRow([
      data.submittedAt,
      data.name,
      data.phone || "",
      data.attending || "",
      data.guests != null ? data.guests : "",
    ]);
  }

  return ContentService.createTextOutput("OK");
}

// Trả về mảng JSON các lời chúc (mới nhất lên đầu) để hiển thị công khai cho
// mọi khách truy cập trang. CHỈ đọc tab Lời chúc — không bao giờ trả RSVP
// (dữ liệu riêng tư của khách, chỉ chủ thiệp xem trực tiếp trong Sheet).
function doGet(e) {
  var rows = getSheet_(WISHES_SHEET_NAME).getDataRange().getValues();

  var wishes = rows
    .slice(1) // bỏ dòng tiêu đề (header)
    .filter(function (row) {
      return row[1]; // bỏ các dòng trống (chưa có tên)
    })
    .map(function (row) {
      return {
        submittedAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
        name: row[1],
        message: row[2] || "",
      };
    })
    .reverse();

  return ContentService.createTextOutput(JSON.stringify(wishes)).setMimeType(ContentService.MimeType.JSON);
}
