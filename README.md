# NewsBreeze - Celebrity-Powered Audio News Reader

NewsBreeze is a modern news aggregation application that transforms text news into an engaging audio experience using celebrity voices. It fetches the latest headlines from various sources, provides AI-powered summaries, and converts them into audio using advanced voice cloning technology.

## Features

- Real-time news aggregation from multiple sources via RSS feeds
- AI-powered text summarization using Hugging Face models
- Text-to-speech conversion with celebrity voice cloning using coqui/xtts-v2
- Clean and modern user interface built with Next.js and Chakra UI
- Responsive design for both desktop and mobile devices

## Technologies Used

- **Frontend Framework**: Next.js 14 with TypeScript
- **UI Library**: Chakra UI
- **AI Models**:
  - Text Summarization: Falconsai/text_summarization (Hugging Face)
  - Voice Cloning: coqui/xtts-v2
- **News Source**: RSS feeds via rss-parser
- **API Integration**: Axios for HTTP requests

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/newsbreeze.git
   cd newsbreeze
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   HUGGINGFACE_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/pages` - Next.js pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and API clients
- `/styles` - Global styles and theme configuration
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Models Used

1. **Text Summarization**: Falconsai/text_summarization
   - Purpose: Generates concise summaries of news articles
   - Provider: Hugging Face

2. **Voice Cloning**: coqui/xtts-v2
   - Purpose: Converts text to speech using celebrity voice cloning
   - Provider: Coqui

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 