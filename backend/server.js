const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware xử lý dữ liệu và CORS
app.use(cors());
app.use(express.json());

// 1. Endpoint kiểm tra sức khỏe hệ thống (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Backend API is running smoothly' });
});

// 2. GET /api/books (Lấy danh sách hoặc tìm kiếm theo từ khóa: ?search=)
app.get('/api/books', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i'); // 'i': không phân biệt chữ hoa/thường
      filter = {
        $or: [
          { title: regex },
          { author: regex },
          { category: regex }
        ]
      };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách sách', error: error.message });
  }
});

// 3. GET /api/books/:id (Xem chi tiết một cuốn sách theo _id hoặc bookId)
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let book = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      book = await Book.findById(id);
    }
    if (!book) {
      book = await Book.findOne({ bookId: id });
    }

    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách yêu cầu' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin sách', error: error.message });
  }
});

// 4. POST /api/books (Thêm sách mới, kiểm tra dữ liệu và trùng bookId)
app.post('/api/books', async (req, res) => {
  try {
    const { bookId, title, author, category, publisher, publishYear, isbn, quantity, description } = req.body;

    // Kiểm tra dữ liệu đầu vào bắt buộc
    if (!bookId || !title || !author || !category || !publisher || !publishYear || !isbn || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ tất cả các trường thông tin bắt buộc' });
    }

    // Kiểm tra trùng mã sách bookId
    const duplicate = await Book.findOne({ bookId: bookId.trim() });
    if (duplicate) {
      return res.status(409).json({ message: `Mã sách '${bookId}' đã tồn tại trong hệ thống!` });
    }

    const newBook = new Book({
      bookId: bookId.trim(),
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      publisher: publisher.trim(),
      publishYear: Number(publishYear),
      isbn: isbn.trim(),
      quantity: Number(quantity),
      description: description ? description.trim() : ''
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi thêm sách mới', error: error.message });
  }
});

// 5. PUT /api/books/:id (Cập nhật thông tin sách)
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật' });
    }

    // Nếu đổi mã bookId, kiểm tra mã mới có bị trùng sách khác không
    if (updateData.bookId && updateData.bookId !== book.bookId) {
      const duplicate = await Book.findOne({ bookId: updateData.bookId.trim() });
      if (duplicate) {
        return res.status(409).json({ message: `Mã sách '${updateData.bookId}' đã được sử dụng!` });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật sách', error: error.message });
  }
});

// 6. DELETE /api/books/:id (Xóa sách)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách để xóa' });
    }

    res.status(200).json({ message: 'Đã xóa sách thành công', book: deletedBook });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa sách', error: error.message });
  }
});

// Kết nối MongoDB Atlas và lắng nghe cổng
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB Atlas thành công');
    app.listen(PORT, () => {
      console.log(`🚀 Máy chủ Backend đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB Atlas:', err.message);
  });