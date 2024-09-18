import { sendToBackground } from "@plasmohq/messaging"

const Listings = ({ listings, itemDescription }) => {
  const handleStartNegotiating = async (listing) => {
    try {
      await sendToBackground({
        name: "start-agent",
        body: {
          type: "start-chat",
          listingPageUrl: listing.url,
          message:
            listing.initialMessage || "Hello, I'm interested in this item."
        }
      })
      alert("Negotiation started successfully!")
    } catch (error) {
      console.error("Error starting negotiation:", error)
      alert("Failed to start negotiation. Please try again.")
    }
  }

  const handleChat = async (listing) => {
    try {
      await sendToBackground({
        name: "start-agent",
        body: {
          type: "negotiate",
          listing: listing,
          itemDescription: itemDescription
        }
      })
      alert("Chat initiated successfully!")
    } catch (error) {
      console.error("Error initiating chat:", error)
      alert("Failed to initiate chat. Please try again.")
    }
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px"
        }}>
        {listings.map((listing, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
              transition: "transform 0.2s"
            }}>
            <div
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                <img
                  src={listing.imageUrl}
                  alt={listing.description}
                  style={{
                    margin: "10px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "red",
                    marginRight: "15px"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>
                    {listing.description}
                  </h3>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#4CAF50",
                      margin: "0 0 15px 0",
                      fontSize: "24px"
                    }}>
                    {listing.price}$
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "10px"
                }}>
                <a
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#2196F3",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "8px 12px",
                    border: "1px solid #2196F3",
                    borderRadius: "4px",
                    flex: 1,
                    marginRight: "5px"
                  }}>
                  View Listing
                </a>
                <button
                  onClick={() => handleStartNegotiating(listing)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    flex: 1,
                    marginRight: "5px"
                  }}>
                  Negotiate
                </button>
                <button
                  onClick={() => handleChat(listing)}
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    padding: "8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Listings
