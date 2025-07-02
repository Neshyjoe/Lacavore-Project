import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function VendorDetail() {
  const { id } = useParams()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setVendor(response.data)
      } catch (err) {
        setError('Failed to load vendor')
      } finally {
        setLoading(false)
      }
    }
    fetchVendor()
  }, [id, user])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/vendors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      navigate('/vendors')
    } catch (err) {
      alert('Failed to delete vendor')
    }
  }

  return (
    <div className="vendor-detail-container">
      {loading && <p>Loading vendor...</p>}
      {error && <p className="error-msg">{error}</p>}
      {vendor && (
        <>
          <h2>{vendor.name}</h2>
          <p>{vendor.description}</p>
          <p>Location: {vendor.location}</p>
          <Link to={`/vendors/${id}/edit`} className="btn-edit">
            Edit Vendor
          </Link>
          <button onClick={handleDelete} className="btn-delete">
            Delete Vendor
          </button>
          <h3>Reviews</h3>
          <Link to="/reviews/add" state={{ vendorId: id }} className="btn-add-review">
            Add Review
          </Link>
          <ul className="review-list">
            {vendor.reviews && vendor.reviews.length > 0 ? (
              vendor.reviews.map((review) => (
                <li key={review.id}>
                  <p>Rating: {review.rating} / 5</p>
                  <p>{review.comment}</p>
                  <Link to={`/reviews/${review.id}/edit`} className="btn-edit-review">
                    Edit Review
                  </Link>
                </li>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </ul>
        </>
      )}
    </div>
  )
}
