import { MultiOnClient } from "multion";
import type { PlasmoMessaging } from "@plasmohq/messaging";

const multion = new MultiOnClient({
  apiKey: "daedd3f4d3b14ac380248a35268f0743",
});

const startAgentHandler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    console.log("Received request in background:", req.body);

    const { type, itemDescription, priceRangeMin, priceRangeMax } = req.body;

    if (type === "get-listings") {
      try {
        console.log("Fetching listings using MultiOn...");
        const listings = await multion.browse({
          cmd: `Search for ${itemDescription} with a price range of ${priceRangeMin} to ${priceRangeMax}.`,
          url: "https://www.facebook.com/marketplace",
        });
        // API t
        console.log("Listings fetched:", listings);
        res.send({ allListings: listings });
      } catch (error) {
        console.error("Error fetching listings:", error);
        res.send({ error: "Failed to fetch listings" });
      }
    } else if (type === "start-chat") {
      // Handle starting a chat and POST to negotation endpoint
    } else {
      console.error("Unknown request type:", type);
      res.send({ error: "Unknown request type" });
    }
  } catch (error) {
    console.error("Error in startAgentHandler:", error);
    res.send({ error: "An error occurred in the agent handler" });
  }
};

export default startAgentHandler;


