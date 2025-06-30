import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function AddEditVendor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isEdit) {
      const fetchVendor = async () => {
        try {
          const response = await axios.get(`/vendors/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          setName(response.data.name)
          setDescription(response.data.description)
          setLocation(response.data.location)
        } catch (err) {
          setError('Failed to load vendor')
        }
      }
      fetchVendor()
    }
  }, [id, isEdit, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) {
        await axios.put(
          `/vendors/${id}`,
          { name, description, location },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
      } else {
        await axios.post(
          '/vendors',
          { name, description, location },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
      }
      navigate('/vendors')
    } catch (err) {
      setError('Failed to save vendor')
    }
  }

  return (
    <div className="vendor-form-container">
      <h2>{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="vendor-form">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <button type="submit">{isEdit ? 'Update' : 'Add'} Vendor</button>
      </form>
    </div>
  )
}
