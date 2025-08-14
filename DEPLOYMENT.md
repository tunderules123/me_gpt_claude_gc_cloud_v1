# 🚀 Deployment Guide

## 📋 Quick Deployment Options

### **Option 1: GitHub + Local Development**
1. **Upload to GitHub**:
   - Create new repository on GitHub
   - Upload all files from `/app/github-deployment/`
   - Clone to your local machine

2. **Run Locally**:
   ```bash
   git clone your-repo-url
   cd your-repo-name
   
   # Install dependencies
   npm run install-all
   
   # Set up environment variables
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys
   
   # Start both services
   npm run dev
   ```

3. **Access**: Open `http://localhost:5173`

### **Option 2: Deploy Frontend to Vercel/Netlify**

#### **Backend (Keep Running Locally)**
```bash
cd backend
npm install
# Configure .env with API keys
npm run dev  # Runs on localhost:3001
```

#### **Frontend to Vercel**
1. Push frontend to GitHub
2. Connect GitHub repo to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

### **Option 3: Full Cloud Deployment**

#### **Backend Options**:
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available  
- **Railway**: Git-based deployment
- **DigitalOcean App Platform**: Simple scaling

#### **Frontend Options**:
- **Vercel**: Best for React apps
- **Netlify**: Great free tier
- **GitHub Pages**: Free static hosting

## 🔧 Environment Variables

Create `backend/.env`:
```env
PORT=3001
OPENAI_API_KEY=sk-proj-your-key-here
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
TIMEOUT_MS=20000
RETRIES=2
```

## 📁 File Structure
```
3-person-chat-app/
├── README.md
├── package.json
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   └── types.ts
│   ├── package.json
│   ├── .env.example
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── types.ts
    │   └── components/
    ├── package.json
    ├── vite.config.ts
    └── index.html
```

## 🌐 Production Configuration

### **Frontend (vite.config.ts)**
Update API proxy for production:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/history": "https://your-backend-url.com",
      "/send": "https://your-backend-url.com", 
      "/reset": "https://your-backend-url.com",
    },
  },
});
```

### **Backend (server.ts)**
Configure CORS for production:
```typescript
app.use(cors({
  origin: ["https://your-frontend-url.com", "http://localhost:5173"],
  credentials: true
}));
```

## ✅ Testing Deployment

1. **Backend Test**:
   ```bash
   curl -X GET https://your-backend-url.com/history
   ```

2. **Frontend Test**:
   - Visit your deployed URL
   - Try sending messages to @gpt and @claude
   - Verify responses appear correctly
   - Test reset functionality

## 🎯 Common Issues

**CORS Errors**: Update backend CORS settings for your frontend URL

**API Key Errors**: Verify environment variables are set correctly

**Build Errors**: Check all dependencies are installed

**Connection Issues**: Ensure backend URL is correct in frontend config

---

Your 3-person chat app is ready for deployment! 🎉