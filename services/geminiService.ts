
import { GoogleGenAI } from '@google/genai';

// IMPORTANT: Do NOT expose your API key in client-side code.
// This is for demonstration purposes only. In a real application,
// this API call should be made from a backend server.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function base64ToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

export async function getWordToDraw(): Promise<string> {
  const model = 'gemini-2.5-flash';
  const prompt = `그림 그리기 게임에 사용할, 그리기 쉽고 재미있는 사물 이름 하나만 알려줘. 반드시 한국어로, 단어 하나만 응답해. 예: '사과'`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching word to draw:", error);
    throw new Error("Failed to get a word from Gemini API.");
  }
}

export async function evaluateDrawing(word: string, imageDataUrl: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `당신은 그림 그리기 게임의 친절한 심사위원입니다. 사용자는 '${word}'(을)를 그려야 했습니다. 첨부된 그림을 보고, 사용자의 그림 실력을 평가해주세요. 
    1. 사용자가 '${word}'을(를) 제대로 그렸는지 판단해주세요.
    2. 그림의 어떤 점이 좋은지, 어떤 점이 재미있는지 칭찬해주세요.
    3. 전체적으로 긍정적이고 격려하는 말투를 사용해주세요.
    4. 모든 답변은 한국어로 작성해주세요.`;
    
    // imageDataUrl is in the format "data:image/png;base64,iVBORw0KGgo..."
    // We need to extract the mime type and the base64 data
    const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid image data URL format");
    }
    const mimeType = match[1];
    const base64Data = match[2];
    
    const imagePart = base64ToGenerativePart(base64Data, mimeType);

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }, imagePart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error evaluating drawing:", error);
        throw new Error("Failed to evaluate drawing with Gemini API.");
    }
}
