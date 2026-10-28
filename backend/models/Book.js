const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: [true, 'Mã sách không được để trống'],
    unique: true, // Không cho phép trùng mã sách
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Tên sách không được để trống'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Tác giả không được để trống'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Thể loại không được để trống'],
    trim: true
  },
  publisher: {
    type: String,
    required: [true, 'Nhà xuất bản không được để trống']
  },
  publishYear: {
    type: Number,
    required: [true, 'Năm xuất bản không được để trống']
  },
  isbn: {
    type: String,
    required: [true, 'Mã ISBN không được để trống']
  },
  quantity: {
    type: Number,
    required: [true, 'Số lượng không được để trống'],
    min: [0, 'Số lượng không được âm']
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);