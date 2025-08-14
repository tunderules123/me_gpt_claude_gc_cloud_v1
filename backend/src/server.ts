import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Author, Msg, SendRequest, SendResponse, HistoryResponse } from './types';

dotenv.config();

const app = express();

const SERVER_PORT: number = Number(process.env.PORT) || 3001;
const API_TIMEOUT: number = Number(process.env.TIMEOUT_MS) || 20000;
const MAX_RETRIES: number = Number(process.env.RETRIES) || 2;

// Initialize LLM clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// In-memory history
let history: Msg[] = [];

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173"] : "*",
  credentials: true
}));
app.use(express.json());

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function cleanSpeakerLabels(content: string): string {
  return content.replace(/^\[SPEAKER:\s*[^\]]*\]\s*/i, '').trim();
}

function createSpeakerLabeledHistory(history: Msg[]): Array<{ role: "user" | "assistant"; content: string }> {
  return history.map(msg => ({
    role: msg.role,
    content: msg.role === "user" 
      ? `[SPEAKER: User] ${msg.content}`
      : `[SPEAKER: ${msg.author === "gpt" ? "GPT" : "Claude"}] ${msg.content}`
  }));
}

async function callOpenAI(messages: Array<{ role: "user" | "assistant"; content: string }>, retries: number = MAX_RETRIES): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      return completion.choices[0]?.message?.content || "No response from GPT";
    } catch (error: any) {
      if (attempt === retries) {
        throw new Error(`OpenAI error after ${retries + 1} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error("OpenAI call failed");
}

async function callAnthropic(messages: Array<{ role: "user" | "assistant"; content: string }>, retries: number = MAX_RETRIES): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages,
      });
      
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      return "No text response from Claude";
      
    } catch (error: any) {
      if (error.message?.includes("alternation") && attempt === 0) {
        try {
          const compatMessages = messages.map(msg => {
            if (msg.role === "assistant" && msg.content.includes("[SPEAKER: GPT]")) {
              return { role: "user" as const, content: msg.content };
            }
            return msg;
          });
          
          const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            messages: compatMessages,
          });
          
          const content = response.content[0];
          if (content.type === 'text') {
            return content.text;
          }
          return "No text response from Claude";
        } catch (compatError: any) {
          if (attempt === retries) {
            throw new Error(`Anthropic error (compat retry failed): ${compatError.message}`);
          }
        }
      } else if (attempt === retries) {
        throw new Error(`Anthropic error after ${retries + 1} attempts: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error("Anthropic call failed");
}

// Routes
app.get('/history', (req, res) => {
  const response: HistoryResponse = { history };
  res.json(response);
});

app.post('/send', async (req, res) => {
  try {
    const { content, tags }: SendRequest = req.body;
    
    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }
    
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "Tags array is required" });
    }
    
    const userMessage: Msg = {
      id: generateId(),
      author: "user",
      role: "user",
      content: content.trim(),
      ts: Date.now()
    };
    
    history.push(userMessage);
    
    const contextMessages = createSpeakerLabeledHistory(history);
    const replies: Array<{ id: string; author: Author; content: string; ts: number }> = [];
    
    for (const tag of tags) {
      try {
        let response: string;
        let author: Author;
        
        if (tag === "@gpt") {
          response = await Promise.race([
            callOpenAI(contextMessages),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error(`timeout after ${API_TIMEOUT}ms`)), API_TIMEOUT)
            )
          ]);
          author = "gpt";
        } else if (tag === "@claude") {
          response = await Promise.race([
            callAnthropic(contextMessages),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error(`timeout after ${API_TIMEOUT}ms`)), API_TIMEOUT)
            )
          ]);
          author = "claude";
        } else {
          throw new Error(`Unknown tag: ${tag}`);
        }
        
        const cleanedResponse = cleanSpeakerLabels(response);
        
        const replyMsg: Msg = {
          id: generateId(),
          author,
          role: "assistant",
          content: cleanedResponse,
          ts: Date.now()
        };
        
        history.push(replyMsg);
        replies.push({
          id: replyMsg.id,
          author: replyMsg.author,
          content: replyMsg.content,
          ts: replyMsg.ts
        });
        
        contextMessages.push({
          role: "assistant",
          content: `[SPEAKER: ${author === "gpt" ? "GPT" : "Claude"}] ${cleanedResponse}`
        });
        
      } catch (error: any) {
        const errorAuthor: Author = tag === "@gpt" ? "gpt" : "claude";
        const errorMsg = `(error from ${errorAuthor === "gpt" ? "GPT" : "Claude"}: ${error.message})`;
        
        const errorReply = {
          id: generateId(),
          author: errorAuthor,
          content: errorMsg,
          ts: Date.now()
        };
        
        replies.push(errorReply);
      }
    }
    
    const response: SendResponse = {
      ok: true,
      userMessageId: userMessage.id,
      replies
    };
    
    res.json(response);
    
  } catch (error: any) {
    console.error('Send error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/reset', (req, res) => {
  history = [];
  res.json({ ok: true });
});

// Start server with explicit number type
const server = app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Set' : 'Missing'}`);
  console.log(`Anthropic API Key: ${process.env.ANTHROPIC_API_KEY ? 'Set' : 'Missing'}`);
});

export default server;
