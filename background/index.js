import { MultiOnClient } from "multion";

// Initialize MultiOn client
const multion = new MultiOnClient({
  apiKey: "daedd3f4d3b14ac380248a35268f0743",
});

// Define the message handler
const startAgentHandler = async (req, res) => {
  const { type, itemDescription, priceRangeMin, priceRangeMax, listingPageUrl, message, listing } = req.body;
  console.log("Request received:", req.body);
  try {
    switch (type) {
      case "get-listings":
        const listings = await multion.browse({
          cmd: `Search for ${itemDescription} with a price range of ${priceRangeMin} to ${priceRangeMax}.`,
          url: "https://example-marketplace.com"
        });
        res.send({ allListings: listings });
        break;

      case "start-chat":
        await multion.chat({
          cmd: `Start chat for the listing at ${listingPageUrl}`,
          message
        });
        res.send({ message: "Chat started successfully!" });
        break;

      case "negotiate":
        await multion.chat({
          cmd: `Negotiate for listing: ${listing.url}`,
          message: `I'm interested in the ${itemDescription}`
        });
        res.send({ message: "Negotiation successful!" });
        break;

      default:
        res.send({ message: "Invalid request type" });
    }
  } catch (error) {
    res.send({ message: "Error", error: error.message });
  }
};

// Export the handler to be used in Plasmo Messaging
export default startAgentHandler;
