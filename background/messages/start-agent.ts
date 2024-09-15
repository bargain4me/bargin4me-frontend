import { log } from "console"

import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging"

import { DendriteClient } from "../../dendriteClient"
import type { GetElementResponse, PageInformation } from "../../dendriteClient"

class Tab {
  private _tabId: number
  private _dendriteClient: DendriteClient
  private openaiApiKey: string
  private anthropicApiKey: string
  private _stop: boolean = false // Add stop flag

  constructor(
    tabId: number,
    dendriteApiKey: string,
    openaiApiKey: string,
    anthropicApiKey: string
  ) {
    console.log("Initializing Tab with tabId:", tabId)
    this._tabId = tabId
    this._dendriteClient = new DendriteClient(
      "http://localhost:8000/api/v1",
      dendriteApiKey
    )
    this.openaiApiKey = openaiApiKey
    this.anthropicApiKey = anthropicApiKey
  }

  // Method to stop the agent
  stop() {
    console.log("Stopping the agent")
    this._stop = true
  }

  async getActiveTab(): Promise<chrome.tabs.Tab> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    if (this._tabId) {
      const tab = await chrome.tabs.get(this._tabId)
      if (tab) {
        console.log("Using existing tab:", tab.id)
        return tab
      }
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || !tab.id) {
      throw new Error("No active tab found")
    }
    console.log("Active tab found:", tab.id)
    this._tabId = tab.id
    return tab
  }

  async getPageInformation(): Promise<PageInformation> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Getting page information")
    const tab = await this.getActiveTab()
    const pageInfo = {
      url: tab.url || "",
      raw_html: await this.captureHTML(),
      screenshot_base64: await this.captureScreenshot()
    }
    console.log("Page information:", pageInfo)
    return pageInfo
  }

  private async captureHTML(): Promise<string> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Capturing HTML for tabId:", this._tabId)
    if (!this._tabId) throw new Error("No active tab")

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: this._tabId },
      func: () => {
        var hashCode = (string) => {
          var hash = 0,
            i,
            chr
          if (string.length === 0) return hash
          for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i)
            hash = (hash << 5) - hash + chr
            hash |= 0 // Convert to 32bit integer
          }
          return hash
        }

        var getXPathForElement = (element) => {
          const getElementIndex = (element) => {
            let index = 1
            let sibling = element.previousElementSibling

            while (sibling) {
              if (sibling.localName === element.localName) {
                index++
              }
              sibling = sibling.previousElementSibling
            }

            return index
          }

          const segs = (elm) => {
            if (!elm || elm.nodeType !== 1) return [""]
            if (elm.id && document.getElementById(elm.id) === elm)
              return [`id("${elm.id}")`]
            const localName =
              typeof elm.localName === "string"
                ? elm.localName.toLowerCase()
                : "unknown"
            let index = getElementIndex(elm)

            return [...segs(elm.parentNode), `${localName}[${index}]`]
          }
          return segs(element).join("/")
        }

        // Create a Map to store used hashes and their counters
        const usedHashes = new Map()

        document.querySelectorAll("*").forEach((element, index) => {
          try {
            const xpath = getXPathForElement(element)
            const hash = hashCode(xpath)
            const baseId = hash.toString(36)

            const markHidden = (hidden_element) => {
              // Mark the hidden element itself
              hidden_element.setAttribute("data-hidden", "true")
            }

            const computedStyle = window.getComputedStyle(element)
            const isHidden =
              computedStyle.display === "none" ||
              computedStyle.visibility === "hidden"

            if (isHidden) {
              markHidden(element)
            } else {
              element.removeAttribute("data-hidden") // in case we hid it in a previous call
            }

            let uniqueId = baseId
            let counter = 0

            // Check if this hash has been used before
            while (usedHashes.has(uniqueId)) {
              // If it has, increment the counter and create a new uniqueId
              counter++
              uniqueId = `${baseId}_${counter}`
            }

            // Add the uniqueId to the usedHashes Map
            usedHashes.set(uniqueId, true)
            element.setAttribute("d-id", uniqueId)
          } catch (error) {
            // Fallback: use a hash of the tag name and index
            const fallbackId = hashCode(`${element.tagName}_${index}`).toString(
              36
            )
            console.error(
              "Error processing element, using fallback:",
              fallbackId,
              element,
              error
            )

            element.setAttribute("d-id", `fallback_${fallbackId}`)
          }
        })

        // Expand iframes and give them d-ids
        document.querySelectorAll("iframe").forEach((iframe, index) => {
          try {
            const frame_path = getXPathForElement(iframe)
            const iframeDocument =
              iframe.contentDocument || iframe.contentWindow.document
            iframeDocument.querySelectorAll("*").forEach((element, index) => {
              const xpath = getXPathForElement(element)
              const fullPath = frame_path + xpath
              const hash = hashCode(fullPath)
              const baseId = hash.toString(36)

              let uniqueId = baseId
              let counter = 0

              while (usedHashes.has(uniqueId)) {
                counter++
                uniqueId = `${baseId}_${counter}`
              }

              usedHashes.set(uniqueId, true)
              element.setAttribute("d-id", uniqueId)
              element.setAttribute("iframe-path", frame_path)
            })
          } catch (error) {
            console.error("Error processing iframe:", iframe, error)
          }
        })

        return document.documentElement.outerHTML
      }
    })

    console.log("Captured HTML length:", result.length)
    return result as string
  }

  async captureScreenshot(): Promise<string> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Capturing screenshot")
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" })
    console.log("Captured screenshot size:", dataUrl.length)
    return dataUrl.split(",")[1] // Remove the "data:image/png;base64," prefix
  }

  async goto(url: string): Promise<void> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Navigating to URL:", url)
    const tab = await this.getActiveTab()
    await chrome.tabs.update(tab.id!, { url })

    await new Promise<void>((resolve, reject) => {
      const onCompletedListener = (
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails
      ) => {
        if (details.tabId === tab.id && details.frameId === 0) {
          chrome.webNavigation.onCompleted.removeListener(onCompletedListener)
          resolve()
        }
      }

      chrome.webNavigation.onCompleted.addListener(onCompletedListener)

      // Optional: Add a timeout to reject the promise if the page doesn't load within a certain time
      setTimeout(() => {
        chrome.webNavigation.onCompleted.removeListener(onCompletedListener)
        reject(new Error("Page load timeout"))
      }, 30000) // 30 seconds timeout
    })

    console.log("Page loaded")
  }

  private async get_element(prompt: string): Promise<GetElementResponse> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Getting element with prompt:", prompt)
    const pageInfo = await this.getPageInformation()
    const element: GetElementResponse =
      await this._dendriteClient.getInteractionsSelector({
        page_information: pageInfo,
        llm_config: {
          openai_api_key: this.openaiApiKey,
          anthropic_api_key: this.anthropicApiKey
        },
        prompt,
        use_cache: true,
        only_one: true
      })
    console.log("Element found:", element)
    return element
  }

  async click(prompt: string, expectedOutcome?: string): Promise<any> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Click action with prompt:", prompt)
    const elementResponse = await this.get_element(prompt)
    if (elementResponse.selectors && elementResponse.selectors.length >= 1) {
      await chrome.scripting.executeScript({
        target: { tabId: this._tabId },
        func: (selector) => {
          console.log("Executing click script for selector:", selector)
          const element = document.querySelector(selector)
          if (element) {
            console.log("Element found, clicking")
            element.dispatchEvent(new MouseEvent("click"))
          } else {
            console.error("Element not found for selector:", selector)
          }
        },
        args: [elementResponse.selectors[0]]
      })
      console.log("Element clicked:", elementResponse.selectors[0])
    } else {
      console.error("Element not found for click action with prompt:", prompt)
      throw new Error("Element not found for click action")
    }
  }

  async fill(
    prompt: string,
    value: string,
    expectedOutcome?: string
  ): Promise<any> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Fill action started with prompt:", prompt, "and value:", value)
    const elementResponse = await this.get_element(prompt)

    if (elementResponse.selectors && elementResponse.selectors.length >= 1) {
      console.log(
        "Element found for fill action:",
        elementResponse.selectors[0]
      )

      await chrome.scripting.executeScript({
        target: { tabId: this._tabId },
        func: (selector, value) => {
          console.log("Executing fill script for selector:", selector)
          const input = document.querySelector(selector) as HTMLInputElement
          if (input) {
            console.log("Input element found, focusing")
            input.focus()
            // Optional: Scroll the element into view
            input.scrollIntoView()
            console.log("Entering value:", value)
            // Clear any existing value
            input.value = ""

            const typeCharacter = (char: string, index: number) => {
              const charCode = char.charCodeAt(0)
              const eventOptions = {
                key: char,
                code: `Key${char.toUpperCase()}`,
                charCode: charCode,
                keyCode: charCode,
                which: charCode,
                bubbles: true
              }
              // Dispatch keydown event
              input.dispatchEvent(new KeyboardEvent("keydown", eventOptions))
              // Dispatch keypress event
              input.dispatchEvent(new KeyboardEvent("keypress", eventOptions))
              // Update the value
              input.value += char
              // Dispatch input event
              input.dispatchEvent(new InputEvent("input", { bubbles: true }))
              // Dispatch keyup event
              input.dispatchEvent(new KeyboardEvent("keyup", eventOptions))

              if (index < value.length - 1) {
                setTimeout(
                  () => typeCharacter(value[index + 1], index + 1),
                  200
                ) // 200ms delay between keystrokes
              } else {
                console.log("Dispatching change event")
                input.dispatchEvent(new Event("change", { bubbles: true }))
              }
            }

            // Wait 500ms before starting to type
            setTimeout(() => {
              typeCharacter(value[0], 0)
            }, 500)
          } else {
            console.error("Input element not found for selector:", selector)
          }
        },
        args: [elementResponse.selectors[0], value]
      })
      console.log(
        "Element filled successfully, selected, and Enter key pressed:",
        elementResponse.selectors[0]
      )
    } else {
      console.error("Element not found for fill action with prompt:", prompt)
      throw new Error("Element not found for fill action")
    }
    console.log("Fill action completed with selection and Enter key press")
  }

  async extract(
    prompt: string,
    typeSpec?: any,
    useCache: boolean = true
  ): Promise<any> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log(
      "Extract action with prompt:",
      prompt,
      "and typeSpec:",
      typeSpec
    )
    const pageInfo = await this.getPageInformation()
    let result
    try {
      result = await this._dendriteClient.scrapePage({
        page_information: pageInfo,
        llm_config: {
          openai_api_key: this.openaiApiKey,
          anthropic_api_key: this.anthropicApiKey
        },
        prompt,
        return_data_json_schema: typeSpec,
        use_screenshot: true,
        use_cache: useCache,
        force_use_cache: false
      })
      console.log("Extract result:", result)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to scrape page: ${error.message}`)
        throw new Error(`Scrape page operation failed: ${error.message}`)
      } else {
        console.error("An unexpected error occurred during page scraping")
        throw new Error("An unexpected error occurred during page scraping")
      }
    }
    return result
  }

  async ask(prompt: string, typeSpec?: any): Promise<any> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Ask action with prompt:", prompt, "and typeSpec:", typeSpec)
    console.log("OpenAI API Key in ask:", this.openaiApiKey)
    console.log("Anthropic API Key in ask:", this.anthropicApiKey)
    const pageInfo = await this.getPageInformation()
    const dto = {
      prompt,
      page_information: pageInfo,
      llm_config: {
        openai_api_key: this.openaiApiKey,
        anthropic_api_key: this.anthropicApiKey
      },
      return_schema: {
        type: "string"
      }
    }
    console.log("Ask DTO:", dto)
    const result = await this._dendriteClient.askPage(dto)
    console.log("Ask result:", result)
    return result
  }

  // Method to focus on the active tab
  async focusTab(): Promise<void> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log("Focusing on tab:", this._tabId)
    const tab = await this.getActiveTab()
    await chrome.windows.update(tab.windowId, { focused: true })
    await chrome.tabs.update(tab.id!, { active: true })
    console.log("Tab focused:", tab.id)
  }
  async pressEnter(key: string): Promise<void> {
    if (this._stop) throw new Error("Agent stopped") // Check stop flag
    console.log(`Pressing key "${key}" globally on the page`)
    await chrome.scripting.executeScript({
      target: { tabId: this._tabId },
      func: () => {
        const dispatchKeyEvent = (eventType) => {
          const event = new KeyboardEvent(eventType, {
            key: "Enter",
            keyCode: 13,
            code: "Enter",
            which: 13,
            bubbles: true,
            cancelable: true
          })
          document.activeElement.dispatchEvent(event)
        }

        dispatchKeyEvent("keydown")

        setTimeout(() => {
          dispatchKeyEvent("keypress")

          setTimeout(() => {
            dispatchKeyEvent("keyup")
            console.log("Enter key pressed on active element")
          }, 50)
        }, 50)
      }
    })
  }
}

const startAgentHandler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    console.log("Handler received request:", req.body)
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    const query = encodeURIComponent(req.body.itemDescription)
    const lowPrice = encodeURIComponent(req.body.priceRangeMin)
    const highPrice = encodeURIComponent(req.body.priceRangeMax)

    const dendriteTab = new Tab(
      tab.id,
      req.body.dendriteApiKey,
      req.body.openaiApiKey,
      req.body.anthropicApiKey
    )

    await dendriteTab.goto(
      `https://www.facebook.com/marketplace/search/minPrice=${lowPrice}&maxPrice=${highPrice}}?query=${query}`
    )
    const data = await dendriteTab.extract(
      "get all the items as a list of objects with the following keys: {url, price, description, imageUrl}",
      {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to the listing page" },
            price: {
              type: "number",
              description: "Include the currency symbol in the price"
            },
            description: {
              type: "string",
              description: "The name and description of the item as one string"
            },
            imageUrl: {
              type: "string",
              description: "The URL to the image of the item"
            }
          }
        }
      }
    )

    // send to /rank

    // get urls back

    // visit each url

    // extract data

    //

    res.send({
      message: "Page information captured and analyzed successfully",
      data
    })
  } catch (error) {
    console.error("Error in handler:", error)
    res.send({
      message: "Error capturing or analyzing page information",
      error: error.message
    })
  }
}

export default startAgentHandler
