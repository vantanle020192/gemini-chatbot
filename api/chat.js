// Nạp các thư viện cần thiết
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Tải API Key từ file .env
dotenv.config();

// --- Cấu hình ---
const app = express();
const port = process.env.PORT || 3000; // Cổng chạy máy chủ

// Khởi tạo Google AI với API Key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// --- Middleware (Phần mềm trung gian) ---
app.use(cors()); // Cho phép Frontend gọi API này
app.use(express.json()); // Cho phép server đọc JSON từ request

// --- Định nghĩa API Endpoint ---
// Đây là "địa chỉ" mà Frontend sẽ gọi đến
app.post('/chat', async (req, res) => {
    try {
        // Lấy câu hỏi (prompt) từ người dùng gửi lên
        const userPrompt = req.body.prompt;

        if (!userPrompt) {
            return res.status(400).json({ error: "Vui lòng nhập câu hỏi." });
        }

        // Gọi Gemini
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const botAnswer = response.text();

        // Trả câu trả lời về cho Frontend
        res.json({ answer: botAnswer });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Có lỗi xảy ra, không thể kết nối đến Gemini." });
    }
});

// Khởi động máy chủ
app.listen(port, () => {
    console.log(`Backend đang chạy tại http://localhost:${port}`);
});