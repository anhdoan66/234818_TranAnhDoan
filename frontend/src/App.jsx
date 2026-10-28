import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const initialForm = {
    bookId: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    publishYear: '',
    isbn: '',
    quantity: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  // 1. Tải danh sách sách hoặc tìm kiếm
  const fetchBooks = async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const url = searchTerm 
        ? `${API_BASE_URL}/api/books?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/api/books`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi lấy dữ liệu từ server');
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Thêm hoặc cập nhật sách
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const isEdit = !!editingId;
      const url = isEdit 
        ? `${API_BASE_URL}/api/books/${editingId}`
        : `${API_BASE_URL}/api/books`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');

      setSuccess(isEdit ? 'Cập nhật sách thành công!' : 'Thêm sách mới thành công!');
      setFormData(initialForm);
      setEditingId(null);
      fetchBooks(search);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (book) => {
    setEditingId(book._id);
    setFormData({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      publisher: book.publisher,
      publishYear: book.publishYear,
      isbn: book.isbn,
      quantity: book.quantity,
      description: book.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Xóa sách
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cuốn sách: "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi khi xóa');
      setSuccess('Đã xóa sách thành công!');
      fetchBooks(search);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 15px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #2563eb', paddingBottom: '15px' }}>
        <h1 style={{ color: '#1e40af', margin: '0 0 5px 0' }}>HỆ THỐNG QUẢN LÝ SÁCH CLOUD</h1>
        <p style={{ color: '#475569', margin: 0 }}>Sinh viên: <b>Trần Anh Đoàn</b> | MSSV: <b>234818</b></p>
      </header>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', margin: '15px 0' }}>⚠️ {error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '4px', margin: '15px 0' }}>✅ {success}</div>}

      {/* Form Thêm / Cập nhật */}
      <section style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, color: '#334155' }}>{editingId ? '📝 Cập nhật thông tin sách' : '➕ Thêm sách mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <input required name="bookId" placeholder="Mã sách (VD: B004)" value={formData.bookId} onChange={handleChange} style={inputStyle} />
          <input required name="title" placeholder="Tên sách" value={formData.title} onChange={handleChange} style={inputStyle} />
          <input required name="author" placeholder="Tác giả" value={formData.author} onChange={handleChange} style={inputStyle} />
          <input required name="category" placeholder="Thể loại" value={formData.category} onChange={handleChange} style={inputStyle} />
          <input required name="publisher" placeholder="Nhà xuất bản" value={formData.publisher} onChange={handleChange} style={inputStyle} />
          <input required type="number" name="publishYear" placeholder="Năm xuất bản" value={formData.publishYear} onChange={handleChange} style={inputStyle} />
          <input required name="isbn" placeholder="Mã ISBN" value={formData.isbn} onChange={handleChange} style={inputStyle} />
          <input required type="number" name="quantity" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} style={inputStyle} />
          <input name="description" placeholder="Mô tả sách" value={formData.description} onChange={handleChange} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
          
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ ...btnStyle, backgroundColor: '#2563eb', color: '#fff' }}>
              {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }} style={{ ...btnStyle, backgroundColor: '#64748b', color: '#fff' }}>
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tìm kiếm */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '25px 0 15px 0', gap: '10px' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Danh sách sách ({books.length})</h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Tìm theo tên, tác giả, thể loại..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '250px' }}
          />
          <button type="submit" style={{ ...btnStyle, backgroundColor: '#0284c7', color: '#fff' }}>Tìm kiếm</button>
          {search && <button type="button" onClick={() => { setSearch(''); fetchBooks(''); }} style={{ ...btnStyle, backgroundColor: '#94a3b8', color: '#fff' }}>Đặt lại</button>}
        </form>
      </section>

      {/* Bảng sách */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                <th style={thStyle}>Mã sách</th>
                <th style={thStyle}>Tên sách</th>
                <th style={thStyle}>Tác giả</th>
                <th style={thStyle}>Thể loại</th>
                <th style={thStyle}>Số lượng</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={tdStyle}><b>{b.bookId}</b></td>
                    <td style={tdStyle}>{b.title}</td>
                    <td style={tdStyle}>{b.author}</td>
                    <td style={tdStyle}>{b.category}</td>
                    <td style={tdStyle}>{b.quantity}</td>
                    <td style={tdStyle}>
                      <button onClick={() => setViewingBook(b)} style={{ ...actionBtnStyle, backgroundColor: '#0ea5e9' }}>Chi tiết</button>
                      <button onClick={() => handleEditClick(b)} style={{ ...actionBtnStyle, backgroundColor: '#f59e0b', margin: '0 5px' }}>Sửa</button>
                      <button onClick={() => handleDelete(b._id, b.title)} style={{ ...actionBtnStyle, backgroundColor: '#ef4444' }}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Không có sách nào phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup xem chi tiết */}
      {viewingBook && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, color: '#1e40af' }}>📖 Chi tiết sách: {viewingBook.title}</h3>
            <p><b>Mã sách:</b> {viewingBook.bookId}</p>
            <p><b>Tác giả:</b> {viewingBook.author}</p>
            <p><b>Thể loại:</b> {viewingBook.category}</p>
            <p><b>Nhà xuất bản:</b> {viewingBook.publisher} ({viewingBook.publishYear})</p>
            <p><b>ISBN:</b> {viewingBook.isbn}</p>
            <p><b>Số lượng trong kho:</b> {viewingBook.quantity}</p>
            <p><b>Mô tả:</b> {viewingBook.description || 'Không có mô tả'}</p>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button onClick={() => setViewingBook(null)} style={{ ...btnStyle, backgroundColor: '#334155', color: '#fff' }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' };
const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const actionBtnStyle = { padding: '4px 8px', border: 'none', borderRadius: '3px', color: '#fff', cursor: 'pointer', fontSize: '12px' };
const thStyle = { padding: '12px 10px', borderBottom: '2px solid #cbd5e1' };
const tdStyle = { padding: '10px', fontSize: '14px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '550px', width: '90%' };