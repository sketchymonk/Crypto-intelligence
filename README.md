<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CryptoIntel - AI-Powered Crypto Research Tool

A sophisticated cryptocurrency intelligence and research platform with **multiple AI provider support**. Generate detailed research prompts and get instant AI-powered analysis - choose from **premium, free, or local AI models**!

## Features

- **Multiple AI Providers** (6 providers supported!):
  - **Claude (Anthropic)**: Premium AI with extended thinking modes (Paid)
  - **Gemini (Google)**: FREE tier with Google AI Studio + web search grounding
  - **OpenRouter**: FREE access to 300+ models (DeepSeek, Llama, Mistral, and more!)
  - **Groq**: FREE tier with ultra-fast inference (Lightning-fast responses!)
  - **Mistral AI**: FREE tier with rate limits (European AI excellence)
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

## Quick Start

### Option 1: Use GitHub Pages (Recommended for Easy Access)

Visit the live app at: **https://sketchymonk.github.io/Crypto-intelligence/**

No installation required! Just:
1. Open the app in your browser
2. Click the **Settings** icon (⚙️) in the top right
3. Choose your AI provider and enter your API key:
   - **Gemini** (FREE): Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **OpenRouter** (FREE): Get a key from [OpenRouter](https://openrouter.ai/keys)
   - **Groq** (FREE): Get a key from [Groq Console](https://console.groq.com/keys)
   - **Mistral** (FREE): Get a key from [Mistral Console](https://console.mistral.ai/)
   - **Claude** (Paid): Get a key from [Anthropic Console](https://console.anthropic.com/settings/keys)
   - **Ollama** (Local): Configure your Ollama base URL and model
4. Start analyzing crypto projects!

**Your API keys are stored locally in your browser and never sent to any server except the respective AI provider.**

### Option 2: Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your AI provider** (choose at least one FREE option!):

   ### Option 1: Gemini (FREE - Recommended)
   - Get your FREE API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create `.env.local` file:
     ```
     VITE_GOOGLE_API_KEY=your_google_api_key_here
     ```
   - No cost! Includes web search grounding!

   ### Option 2: OpenRouter (FREE - 300+ Models!)
   - Get your FREE API key from [OpenRouter](https://openrouter.ai/keys)
   - Add to `.env.local`:
     ```
     VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```
   - Access to DeepSeek, Llama, Mistral, and many more free models!

   ### Option 3: Groq (FREE - Ultra-Fast!)
   - Get your FREE API key from [Groq Console](https://console.groq.com/keys)
   - Add to `.env.local`:
     ```
     VITE_GROQ_API_KEY=your_groq_api_key_here
     ```
   - Lightning-fast inference with free tier!

   ### Option 4: Mistral AI (FREE Tier)
   - Get your FREE API key from [Mistral Console](https://console.mistral.ai/)
   - Add to `.env.local`:
     ```
     VITE_MISTRAL_API_KEY=your_mistral_api_key_here
     ```
   - European AI with free tier!

   ### Option 5: Ollama (FREE - Best for privacy)
   - Install [Ollama](https://ollama.com/)
   - Pull a model: `ollama pull llama3.1:8b`
   - Start Ollama (usually auto-starts)
   - No API key needed! Runs 100% locally!

   ### Option 6: Claude (Premium)
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
  - Google Gemini (3.0 Pro & 2.5 Flash)
  - OpenRouter (DeepSeek R1, Llama, Mistral, 300+ models)
  - Groq (Llama 3.3 70B, Mixtral, ultra-fast inference)
  - Mistral AI (Large, Nemo, Small)
  - Ollama (Local models)
- **Styling**: Tailwind CSS (via inline classes)

## Usage

1. **Select Your AI Provider**: Choose from 6 options - Claude (premium), Gemini (FREE), OpenRouter (FREE, 300+ models), Groq (FREE, ultra-fast), Mistral (FREE tier), or Ollama (local)
2. **Build Your Research Prompt**: Fill out the form sections with your research context, goals, and requirements
3. **Generate Prompt**: Click "Generate Prompt" to create a structured research query
4. **Choose Analysis Type**:
   - **Deep Analysis**: Most thorough, uses extended thinking or advanced models
   - **Balanced Analysis**: Good mix of speed and depth (Gemini includes web search!)
   - **Fast Analysis**: Quick insights with instant responses
5. **Use the Chat**: Click the chat button for interactive follow-up questions

## Provider Comparison

| Feature | Claude | Gemini | OpenRouter | Groq | Mistral | Ollama |
|---------|--------|--------|------------|------|---------|--------|
| **Cost** | Paid | FREE | FREE | FREE | FREE Tier | FREE |
| **Quality** | Excellent | Very Good | Good-Excellent | Good | Good | Good |
| **Speed** | Medium | Fast | Medium-Fast | Ultra-Fast | Fast | Hardware-dependent |
| **Thinking Mode** | Yes | Yes | Varies by model | No | No | No |
| **Web Search** | No | Yes | No | No | No | No |
| **Privacy** | Cloud | Cloud | Cloud | Cloud | Cloud | 100% Local |
| **Setup** | API Key | API Key | API Key | API Key | API Key | Install + Model |
| **Models** | 2 | 2 | 300+ | 3+ | 3+ | Unlimited |

## Deploy to GitHub Pages

This repository is configured for automatic deployment to GitHub Pages.

1. **Enable GitHub Pages:**
   - Go to your repository Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Push to main branch:**
   - Any push to the `main` branch will automatically trigger a deployment
   - The workflow builds the app and deploys it to GitHub Pages

3. **Access your app:**
   - After deployment, your app will be available at: `https://<username>.github.io/Crypto-intelligence/`

## Security & Privacy

- **API Key Storage:** All API keys are stored locally in your browser's localStorage
- **No Backend:** The app makes direct calls to the respective AI provider's API from your browser
- **No Data Collection:** No user data, prompts, or API keys are sent to any server other than the chosen AI provider
- **Open Source:** All code is transparent and auditable in this repository
- **Secure Deployment:** API keys are never exposed in the deployed code or committed to the repository

## Notes

- **Claude**: Best quality but requires payment. Great for professional research.
- **Gemini**: FREE with Google AI Studio! Includes real-time web search grounding.
- **OpenRouter**: FREE access to 300+ models! Great variety including DeepSeek R1, Llama, Mistral, and more.
- **Groq**: FREE with ultra-fast inference! Perfect for quick analysis with generous rate limits.
- **Mistral**: FREE tier with European AI excellence. Good balance of quality and speed.
- **Ollama**: Completely free and private. Runs on your machine. Quality depends on model size.
- API keys can be provided through Settings (stored in browser) or via `.env.local` file (for local development).
- Your selected provider and API keys are saved in browser localStorage for convenience.
