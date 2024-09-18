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
// Function to rank items
async function rankItems(items) {
  console.log("Ranking items:", items);
  try {
    const payload = {
      request: "rank",
      searchId: 15,
      items: items
    };
    console.log("Payload:", payload);
    const response = await fetch(
      "https://d53503de-4a3d-4eb2-840a-bda4b5fea6e4-00-mpqny06oapwx.spock.replit.dev/rank",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const rankedUrls = await response.json()
    console.log("Ranked URLs:", rankedUrls)
    
    // Filter items based on the returned URLs
    const filteredItems = items.filter(item => rankedUrls.includes(item.url));
    console.log("Filtered items:", filteredItems)
    
    return filteredItems
  } catch (error) {
    console.error("Error ranking items:", error)
    return null // Return null or handle the error based on your application's requirements
  }
}

// Function to chat with the AI
async function chatWithAI(chatRequest) {
  console.log("Chatting with AI:", chatRequest);
  try {
    const response = await fetch(
      "https://d53503de-4a3d-4eb2-840a-bda4b5fea6e4-00-mpqny06oapwx.spock.replit.dev/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(chatRequest)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Chat response:", data);
    return data;
  } catch (error) {
    console.error("Error chatting with AI:", error);
    
    return null; // Return null or handle the error based on your application's requirements
  }
}

export { fetchItemData, searchItem, rankItems, chatWithAI }
