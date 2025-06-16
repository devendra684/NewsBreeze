import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchNews } from '../../lib/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const news = await fetchNews()
    res.status(200).json(news)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ message: 'Error fetching news' })
  }
} 