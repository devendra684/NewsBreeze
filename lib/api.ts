import Parser from 'rss-parser'
import { HfInference } from '@huggingface/inference'
import axios from 'axios'

const parser = new Parser()
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export interface NewsItem {
  title: string
  link: string
  content: string
  pubDate: string
  summary?: string
  audioUrl?: string
}

const RSS_FEEDS = [
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://feeds.bbci.co.uk/news/world/rss.xml'
]

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    console.log('Fetching news...')
    // Use a CORS proxy to fetch the RSS feeds
    const corsProxy = 'https://api.allorigins.win/raw?url='
    
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const response = await axios.get(`${corsProxy}${encodeURIComponent(feed)}`)
        console.log('Feed response:', feed, response.status)
        return parser.parseString(response.data)
      } catch (error) {
        console.error('Error fetching feed:', feed, error)
        return null
      }
    })

    const feeds = (await Promise.all(feedPromises)).filter(feed => feed !== null)
    console.log('Feeds fetched:', feeds.length)

    const news: NewsItem[] = feeds.flatMap(feed =>
      feed?.items?.map(item => ({
        title: item.title || '',
        link: item.link || '',
        content: item.content || item.contentSnippet || '',
        pubDate: item.pubDate || '',
      })) || []
    )

    console.log('News items processed:', news.length)
    return news.slice(0, 10) // Limit to 10 items for demo
  } catch (error) {
    console.error('Error in fetchNews:', error)
    return []
  }
}

export async function summarizeText(text: string): Promise<string> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('HUGGINGFACE_API_KEY is not set')
    return text
  }

  try {
    const response = await hf.summarization({
      model: 'Falconsai/text_summarization',
      inputs: text.slice(0, 1000), // Limit input length to avoid token limits
      parameters: {
        max_length: 100,
        min_length: 30,
      },
    })
    return response.summary_text
  } catch (error) {
    console.error('Error summarizing text:', error)
    return text
  }
}

export async function generateAudio(text: string, voice: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Speech synthesis is only available in the browser'))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Try to find a voice that matches the requested voice name
    const voices = window.speechSynthesis.getVoices()
    const selectedVoice = voices.find(v => v.name.toLowerCase().includes(voice.toLowerCase()))
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.onend = () => {
      resolve()
    }

    utterance.onerror = (event) => {
      reject(new Error('Error playing audio: ' + event.error))
    }

    window.speechSynthesis.speak(utterance)
  })
} 