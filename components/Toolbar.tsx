
import React from 'react';
import type { DrawingOptions } from '../types';

interface ToolbarProps {
  options: DrawingOptions;
  setOptions: React.Dispatch<React.SetStateAction<DrawingOptions>>;
  onClear: () => void;
}

const colors = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F97316', '#A855F7', '#EC4899', '#F59E0B', '#FFFFFF'];

export const Toolbar: React.FC<ToolbarProps> = ({ options, setOptions, onClear }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="color-picker" className="text-sm font-medium text-slate-600 dark:text-slate-300">Color:</label>
        <div className="flex items-center gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setOptions(prev => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${options.color === color ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-800' : ''}`}
              style={{ backgroundColor: color, border: '2px solid #e2e8f0' }}
              aria-label={`Select color ${color}`}
            />
          ))}
          <input
            id="color-picker"
            type="color"
            value={options.color}
            onChange={e => setOptions(prev => ({ ...prev, color: e.target.value }))}
            className="w-8 h-8 p-0 border-none rounded-full cursor-pointer bg-transparent"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <label htmlFor="line-width" className="text-sm font-medium text-slate-600 dark:text-slate-300">Size:</label>
        <input
          id="line-width"
          type="range"
          min="1"
          max="30"
          value={options.lineWidth}
          onChange={e => setOptions(prev => ({ ...prev, lineWidth: parseInt(e.target.value, 10) }))}
          className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
        />
        <span className="text-sm font-mono w-6 text-center">{options.lineWidth}</span>
      </div>

      <button
        onClick={onClear}
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
      >
        Clear
      </button>
    </div>
  );
};
