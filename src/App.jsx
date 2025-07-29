import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ title: '', release_year: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', release_year: '', description: '' })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch books from backend
  const fetchBooks = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/books/`)
      if (!res.ok) throw new Error('Failed to fetch books')
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/books/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create book')
      }
      setForm({ title: '', release_year: '', description: '' })
      fetchBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  // Start editing a book
  const startEdit = (book) => {
    setEditingId(book.id)
    setEditForm({
      title: book.title,
      release_year: book.release_year,
      description: book.description || ''
    })
  }

  // Handle edit form input
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/books/${editingId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update book')
      }
      setEditingId(null)
      setEditForm({ title: '', release_year: '', description: '' })
      fetchBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: '', release_year: '', description: '' })
  }

  // Delete a book
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/books/${id}/`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete book')
      fetchBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app-container">
      <h1>Book List</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="release_year"
          placeholder="Release Year"
          type="number"
          value={form.release_year}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">Add Book</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="book-list">
          {books.map(book => (
            <li key={book.id}>
              {editingId === book.id ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    name="release_year"
                    type="number"
                    value={editForm.release_year}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit}>Cancel</button>
                </form>
              ) : (
                <>
                  <span className="book-title">{book.title}</span>
                  <span className="book-year">({book.release_year})</span>
                  {book.description && (
                    <div className="book-desc">{book.description}</div>
                  )}
                  <button onClick={() => startEdit(book)} style={{marginLeft:8}}>Edit</button>
                  <button onClick={() => handleDelete(book.id)} style={{marginLeft:8, color:'red'}}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
