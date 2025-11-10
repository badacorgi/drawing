
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Canvas, type CanvasRef } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { GeminiFeedback } from './components/GeminiFeedback';
import { GamePanel } from './components/GamePanel';
import type { DrawingOptions } from './types';
import { getWordToDraw, evaluateDrawing } from './services/geminiService';

type GameState = 'start' | 'loading_word' | 'drawing' | 'evaluating' | 'result';

export default function App() {
  const [drawingOptions, setDrawingOptions] = useState<DrawingOptions>({
    color: '#000000',
    lineWidth: 8,
  });
  const [wordToDraw, setWordToDraw] = useState<string>('');
  const [geminiResponse, setGeminiResponse] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>('start');
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<CanvasRef>(null);

  

  const handleSubmitDrawing = useCallback(async () => {
    if (!canvasRef.current || !wordToDraw) return;
    // handleSubmitDrawing 함수 내부 (App.tsx)
const response = await fetch('/.netlify/functions/gemini', {
  method: 'POST',
  body: JSON.stringify({ word: wordToDraw, imageDataUrl: imageDataUrl }),
});
const data = await response.json();
setGeminiResponse(data.feedback);
    const imageDataUrl = canvasRef.current.exportAsBase64();
    if (!imageDataUrl) {
        setError("The canvas is empty! Please draw something.");
        return;
    }

    setGameState('evaluating');
    setError(null);
    try {
      const feedback = await evaluateDrawing(wordToDraw, imageDataUrl);
      setGeminiResponse(feedback);
      setGameState('result');
    } catch (err) {
      setError('Could not evaluate the drawing. The API might be busy. Please try again.');
      setGameState('drawing');
    }
  }, [wordToDraw]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-6xl text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
          Gemini Drawing Game
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">AI가 당신의 그림을 평가해 드립니다!</p>
      </header>
      
      <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0 lg:w-2/3 flex flex-col gap-4">
          <Toolbar options={drawingOptions} setOptions={setDrawingOptions} onClear={() => canvasRef.current?.clearCanvas()} />
          <div className="aspect-video w-full bg-white rounded-xl shadow-lg overflow-hidden border-4 border-slate-200 dark:border-slate-700">
            <Canvas ref={canvasRef} options={drawingOptions} />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <GamePanel 
            gameState={gameState}
            wordToDraw={wordToDraw}
            onNewWord={handleNewWord}
            onSubmit={handleSubmitDrawing}
          />
          <GeminiFeedback 
            gameState={gameState}
            response={geminiResponse}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
