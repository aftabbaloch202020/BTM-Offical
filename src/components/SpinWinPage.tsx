import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gift, RotateCw, Trophy, HelpCircle } from 'lucide-react';

interface SpinWinPageProps {
  onAddNotification: (title: string, message: string, type: any) => void;
  onSpinWin: (prize: string) => void;
}

const sectors = [
  { text: 'Discount Coupon', icon: '🎟️' },
  { text: '50 Coins', icon: '🪙' },
  { text: 'Gift Voucher', icon: '🎁' },
  { text: '100 Coins', icon: '🪙' },
  { text: 'Free Gift', icon: '🛒' },
  { text: '200 Coins', icon: '🪙' },
  { text: 'Cash Prize', icon: '💰' },
  { text: 'Better Luck Next Time', icon: '😔' },
];

export const SpinWinPage: React.FC<SpinWinPageProps> = ({
  onAddNotification,
  onSpinWin
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);
  const [spinError, setSpinError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the wheel on canvas mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = width / 2 - 15; // padding for borders

    ctx.clearRect(0, 0, width, height);

    const numSectors = sectors.length;
    const arcSize = (2 * Math.PI) / numSectors;

    // Draw slices
    for (let i = 0; i < numSectors; i++) {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arcSize);
      ctx.closePath();

      // Alternating deep charcoal and rich metallic gold
      if (i % 2 === 0) {
        ctx.fillStyle = '#0c0c0e'; // Ultra Dark Slate
      } else {
        ctx.fillStyle = '#d4af37'; // BTM Gold
      }

      if (sectors[i].text === 'Better Luck Next Time') {
        ctx.fillStyle = '#222226'; // Charcoal Zinc
      }

      ctx.fill();

      // Sector separator borders
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Sector Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Contrast text colors
      ctx.fillStyle = i % 2 === 0 ? '#d4af37' : '#0c0c0e';
      if (sectors[i].text === 'Better Luck Next Time') {
        ctx.fillStyle = '#9ca3af'; // Grey
      }

      ctx.font = 'bold 15px "Space Grotesk", "Inter", sans-serif';
      
      const text = `${sectors[i].icon} ${sectors[i].text}`;
      ctx.fillText(text, radius - 25, 0);
      ctx.restore();
    }

    // Outer Solid Gold Rim Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Inner rim golden circle highlight
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 7, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fef9cc';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Premium light dots along the rim
    for (let i = 0; i < 24; i++) {
      const dotAngle = (i * 2 * Math.PI) / 24;
      const dotX = cx + (radius - 1) * Math.cos(dotAngle);
      const dotY = cy + (radius - 1) * Math.sin(dotAngle);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fbe05c';
      ctx.fill();
    }

    // Center Core Cover (Black Button with Double Gold Rim)
    ctx.beginPath();
    ctx.arc(cx, cy, 48, 0, 2 * Math.PI);
    ctx.fillStyle = '#09090b';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner gold ring accent
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fbe05c';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Central "SPIN" text
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 17px "Space Grotesk", sans-serif';
    ctx.fillText('SPIN', cx, cy);

  }, []);

  const handleSpin = async () => {
    if (isSpinning) return;
    setPrizeWon(null);
    setSpinError('');

    const token = localStorage.getItem('btm_auth_token');
    if (!token) {
      alert("Please login or register to spin the wheel.");
      window.location.hash = 'account';
      return;
    }

    try {
      const res = await fetch('/api/rewards/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          console.error("JSON parsing failed", jsonErr);
          data = { error: 'Invalid response format from server.' };
        }
      } else {
        const text = await res.text();
        data = { error: text || `Server returned status ${res.status}` };
      }

      if (!res.ok || data.success === false) {
        const errMsg = data.error || data.message || 'Failed to spin the wheel.';
        setSpinError(errMsg);
        if (res.status === 401 || errMsg.toLowerCase().includes("login") || errMsg.toLowerCase().includes("unauthorized") || errMsg.toLowerCase().includes("expired")) {
          setTimeout(() => {
            alert("Your session has expired or is invalid. Please log in again.");
            localStorage.removeItem('btm_auth_token');
            window.location.hash = 'account';
            window.dispatchEvent(new Event('btm_auth_change'));
          }, 1500);
        }
        return;
      }

      setIsSpinning(true);
      
      const prize = data.prize;
      let prizeIndex = sectors.findIndex(s => s.text === prize);
      if (prizeIndex === -1) prizeIndex = 7; // fallback to 'Better Luck Next Time'

      // Complete 5 full spins (360 * 5 = 1800) and stop at the center of the winning sector relative to top (270 degrees)
      const centerAngle = prizeIndex * 45 + 22.5;
      const targetDegrees = 1800 + (360 - centerAngle - 90);
      
      setSpinDeg(prev => {
        const base = Math.ceil(prev / 360) * 360;
        return base + targetDegrees;
      });

      setTimeout(() => {
        setIsSpinning(false);
        setPrizeWon(prize);
        onSpinWin(prize);
        onAddNotification('Lucky Wheel Win! 🎉', `You spun the BTM Fortune Wheel and won: ${prize}!`, 'lucky');
        // Dispatch an event to refresh Account dashboard metrics
        window.dispatchEvent(new Event('btm_auth_change'));
      }, 5000);

    } catch (err: any) {
      console.error("Spin error:", err);
      if (err instanceof TypeError || !navigator.onLine) {
        setSpinError('⚠️ Network connection issue. Please check your connection and try again.');
      } else {
        setSpinError(err?.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-stone-100 min-h-screen flex flex-col items-center">
      
      {/* Page Title Header */}
      <div className="text-center mb-8 w-full">
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-widest text-amber-500 uppercase flex items-center justify-center gap-3">
          <RotateCw className={`w-6 h-6 sm:w-8 sm:h-8 text-amber-500 ${isSpinning ? 'animate-spin' : ''}`} />
          Spin & Win
          <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-bounce" />
        </h1>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase mt-2">
          Try your luck everyday! One free spin is allocated to each active customer order
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Wheel Card Container */}
      <div className="max-w-xl w-full bg-zinc-950 border border-amber-500/25 rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-8 text-center gold-glow">
        
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
            BTM Fortune Wheel
          </h3>
          <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
            Spin the premium gold wheel of fortune! Win exclusive discount coupons, store cash, gift vouchers, or coins.
          </p>
        </div>

        {spinError && (
          <div className="w-full p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
            ⚠️ {spinError}
          </div>
        )}

        {/* Wheel Graphic Container with Pointer */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center shrink-0">
          
          {/* Arrow Pin at Top - Beautiful gold triangle pointer */}
          <div className="absolute top-[-14px] z-20 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-500 drop-shadow-[0_4px_8px_rgba(212,175,55,0.6)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 -mt-1.5 border border-zinc-950" />
          </div>
          
          {/* Outer Ring Dashed Deco */}
          <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-amber-500/20 animate-[spin_120s_linear_infinite]"></div>

          {/* Rotatable Canvas Element wrapper */}
          <div 
            style={{
              transform: `rotate(${spinDeg}deg)`,
              transition: isSpinning ? 'transform 5000ms cubic-bezier(0.1, 0.8, 0.3, 1)' : 'none'
            }}
            className="w-full h-full rounded-full flex items-center justify-center shrink-0"
          >
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="w-full h-full cursor-pointer rounded-full shadow-[0_0_40px_rgba(212,175,55,0.18)]"
              onClick={handleSpin}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="w-full space-y-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full sm:w-56 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-900 disabled:text-stone-600 disabled:border-stone-800 border border-amber-400/20 text-zinc-950 font-black h-12 rounded-full text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10"
          >
            {isSpinning ? 'Wheel Spinning...' : 'SPIN THE WHEEL'}
          </button>

          {prizeWon && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-bold text-xs animate-bounce max-w-sm mx-auto shadow-inner">
              🎉 Congratulations! You Won:<br />
              <span className="text-stone-100 uppercase tracking-wider text-sm mt-1 block font-display font-extrabold">{prizeWon}</span>
            </div>
          )}
        </div>

        {/* Disclaimer / info */}
        <div className="text-[10px] text-stone-500 font-mono pt-4 border-t border-zinc-900/80 w-full flex justify-between items-center">
          <span>🎯 FAIRPLAY SYSTEM ENFORCED</span>
          <span>LIMIT: 1 PLAY / DAY</span>
        </div>

      </div>

    </div>
  );
};
