
import React from 'react';

type GameState = 'start' | 'loading_word' | 'drawing' | 'evaluating' | 'result';

interface GeminiFeedbackProps {
  gameState: GameState;
  response: string;
  error: string | null;
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-slate-300 dark:border-slate-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400">Gemini가 당신의 그림을 보고 있어요...</p>
    </div>
);

const InitialState = () => (
    <div className="text-center text-slate-500 dark:text-slate-400">
        <p className="text-lg">🎨</p>
        <p>"새로운 단어" 버튼을 눌러 게임을 시작하세요!</p>
        <p className="mt-2 text-sm">그림을 그린 후 제출하면 AI가 평가해 드립니다.</p>
    </div>
);

export const GeminiFeedback: React.FC<GeminiFeedbackProps> = ({ gameState, response, error }) => {
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center text-red-500">
            <p className="font-bold">오류가 발생했습니다!</p>
            <p className="text-sm mt-1">{error}</p>
        </div>
      )
    }

    switch (gameState) {
      case 'evaluating':
        return <LoadingSpinner />;
      case 'result':
        return (
          <div className="space-y-3 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {response.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
            ))}
          </div>
        );
      case 'start':
      case 'loading_word':
      case 'drawing':
      default:
        return <InitialState />;
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 text-center">
        Gemini의 평가
      </h2>
      <div className="min-h-[200px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
        {renderContent()}
      </div>
    </div>
  );
};
