// Địa chỉ Backend của chúng ta
// Khi chạy thử (Local), dùng: 'http://localhost:3000'
// Khi deploy (Bước 5), chúng ta sẽ thay đổi địa chỉ này
//const API_URL = 'http://localhost:3000/chat'; 
const API_URL = '/api/chat'
// Lấy các đối tượng HTML
const chatForm = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt-input');
const chatContainer = document.getElementById('chat-container');

// Hàm thêm tin nhắn vào giao diện
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text; // Dùng innerText để tránh lỗi XSS
    chatContainer.appendChild(messageDiv);
    
    // Tự động cuộn xuống tin nhắn mới nhất
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageDiv; // Trả về div tin nhắn để cập nhật sau (nếu cần)
}

// Xử lý sự kiện khi người dùng Gửi
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn trang web tải lại

    const userPrompt = promptInput.value.trim();
    if (!userPrompt) return; // Không gửi nếu rỗng

    // Thêm tin nhắn của người dùng vào giao diện
    addMessage('user', userPrompt);

    // Xóa nội dung đã nhập và thêm tin nhắn "Đang tải..."
    promptInput.value = '';
    const loadingMessage = addMessage('bot loading', 'Gemini đang nghĩ...');

    try {
        // Gọi đến Backend (server.js)
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userPrompt }), // Gửi câu hỏi
        });

        if (!response.ok) {
            throw new Error('Lỗi từ máy chủ: ' + response.statusText);
        }

        const data = await response.json();

        // Cập nhật tin nhắn "Đang tải..." bằng câu trả lời thật
        loadingMessage.innerText = data.answer;
        loadingMessage.classList.remove('loading');

    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        loadingMessage.innerText = 'Lỗi: Không thể kết nối đến Bot. Vui lòng thử lại.';
        loadingMessage.classList.remove('loading');
        loadingMessage.style.color = 'red';
    }
});