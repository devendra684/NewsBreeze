import { Box, Container, Heading, VStack, SimpleGrid, Spinner, Center, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import NewsCard from '../components/NewsCard'
import { NewsItem, summarizeText, generateAudio } from '../lib/api'
import axios from 'axios'

const Home: NextPage = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setError(null)
      // Fetch news from our API route
      const response = await axios.get('/api/news')
      const newsItems = response.data

      // Generate summaries for each news item
      const itemsWithSummaries = await Promise.all(
        newsItems.map(async (item: NewsItem) => ({
          ...item,
          summary: await summarizeText(item.content)
        }))
      )
      
      setNews(itemsWithSummaries)
    } catch (error) {
      console.error('Error loading news:', error)
      setError('Failed to load news. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAudio = async (text: string) => {
    try {
      // For now, we'll use a default voice
      await generateAudio(text, 'Google US English')
    } catch (error) {
      console.error('Error generating audio:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate audio',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <>
      <Head>
        <title>NewsBreeze - Celebrity-Powered Audio News</title>
        <meta name="description" content="Get your news read by your favorite celebrities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="2xl" textAlign="center">
              NewsBreeze
            </Heading>
            <Heading as="h2" size="md" textAlign="center" color="gray.600">
              Your Celebrity-Powered Audio News Reader
            </Heading>

            {loading ? (
              <Center p={8}>
                <Spinner size="xl" />
              </Center>
            ) : error ? (
              <Center p={8}>
                <Text color="red.500">{error}</Text>
              </Center>
            ) : news.length === 0 ? (
              <Center p={8}>
                <Text>No news articles available at the moment.</Text>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {news.map((item, index) => (
                  <NewsCard
                    key={index}
                    item={item}
                    onGenerateAudio={handleGenerateAudio}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Box>
    </>
  )
}

export default Home 