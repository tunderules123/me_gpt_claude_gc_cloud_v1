# 3-Person Chat App

A brutally minimal 3-person chat application where you can chat with GPT and Claude simultaneously, built with React + TypeScript frontend and Node.js + Express backend.

## ✨ Features

- **Multi-model chat**: Select @gpt, @claude, or both
- **Deterministic ordering**: Responses appear in the exact order you specify
- **Conversation awareness**: Both models know the full conversation history
- **Clean UI**: Modern interface with color-coded message bubbles
- **Real-time responses**: Direct integration with OpenAI and Anthropic APIs
- **Reset functionality**: Clear chat history anytime

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- Anthropic API key

### 1. Clone & Setup Backend
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `backend/.env`:
```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
TIMEOUT_MS=20000
RETRIES=2
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open App
Visit `http://localhost:5173` and start chatting!

## 🎯 How to Use

1. **Select models**: Click @gpt and/or @claude buttons
2. **Check order**: See "Order: @gpt → @claude" display
3. **Type message**: Enter your question or prompt
4. **Send**: Click Send and get responses in order
5. **Reset**: Clear history anytime with Reset button

## 🏗️ Architecture

### Backend (`/backend`)
- **Node.js + Express + TypeScript**
- **OpenAI GPT-4 integration**
- **Anthropic Claude integration** 
- **Speaker-aware conversations**
- **Automatic alternation handling**
- **Timeout & retry logic**

### Frontend (`/frontend`)
- **React 18 + TypeScript + Vite**
- **Tailwind CSS styling**
- **Color-coded message bubbles**
- **Tag-based model selection**
- **Real-time conversation display**

## 📡 API Endpoints

- `GET /history` → Returns conversation history
- `POST /send` → Send message to selected models
- `POST /reset` → Clear conversation history

## 🎨 UI Components

- **MessageBubble**: Color-coded by author (user/gpt/claude)
- **TagButton**: Interactive model selection
- **Composer**: Message input with tag ordering
- **ChatLog**: Scrollable conversation display

## 🔧 Technical Details

- **No streaming**: Simple HTTP request/response
- **Authorship preservation**: Models know who said what
- **Partial success**: If one model fails, other still responds
- **Error handling**: Clear error messages for failures
- **Context management**: Full conversation sent to each model

## 📱 Deployment

### Local Development
Both services run locally with hot reload enabled.

### Production Deployment
1. Build frontend: `npm run build`
2. Configure backend for production
3. Deploy to your preferred hosting platform

## 🤝 Contributing

This is a complete, working implementation of the 3-person chat concept. Feel free to extend with:
- Additional LLM providers
- Streaming responses  
- Conversation persistence
- User authentication
- Message reactions

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Built with ❤️ using React, Node.js, OpenAI, and Anthropic APIs**