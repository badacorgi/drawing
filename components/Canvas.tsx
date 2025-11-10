
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { DrawingOptions } from '../types';

interface CanvasProps {
  options: DrawingOptions;
}

export interface CanvasRef {
  clearCanvas: () => void;
  exportAsBase64: () => string | null;
}

export const Canvas = forwardRef<CanvasRef, CanvasProps>(({ options }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e.nativeEvent) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    lastPosition.current = getCoordinates(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !lastPosition.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    e.preventDefault();

    const currentPosition = getCoordinates(e);
    if (!currentPosition) return;

    ctx.beginPath();
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.stroke();

    lastPosition.current = currentPosition;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPosition.current = null;
  };

  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    exportAsBase64: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const isCanvasBlank = !canvas.getContext('2d')
        ?.getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);

      if (isCanvasBlank) return null;
      
      return canvas.toDataURL('image/png');
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
});
