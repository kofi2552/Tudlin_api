import dotenv from "dotenv";
import fs from "fs";
import pdf from "pdf-parse";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "../contexts/Report.pdf");

export async function extractPdfContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let isAwaitingResponse = false;

export const sendChatMessage = async (req, res) => {
  const { prompt, useContext } = req.body;

  console.log("recieved: ", prompt, "useContext: ", useContext);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  if (isAwaitingResponse) {
    return res.status(429).json({
      error: "AI is currently processing another request. Please wait.",
    });
  }

  try {
    // Set the flag to indicate the AI is busy
    isAwaitingResponse = true;

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Start a chat session with the model
    const chat = model.startChat({
      history: [], // Optional: Add conversation history for context
      generationConfig: {
        maxOutputTokens: 500, // Adjust as needed
      },
    });

    let context = ""; // Default to an empty context

    // Load context if `useContext` is true
    if (useContext) {
      const pdfContent = await extractPdfContent(filePath);
      context = pdfContent;
    }

    // Construct the message
    const message = useContext
      ? `I'm a teacher in an international school! Using this context: ${context}, Teacher asks: ${prompt}. You can respond to any general question as a language model. For a general question, keep your response simple. Always respond as a fellow teacher`
      : prompt;

    // Send the user's prompt and stream the response
    const result = await chat.sendMessageStream(message);

    let fullResponse = "";
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text(); // Extract the text from each chunk
      fullResponse += chunkText;
    }

    // Reset the flag after processing
    isAwaitingResponse = false;

    // Send the response back to the client
    res.status(200).json({ response: fullResponse });
    console.log("Response sent!");
  } catch (error) {
    console.error("Error communicating with Google Gemini:", error.message);

    // Ensure the flag is reset even in case of an error
    isAwaitingResponse = false;

    res.status(500).json({ error: "Failed to process the request." });
  }
};
