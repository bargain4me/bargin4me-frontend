export interface PageInformation {
  url: string
  raw_html: string
  screenshot_base64: string
}

interface LLMConfig {
  openai_api_key: string
  anthropic_api_key?: string
}

interface PageDeltaInformation {
  page_before: PageInformation
  page_after: PageInformation
}

interface AskPageDTO {
  prompt: string
  return_schema?: any
  page_information: PageInformation
  llm_config: LLMConfig
}

interface GetElementsDTO {
  page_information: PageInformation
  llm_config: LLMConfig
  prompt: string
  use_cache: boolean
  only_one: boolean
}

interface LabelPageDTO {
  page_information: PageInformation
  prompt: string
  labels: string[]
  llm_config: LLMConfig
  only_vision: boolean
}

type InteractionType = "click" | "fill" | "hover"

interface MakeInteractionDTO {
  url: string
  dendrite_id: string
  interaction_type: InteractionType
  value?: string
  expected_outcome?: string
  page_delta_information: PageDeltaInformation
  llm_config: LLMConfig
}

interface PageLoaderDTO {
  url: string
  prompt: string
  json_schema: any
  llm_config: LLMConfig
  use_cache?: boolean
}

interface ScrapePageDTO {
  page_information: PageInformation
  llm_config: LLMConfig
  prompt: string
  return_data_json_schema: any
  use_screenshot: boolean
  use_cache: boolean
  force_use_cache: boolean
}

interface TryRunScriptDTO {
  url: string
  raw_html: string
  llm_config: LLMConfig
  prompt: string
  db_prompt?: string
  return_data_json_schema: any
}

export interface GetElementResponse {
  selectors?: string[]
  message: string
}

export class DendriteClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`
        } catch {
          // If parsing JSON fails, we'll use the default error message
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request to ${endpoint} failed: ${error.message}`)
      } else {
        throw new Error(
          `An unexpected error occurred while requesting ${endpoint}`
        )
      }
    }
  }

  async getInteractionsSelector(
    dto: GetElementsDTO
  ): Promise<GetElementResponse> {
    return this.request<GetElementResponse>(
      "/actions/get-interaction-selector",
      "POST",
      dto
    )
  }

  async askPage(dto: AskPageDTO): Promise<any> {
    return this.request("/actions/ask-page", "POST", dto)
  }

  async pageLoader(dto: PageLoaderDTO): Promise<any> {
    return this.request("/actions/page-loader", "POST", dto)
  }

  async labelPage(dto: LabelPageDTO): Promise<any> {
    return this.request("/actions/label-page", "POST", dto)
  }

  async makeInteraction(dto: MakeInteractionDTO): Promise<any> {
    return this.request("/actions/make-interaction", "POST", dto)
  }

  async scrapePage(dto: ScrapePageDTO): Promise<any> {
    return this.request("/actions/scrape-page", "POST", dto)
  }

  async tryRunCached(dto: TryRunScriptDTO): Promise<any> {
    return this.request("/actions/try-run-cached", "POST", dto)
  }
}
