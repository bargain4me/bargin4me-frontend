const Listings = ({ listings, onViewListing }) => {
  return (
    <div>
      {listings.map((listing, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}>
          <img
            src={listing.imageUrl}
            alt={listing.description}
            style={{ width: "100px", height: "100px" }}
          />
          <div>
            <h3>{listing.description}</h3>
            <p>{listing.price}</p>
            <a href={listing.url} target="_blank" rel="noopener noreferrer">
              View Listing
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Listings
