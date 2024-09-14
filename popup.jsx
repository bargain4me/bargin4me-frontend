import React, { useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"

const IndexPopup = () => {
  const [selector, setSelector] = useState("")
  const [text, setText] = useState("")

  const handleFill = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tabs[0]?.id) {
      sendToContentScript({
        name: "fill-element",
        tabId: tabs[0].id,
        body: { selector, text }
      })
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Element Selector and Filler</h2>
      <input
        type="text"
        value={selector}
        onChange={(e) => setSelector(e.target.value)}
        placeholder="Enter CSS selector"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to fill"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={handleFill} style={{ width: "100%" }}>
        Fill Element
      </button>
    </div>
  )
}

export default IndexPopup
