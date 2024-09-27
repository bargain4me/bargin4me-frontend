// Test to inject a console.log statement into the page
async function testExecuteScript(tabId: number) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        console.log("Test: chrome.scripting.executeScript is working!");
        return { success: true };
      },
      world: 'MAIN', // Run in the main execution context of the page
    });

    console.log("Script executed successfully, result:", result);
  } catch (error) {
    console.error("Error during chrome.scripting.executeScript:", error);
  }
}

// Call this function with the active tab ID
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const activeTab = tabs[0];
  testExecuteScript(activeTab.id!);
});
