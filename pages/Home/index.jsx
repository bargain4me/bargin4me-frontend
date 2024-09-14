import React, { useState, useEffect } from "react"
import { Oval } from "react-loader-spinner"

import Listings from "./Listings"

const Home = ({ onLogout }) => {
  const [itemDescription, setItemDescription] = useState("")
  const [priceRangeMin, setPriceRangeMin] = useState("")
  const [priceRangeMax, setPriceRangeMax] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showListings, setShowListings] = useState(false)
  const [user, setUser] = useState(null)

  console.log("User:", user)
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!itemDescription) newErrors.itemDescription = true
    if (!priceRangeMin) newErrors.priceRangeMin = true
    if (!priceRangeMax) newErrors.priceRangeMax = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setErrors({})
      setLoading(true)
      setShowListings(false) // Hide listings when a new search is initiated
      // Simulate API call
      setTimeout(() => {
        // Here you would normally handle the API response
        console.log("Item Description:", itemDescription)
        console.log("Price Range:", `${priceRangeMin} - ${priceRangeMax}`)
        setLoading(false)
        setShowListings(true)
      }, 2000)
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
        }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Item Description:
          </label>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: errors.itemDescription
                ? "1px solid red"
                : "1px solid #ccc"
            }}
          />
          {errors.itemDescription && (
            <span style={{ color: "red" }}>
              Please enter an item description.
            </span>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Item Price Range:
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={priceRangeMin}
              onChange={(e) => setPriceRangeMin(e.target.value)}
              placeholder="Min"
              style={{
                width: "45%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: errors.priceRangeMin
                  ? "1px solid red"
                  : "1px solid #ccc",
                marginRight: "10px"
              }}
            />
            <span style={{ margin: "0 5px" }}>-</span>
            <input
              type="text"
              value={priceRangeMax}
              onChange={(e) => setPriceRangeMax(e.target.value)}
              placeholder="Max"
              style={{
                width: "45%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: errors.priceRangeMax
                  ? "1px solid red"
                  : "1px solid #ccc",
                marginLeft: "10px"
              }}
            />
          </div>
          {(errors.priceRangeMin || errors.priceRangeMax) && (
            <span style={{ color: "red" }}>
              Please enter a valid price range.
            </span>
          )}
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Start
        </button>
        <button
          onClick={onLogout}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            color: "#4CAF50",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            fontSize: "14px",
            fontFamily: "inherit"
          }}>
          Logout
        </button>
      </form>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Oval
            height={60}
            width={60}
            color="#4CAF50"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#f3f3f3"
            strokeWidth={5}
            wrapperStyle={{ display: "flex", justifyContent: "center" }}
            strokeWidthSecondary={5}
          />
        </div>
      )}

      {showListings && (
        <div style={{ marginTop: "20px" }}>
          <Listings />
        </div>
      )}
    </div>
  )
}

export default Home
