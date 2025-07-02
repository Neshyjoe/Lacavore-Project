import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function AddEditReview() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const location = useLocation()
  const vendorIdFromState = location.state?.vendorId
  const [vendorId, setVendorId] = useState(vendorIdFromState || '')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isEdit) {
      const fetchReview = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reviews/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          setVendorId(response.data.vendor_id)
          setRating(response.data.rating)
          setComment(response.data.comment)
        } catch (err) {
          setError('Failed to load review')
        }
      }
      fetchReview()
    }
  }, [id, isEdit, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/reviews/${id}`,
          { vendor_id: vendorId, rating, comment },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/reviews`,
          { vendor_id: vendorId, rating, comment },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
      }
      navigate(`/vendors/${vendorId}`)
    } catch (err) {
      setError('Failed to save review')
    }
  }

  return (
    <div className="review-form-container">
      <h2>{isEdit ? 'Edit Review' : 'Add Review'}</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="review-form">
        {!isEdit && (
          <label>
            Vendor ID
            <input
              type="text"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            />
          </label>
        )}
        <label>
          Rating
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label>
          Comment
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </label>
        <button type="submit">{isEdit ? 'Update' : 'Add'} Review</button>
      </form>
    </div>
  )
}
