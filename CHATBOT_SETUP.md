# 🤖 ChatBot AI Setup Guide

## Tính Năng
- ✅ Icon nhỏ nổi ở góc phải dưới cùng
- ✅ Hiển thị trên tất cả các trang
- ✅ Chat history được lưu trong phiên
- ✅ Responsive trên mobile
- ✅ Animation mượt mà

## Cách Sử Dụng

### 1. Backend - Đã Setup Sẵn
ChatBot API endpoint: `POST /api/chat`

**Request:**
```json
{
  "message": "Câu hỏi của bạn",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "reply": "Trả lời từ AI"
}
```

### 2. Frontend - Đã Setup Sẵn
- Component: `src/Components/ChatBot/ChatBot.jsx`
- Styling: `src/Components/ChatBot/ChatBot.css`
- Đã thêm vào `App.jsx` (hiển thị trên tất cả trang)

## Tích Hợp OpenAI (Tuỳ Chọn)

### Bước 1: Lấy OpenAI API Key
1. Vào https://platform.openai.com/api-keys
2. Tạo API key mới
3. Copy API key

### Bước 2: Cấu Hình .env
Tạo file `.env` ở thư mục `backend/`:
```
OPENAI_API_KEY=your_api_key_here
```

### Bước 3: Cập Nhật backend/routes/chat.js
Mở file `backend/routes/chat.js` và uncomment phần OpenAI (dòng 35-72):
```javascript
// Cách 1: Sử dụng OpenAI API (uncomment để sử dụng)
const openaiApiKey = process.env.OPENAI_API_KEY;
...
```

### Bước 4: Cài Package
```bash
cd backend
npm install dotenv
```

### Bước 5: Load .env trong server.js
Thêm vào đầu file `server.js`:
```javascript
require('dotenv').config();
```

## Hiện Tại Sử Dụng
- **Mock Responses**: Trả lời dựa trên từ khóa có sẵn
- Có thể dễ dàng nâng cấp lên OpenAI hoặc API khác

## Các Từ Khóa Hỗ Trợ (Mock Mode)
- giúp
- sản phẩm
- đơn hàng
- thanh toán
- ship
- trả hàng

## Cách Chỉnh Sửa Responses
Sửa file `backend/routes/chat.js`, function `getMockAIResponse()`:
```javascript
const responses = {
  từ_khóa: 'Trả lời của bạn',
  ...
};
```

## Tùy Chỉnh Giao Diện
- Đổi màu: Sửa `#ff4d4f` (red) trong `ChatBot.css`
- Thay đổi kích thước: Sửa width/height của `.chatbot-window`
- Vị trí: Sửa `bottom` và `right` trong `.chatbot-container`

## API Khác Có Thể Sử Dụng
- OpenAI ChatGPT ✅
- Google Gemini
- Claude (Anthropic)
- Hugging Face
- Local LLM (Ollama)
