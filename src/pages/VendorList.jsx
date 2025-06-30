import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function VendorList() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/vendors', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setVendors(response.data)
      } catch (err) {
        setError('Failed to load vendors')
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [user])

  return (
    <div className="vendor-list-container">
      <h2>Vendors</h2>
      <Link to="/vendors/add" className="btn-add">
        Add Vendor
      </Link>
      {loading && <p>Loading vendors...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && (
        <ul className="vendor-list">
          {vendors.map((vendor) => (
            <li key={vendor.id}>
              <Link to={`/vendors/${vendor.id}`}>{vendor.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
