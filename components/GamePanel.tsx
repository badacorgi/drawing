
import React from 'react';

type GameState = 'start' | 'loading_word' | 'drawing' | 'evaluating' | 'result';

interface GamePanelProps {
  gameState: GameState;
  wordToDraw: string;
  onNewWord: () => void;
  onSubmit: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({ gameState, wordToDraw, onNewWord, onSubmit }) => {
  const isButtonDisabled = gameState === 'loading_word' || gameState === 'evaluating';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
        제시어
      </h2>
      <div className="min-h-[60px] w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
        {gameState === 'loading_word' ? (
          <div className="animate-pulse text-2xl font-mono tracking-widest text-slate-400">...</div>
        ) : (
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            {wordToDraw || '새로운 단어를 받아주세요'}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
        <button
          onClick={onNewWord}
          disabled={isButtonDisabled}
          className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {gameState === 'loading_word' ? '단어 받는 중...' : '새로운 단어'}
        </button>
        <button
          onClick={onSubmit}
          disabled={isButtonDisabled || !wordToDraw || gameState === 'start'}
          className="flex-1 px-4 py-3 bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {gameState === 'evaluating' ? '평가 중...' : '그림 제출하기'}
        </button>
      </div>
    </div>
  );
};
