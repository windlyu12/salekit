const PAGE_TITLES = [
  "Bìa",
  "Mục lục",
  "Lời giới thiệu",
  "Thông tin pháp lý",
  "Dịch vụ",
  "Năng lực sản xuất",
  "Quy trình thiết kế",
  "Quy trình thi công",
  "Q&A",
  "Cover Các Phong cách thiết kế",
  "Phong cách 1",
  "Phong cách 2",
  "Phong cách 3",
  "Cover Các dự án tiêu biểu",
  "Case Study 1 – Căn hộ 1PN (Ảnh toàn cảnh + 2–3 ảnh chi tiết)",
  "Case Study 2 – Căn hộ 2PN (Ảnh toàn cảnh + 2–3 ảnh chi tiết)",
  "Case Study 3 – Căn hộ 3PN (Ảnh toàn cảnh + 2–3 ảnh chi tiết)",
  "Vật liệu & đối tác (Logo bar + Ảnh gỗ + Ảnh phụ kiện/bản lề/ray)",
  "Bảo hành & chất lượng",
  "Bìa cuối (CTA: QR Zalo OA + Hotline + Website)"
];

const STORAGE_KEY = "salekit-pages-v1";
const editorInput = document.getElementById("editorInput");
const pageList = document.getElementById("pageList");
const previewFrame = document.getElementById("previewFrame");
const resetButton = document.getElementById("resetPage");
const exportAll = document.getElementById("exportAll");
const exportCurrent = document.getElementById("exportCurrent");
const editorTitle = document.getElementById("editorTitle");

let pages = [];
let activeIndex = 0;
let debounceTimer;

function getBlankTemplate(index) {
  const pageNumber = String(index + 1).padStart(2, "0");
  const title = PAGE_TITLES[index];
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Trang ${pageNumber} — ${title}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Montserrat", system-ui, sans-serif;
      color: #141414;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 15mm;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: rgba(20, 20, 20, 0.5);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="page-title">Trang ${pageNumber} — ${title}</div>
  </div>
  <!-- Your content here -->
</body>
</html>`;
}

function loadPages() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === PAGE_TITLES.length) {
      return parsed;
    }
  }
  return PAGE_TITLES.map((_, index) => ({
    title: PAGE_TITLES[index],
    html: getBlankTemplate(index)
  }));
}

function savePages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

function renderPageList() {
  pageList.innerHTML = "";
  pages.forEach((page, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `page-item${index === activeIndex ? " is-active" : ""}`;
    button.innerHTML = `<strong>${index + 1}.</strong> ${page.title} <span>• A4</span>`;
    button.addEventListener("click", () => switchPage(index));
    pageList.appendChild(button);
  });
}

function switchPage(index) {
  activeIndex = index;
  renderPageList();
  editorTitle.textContent = `HTML — Trang ${index + 1}`;
  editorInput.value = pages[index].html;
  updatePreview(pages[index].html);
}

function wrapFragment(html) {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SaleKit Preview</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Montserrat", system-ui, sans-serif;
      color: #141414;
      background: #ffffff;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

function normalizeHtml(html) {
  const trimmed = html.trim();
  const hasHtmlTag = /<html[\s>]/i.test(trimmed);
  const hasDoctype = /<!doctype html>/i.test(trimmed);
  if (hasHtmlTag || hasDoctype) {
    return trimmed;
  }
  return wrapFragment(trimmed);
}

function updatePreview(html) {
  previewFrame.srcdoc = normalizeHtml(html);
}

function handleInput() {
  const value = editorInput.value;
  pages[activeIndex].html = value;
  updatePreview(value);
  savePages();
}

function debounceInput() {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(handleInput, 300);
}

function resetCurrentPage() {
  pages[activeIndex].html = getBlankTemplate(activeIndex);
  editorInput.value = pages[activeIndex].html;
  updatePreview(pages[activeIndex].html);
  savePages();
}

function init() {
  pages = loadPages();
  renderPageList();
  switchPage(0);

  editorInput.addEventListener("input", debounceInput);
  resetButton.addEventListener("click", resetCurrentPage);

  exportAll.addEventListener("click", () => {
    alert("Export PDF (All Pages) - placeholder ở bước 1.");
  });

  exportCurrent.addEventListener("click", () => {
    alert("Export Current Page - placeholder ở bước 1.");
  });
}

init();
