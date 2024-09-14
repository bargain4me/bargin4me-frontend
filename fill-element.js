import { sendToContentScript } from "@plasmohq/messaging"

export const config = {
  matches: ["<all_urls>"]
}

sendToContentScript({
  name: "fill-element"
})

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.name === "fill-element") {
      const { selector, text } = message
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement
        ) {
          element.value = text
        } else {
          element.textContent = text
        }
      })
    }
    return true // Keeps the message channel open for asynchronous responses
  }
)
