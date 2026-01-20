
import React, { useRef, useEffect } from 'react';

interface SignaturePadProps {
  onCapture: (signature: string) => void;
  label: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onCapture, label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high-DPI resolution for Retina displays (iPad/iPhone)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const move = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      if (e.cancelable) e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stop = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        // Export at a reasonable size but maintain quality
        onCapture(canvas.toDataURL('image/png', 0.8));
      }
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', stop);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', stop);
    };
  }, [onCapture]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onCapture('');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">{label} *</label>
        <button 
          type="button" 
          onClick={clear}
          className="px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg uppercase tracking-wider transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="relative aspect-[3/1] bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-crosshair shadow-sm">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full bg-slate-50/30"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute bottom-6 left-0 right-0 border-b border-dashed border-slate-300 pointer-events-none mx-12"></div>
        <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sign Above</span>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
