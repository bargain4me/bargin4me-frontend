import { log } from "console"
import React, { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"

import { sendToBackground } from "@plasmohq/messaging"

import { supabase } from "../../supabaseClient"
import Listings from "./Listings"

// [
//   {
//     url: "https://www.facebook.com/marketplace/item/7673585892747366/?ref=product_details&referral_code=marketplace_top_picks&referral_story_type=top_picks",
//     chatUrl: "https://www.messenger.com/marketplace/t/8210518932388481",
//     price: "$150",
//     description: "Used MacBook Pro 2019",
//     imageUrl: "https://example.com/macbook1.jpg",
//     initialMessage: "Hi, is this MacBook still available?",
//     summary: "Good condition MacBook Pro, slight wear on keyboard",
//     message:
//       "Seller is open to offers, mentioned possible discount for quick sale",
//     listedPrice: "$150",
//     estimatePrice: "$140"
//   },
//   {
//     url: "https://example.com/listing2",
//     price: "$180",
//     description: "MacBook Air 2020",
//     imageUrl: "https://example.com/macbook2.jpg",
//     initialMessage:
//       "Hello, I'm interested in your MacBook Air. Is it still for sale?",
//     summary: "Nearly new MacBook Air, comes with original packaging",
//     message: "Seller firm on price but willing to include accessories",
//     listedPrice: "$180",
//     estimatePrice: "$175"
//   }
// ]

const Home = ({ onLogout, onViewListing }) => {
  const [itemDescription, setItemDescription] = useState("office chairs")
  const [priceRangeMin, setPriceRangeMin] = useState("100")
  const [priceRangeMax, setPriceRangeMax] = useState("1000")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [listings, setListings] = useState()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    // Load listings from localStorage if available
    const storedListings = localStorage.getItem("listings")
    if (storedListings) {
      setListings(JSON.parse(storedListings))
    }
  }, [])

  const getListings = async () => {
    const res = await sendToBackground({
      name: "start-agent",
      body: {
        type: "get-listings",
        itemDescription,
        priceRangeMin,
        priceRangeMax
      }
    })
    return res.allListings
  }

  const handleSubmit = async (e) => {
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
      setListings(undefined)

      const allListings = await getListings()
      setListings(allListings)
      // Store listings in localStorage
      localStorage.setItem("listings", JSON.stringify(allListings))
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "8px" }}>
          <textarea
            type="text"
            value={itemDescription}
            placeholder="Describe what you want dealmate to buy for you."
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
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={priceRangeMin}
              onChange={(e) => setPriceRangeMin(e.target.value)}
              placeholder="Min budget"
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
              placeholder="Max budget"
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
          Search listings
        </button>
        <button
          onClick={onLogout}
          style={{
            position: "absolute",
            top: "8px",
            left: "30px",
            background: "none",
            border: "none",
            color: "#4CAF50",
            cursor: "pointer",
            padding: 0,
            fontSize: "14px",
            fontFamily: "inherit"
          }}>
          Logout
        </button>
      </form>
      <hr
        style={{
          border: 0,
          height: "1px",
          backgroundColor: "#e0e0e0",
          margin: "20px 0"
        }}
      />
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

      {listings && (
        <Listings listings={listings} itemDescription={itemDescription} />
      )}
    </div>
  )
}

export default Home
