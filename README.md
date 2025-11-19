<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CryptoIntel - AI-Powered Crypto Research Tool

A sophisticated cryptocurrency intelligence and research platform with **multiple AI provider support**. Generate detailed research prompts and get instant AI-powered analysis - choose from **premium, free, or local AI models**!

## Features

- **Multiple AI Providers**:
  - **Claude (Anthropic)**: Premium AI with extended thinking modes (Paid)
  - **Gemini (Google)**: FREE tier with Google AI Studio + web search grounding
  - **Ollama**: 100% FREE local AI - runs entirely on your machine!
- **Intelligent Prompt Builder**: Comprehensive form-based interface for building detailed crypto research prompts
- **Three Analysis Modes**:
  - **Deep Analysis**: Most thorough analysis with extended thinking
  - **Balanced Analysis**: Good balance of speed and depth
  - **Fast Analysis**: Quick, high-quality analysis for rapid insights
- **Interactive AI Chat**: Real-time conversation for follow-up questions
- **Research Categories**:
  - Tokenomics & Supply Mechanics
  - On-Chain Activity Analysis
  - Market Structure & Liquidity
  - Security & Audits
  - Governance & Treasury
  - Competitive Landscape
  - Social & Sentiment Intelligence
  - Technical/Chart Analysis

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your AI provider** (choose at least one):

   ### Option 1: Gemini (FREE - Recommended for getting started)
   - Get your FREE API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create `.env.local` file:
     ```
     VITE_GOOGLE_API_KEY=your_google_api_key_here
     ```
   - No cost! Includes web search grounding!

   ### Option 2: Ollama (FREE - Best for privacy)
   - Install [Ollama](https://ollama.com/)
   - Pull a model: `ollama pull llama3.1:8b`
   - Start Ollama (usually auto-starts)
   - No API key needed! Runs 100% locally!

   ### Option 3: Claude (Premium)
   - Get your API key from [Anthropic Console](https://console.anthropic.com/settings/keys)
   - Add to `.env.local`:
     ```
     VITE_ANTHROPIC_API_KEY=sk-ant-...
     ```
   - Best quality but costs money

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (Vite default port)

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **AI Providers**:
  - Anthropic Claude (Opus & Sonnet)
  - Google Gemini (2.5 Pro & Flash)
  - Ollama (Local models)
- **Styling**: Tailwind CSS (via inline classes)

## Usage

1. **Select Your AI Provider**: Choose between Claude (premium), Gemini (FREE), or Ollama (local)
2. **Build Your Research Prompt**: Fill out the form sections with your research context, goals, and requirements
3. **Generate Prompt**: Click "Generate Prompt" to create a structured research query
4. **Choose Analysis Type**:
   - **Deep Analysis**: Most thorough, uses extended thinking
   - **Balanced Analysis**: Good mix of speed and depth (Gemini includes web search!)
   - **Fast Analysis**: Quick insights
5. **Use the Chat**: Click the chat button for interactive follow-up questions

## Provider Comparison

| Feature | Claude | Gemini | Ollama |
|---------|--------|--------|--------|
| **Cost** | Paid | FREE | FREE |
| **Quality** | Excellent | Very Good | Good |
| **Speed** | Medium | Fast | Depends on hardware |
| **Thinking Mode** | Yes | Yes | No |
| **Web Search** | No | Yes | No |
| **Privacy** | Cloud | Cloud | 100% Local |
| **Setup** | API Key | API Key | Install + Model |

## Notes

- **Claude**: Best quality but requires payment. Great for professional research.
- **Gemini**: FREE with Google AI Studio! Includes real-time web search grounding.
- **Ollama**: Completely free and private. Runs on your machine. Quality depends on model size.
- For production use, consider implementing a backend proxy to protect API keys (for Claude/Gemini).
- Your selected provider is saved in browser localStorage.
