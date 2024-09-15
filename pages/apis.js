// Function to fetch item data
async function fetchItemData() {
  try {
    const response = await fetch(
      "https://d53503de-4a3d-4eb2-840a-bda4b5fea6e4-00-mpqny06oapwx.spock.replit.dev/item",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Fetched item data:", data)
    return data
  } catch (error) {
    console.error("Error fetching item data:", error)
    return null // Return null or handle the error based on your application's requirements
  }
}

// Function to search items based on user input
async function searchItem(
  userId,
  itemDescription,
  priceRangeMin,
  priceRangeMax
) {

    console.log("searchItems: ", userId, itemDescription, priceRangeMin, priceRangeMax)
    try {
      const response = await fetch(
        "https://d53503de-4a3d-4eb2-840a-bda4b5fea6e4-00-mpqny06oapwx.spock.replit.dev/searchItems",
        {
          method: "POST", // Use POST method for sending data
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userid: userId, // Assuming the id is the userId
            searchitem: itemDescription, // The item description
            minprice: priceRangeMin, // Minimum price
            maxprice: priceRangeMax // Maximum price
          })
        }
      );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Sent search results:", data)
    return data
  } catch (error) {
    console.error("Error searching items:", error)
    return null // Return null or handle the error based on your application's requirements
  }
}

export { fetchItemData, searchItem }
