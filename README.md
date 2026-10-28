Môn học: Điện toán đám mây

## Thông tin sinh viên
- Họ và tên: Trần Anh Đoàn
- MSSV: 234818
- Lớp: DH23TIN05

## Danh sách link nộp bài
- Link_GitHub: https://github.com/anhdoan66/234818_TranAnhDoan
- Link_Docker_Backend: https://hub.docker.com/r/anhdoan66/backend
- Link_Docker_Frontend: https://hub.docker.com/r/anhdoan66/frontend
- Link_Render_App: https://frontend-234818.onrender.com
- Link_Render_API: https://backend-latest-pken.onrender.com

## Công nghệ sử dụng
- Frontend: React (Vite) + Nginx
- Backend: Node.js, Express.js
- CSDL: MongoDB Atlas
- Đóng gói & Triển khai: Docker, Docker Compose, Render.com

## Cấu trúc thư mục
- `backend/`: Mã nguồn Express API, kết nối MongoDB và Dockerfile
- `frontend/`: Mã nguồn React, cấu hình Nginx và Dockerfile
- `docker-compose.yml`: File chạy đồng thời frontend và backend local

## Hướng dẫn chạy bằng Docker Compose
1. Clone dự án:
git clone https://github.com/anhdoan66/234818_TranAnhDoan.git
cd 234818_TranAnhDoan

2. Khởi chạy hệ thống:
docker compose up -d --build

3. Truy cập:
- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/health