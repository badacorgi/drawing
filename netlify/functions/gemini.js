// Google AI SDK를 설치해야 합니다: npm install @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Netlify 환경 변수를 안전하게 사용합니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event) => {
  try {
    // 프론트엔드에서 보낸 데이터를 파싱합니다.
    const { word, imageDataUrl } = JSON.parse(event.body);

    // ... (여기에 evaluateDrawing 또는 getWordToDraw 로직 구현) ...
    // 예: const model = genAI.getGenerativeModel(...)
    // 예: const result = await model.generateContent(...)
    // const feedback = await result.response.text();

    // 임시 응답
    const feedback = "This is a response from the secure Netlify Function!";

    return {
      statusCode: 200,
      body: JSON.stringify({ feedback }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};