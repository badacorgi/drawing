// badacorgi/drawing/drawing-d83c76977ef0c68a16b58bf8a5edaf0ba9b64901/netlify/functions/gemini.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// .env.local이 아닌 Netlify 대시보드에 설정된 환경 변수를 사용합니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Base64 헬퍼 함수 (geminiService.ts에서 가져옴)
function base64ToGenerativePart(base64, mimeType) {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

// 1. 새로운 단어 생성 함수
async function getWordToDraw() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `그림 그리기 게임에 사용할, 그리기 쉽고 재미있는 사물 이름 하나만 알려줘. 반드시 한국어로, 단어 하나만 응답해. 예: '사과'`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

// 2. 그림 평가 함수
async function evaluateDrawing(word, imageDataUrl) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `당신은 그림 그리기 게임의 친절한 심사위원입니다. 사용자는 '${word}'(을)를 그려야 했습니다. 첨부된 그림을 보고, 사용자의 그림 실력을 평가해주세요. 
    1. 사용자가 '${word}'을(를) 제대로 그렸는지 판단해주세요.
    2. 그림의 어떤 점이 좋은지, 어떤 점이 재미있는지 칭찬해주세요.
    3. 전체적으로 긍정적이고 격려하는 말투를 사용해주세요.
    4. 모든 답변은 한국어로 작성해주세요.`;

  const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data URL format");
  }
  const mimeType = match[1];
  const base64Data = match[2];
  
  const imagePart = base64ToGenerativePart(base64Data, mimeType);

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
}


// 3. Netlify 핸들러
exports.handler = async (event) => {
  try {
    // GET 요청 (새로운 단어 받기)
    if (event.httpMethod === 'GET') {
      const word = await getWordToDraw();
      return {
        statusCode: 200,
        body: JSON.stringify({ word }),
      };
    }

    // POST 요청 (그림 제출하기)
    if (event.httpMethod === 'POST') {
      const { word, imageDataUrl } = JSON.parse(event.body);
      if (!word || !imageDataUrl) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing word or image data" }) };
      }
      
      const feedback = await evaluateDrawing(word, imageDataUrl);
      return {
        statusCode: 200,
        body: JSON.stringify({ feedback }),
      };
    }

    // 그 외 다른 메소드
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
