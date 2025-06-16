import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
  Link,
  useToast,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { NewsItem } from '../lib/api'

interface NewsCardProps {
  item: NewsItem
  onGenerateAudio: (text: string) => Promise<void>
}

export default function NewsCard({ item, onGenerateAudio }: NewsCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const toast = useToast()

  const handleGenerateAudio = async () => {
    try {
      setIsPlaying(true)
      await onGenerateAudio(item.summary || item.content)
      toast({
        title: 'Audio playback completed',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Error playing audio',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{item.title}</Heading>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Text>{item.summary || item.content}</Text>
          <Link href={item.link} isExternal color="blue.500">
            Read full article
          </Link>
        </VStack>
      </CardBody>
      <CardFooter>
        <HStack spacing={4} width="100%">
          <Button
            colorScheme="blue"
            onClick={handleGenerateAudio}
            isLoading={isPlaying}
            loadingText="Playing audio..."
            flex="1"
            disabled={isPlaying}
          >
            {isPlaying ? 'Playing...' : 'Listen with Celebrity Voice'}
          </Button>
          {isPlaying && (
            <IconButton
              aria-label="Stop audio"
              icon={<Text>⏹</Text>}
              onClick={stopAudio}
              colorScheme="red"
            />
          )}
        </HStack>
      </CardFooter>
    </Card>
  )
} 