Dưới đây là hướng dẫn toàn diện & chi tiết về QuillJS – từ cách cài đặt, cấu hình, API, modules, Delta, đến tuỳ chỉnh mở rộng — sao cho bạn chỉ cần đọc là có thể áp dụng được trong dự án của bạn.

Mình sẽ chia thành các phần rõ ràng:

Cài đặt & cấu hình cơ bản

Khởi tạo editor & themes

Modules — các module có sẵn và cấu hình

Delta — định dạng nội dung & thay đổi

API Reference — các phương thức quan trọng

Sự kiện & quản lý thay đổi

Tuỳ chỉnh & mở rộng (custom module, đăng ký format, theme)

Ví dụ thực tế + lưu Quill vào form (textarea)

Tài liệu tham khảo

1. Cài đặt & cấu hình cơ bản
1.1 Cài đặt qua CDN (quickest)

Quill cung cấp bản full build thông qua CDN (jsDelivr), bao gồm thư viện cốt lõi + module + theme phổ biến, để bạn dùng ngay mà không cần build tool.
Quill
+2
Quill
+2

Ví dụ:

<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>


Bạn cũng có thể dùng bản “core build” nếu muốn chỉ import phần lõi, không kèm module & theme mặc định.
Quill

1.2 Cài đặt qua npm / bundler

Nếu bạn dùng bundler như Webpack, Vite, Next.js:

npm install quill


Trong code:

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
// nếu bạn cần, import các module / formats riêng lẻ


Lưu ý: khi import "quill", bạn đang lấy bản đầy đủ. Nếu muốn bản core, có thể import từ quill/core.
Quill
+1

1.3 Cấu hình khởi tạo — Configuration

Một số tuỳ chọn cấu hình cơ bản khi khởi tạo:

theme: "snow" hoặc "bubble" hoặc không dùng theme (core)
Quill
+1

modules: một object để bật module (toolbar, history, syntax, clipboard, keyboard…)
Quill
+1

placeholder: văn bản hiển thị khi editor trống
Quill

readOnly / disable để khóa editor không cho người dùng chỉnh sửa
Quill

bounds, scrollingContainer… các tuỳ chọn nâng cao để giới hạn vùng hiển thị popup, cuộn nội dung, v.v.
Quill

Ví dụ cấu hình:

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [ ['bold', 'italic'], ['link', 'image'] ],
    history: { delay: 1000, userOnly: true }
  },
  placeholder: 'Viết gì đó...',
  readOnly: false
});

2. Khởi tạo editor & themes
2.1 Vùng chứa nội dung

Trong HTML bạn cần phần tử DOM để Quill sử dụng:

<div id="editor">
  <p>Đây là nội dung khởi tạo</p>
</div>


Nếu bạn bỏ trống <div id="editor"></div>, editor sẽ bắt đầu với nội dung trống.
Quill
+1

2.2 Khởi tạo Quill
const quill = new Quill('#editor', {
  theme: 'snow',  // hoặc 'bubble'
});


Phần tử #editor là selector DOM. Theme mặc định là 'snow'.
Quill
+2
Quill
+2

Nếu dùng theme Bubble:

<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.bubble.css" rel="stylesheet">


và:

const quill = new Quill('#editor', {
  theme: 'bubble'
});


Theme Bubble sẽ không hiển thị toolbar cố định, thay vào đó hiển thị popup khi người dùng bôi chọn text.
Quill

2.3 Kết hợp toolbar

Quill hỗ trợ gắn toolbar (thanh công cụ) theo nhiều cách:

array shorthand: trình bày toolbar bằng mảng tên format. Quill tự sinh phần UI.
Quill
+1

container selector / element: bạn tự xây HTML toolbar, rồi truyền selector hoặc DOM node vào cấu hình toolbar.container
Quill
+1

handlers: bạn có thể override hành vi của các nút toolbar nhất định qua handlers trong toolbar module
Quill

Ví dụ:

<div id="toolbar">
  <button class="ql-bold"></button>
  <button class="ql-italic"></button>
  <button class="ql-link"></button>
</div>
<div id="editor"></div>

const quill = new Quill('#editor', {
  modules: {
    toolbar: {
      container: '#toolbar',
      handlers: {
        link: function(value) {
          if (value) {
            const url = prompt('Nhập URL:');
            this.quill.format('link', url);
          } else {
            this.quill.format('link', false);
          }
        }
      }
    }
  },
  theme: 'snow'
});


Hoặc dùng shorthand:

const quill = new Quill('#editor', {
  modules: {
    toolbar: ['bold', 'italic', 'underline', 'link', { header: [1,2,3, false] }]
  },
  theme: 'snow'
});


Trong mảng toolbar, bạn có thể nhóm các nút theo mảng con để tạo nhóm (Quill sẽ wrap chúng trong <span class="ql-formats">)
Quill
.

3. Modules — mô-đun tích hợp & cấu hình

Quill xây dựng theo kiến trúc module — các tính năng như history (undo/redo), clipboard (copy-paste), keyboard (phím tắt), syntax (highlight mã), toolbar… được đóng gói dưới dạng module để bật/tắt hoặc tuỳ chỉnh.
Quill
+2
Quill
+2

Một số module quan trọng:

3.1 Module History (undo / redo)

Chịu trách nhiệm quản lý stack undo/redo.
Quill

Các tuỳ chọn:

Tuỳ chọn	Mặc định	Ý nghĩa
delay	1000	Khoảng thời gian (ms) trong đó các thay đổi được gộp làm 1 hành động
maxStack	100	Số lượng tối đa các trạng thái ghi lại
userOnly	false	Nếu true, chỉ các thao tác do người dùng mới được undo/redo (không tính các thao tác qua API)

Ví dụ cấu hình:

modules: {
  history: {
    delay: 2000,
    userOnly: true,
    maxStack: 200
  }
}


API module history:

quill.history.clear() — xóa toàn bộ stack undo/redo.
Quill

3.2 Module Clipboard & Keyboard

Clipboard: quản lý việc copy-paste, xử lý nội dung HTML được dán vào editor. Bạn có thể override bằng cách register module mới cho modules/clipboard nếu bạn muốn xử lý dán theo cách riêng.
Quill
+1

Keyboard: xử lý phím tắt (Ctrl+B, Ctrl+I, Enter, Backspace…) theo cấu hình. Bạn có thể tuỳ chỉnh hoặc disable một số shortcut nếu muốn.
Quill
+1

3.3 Module Syntax

Dùng để highlight mã (code) nếu bạn muốn editor hỗ trợ viết code. Bạn cần tích hợp highlight library như Prism hoặc Highlight.js.
Quill

Khi bật syntax: true, Quill sẽ parse nội dung code block và gắn class tương ứng để CSS external highlight.
Quill

3.4 Các module khác & tuỳ chỉnh mở rộng

Bạn có thể:

Đăng ký module mới hoặc thay module mặc
