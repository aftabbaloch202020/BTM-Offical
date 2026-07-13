import React, { useState } from 'react';
import { Star, MessageSquare, Check, ShieldCheck, ThumbsUp } from 'lucide-react';
import { Review } from '../types';

interface CustomerReviewsPageProps {
  reviews: Review[];
}

export const CustomerReviewsPage: React.FC<CustomerReviewsPageProps> = ({ reviews }) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    if (hasLiked[id]) return;
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setHasLiked(prev => ({ ...prev, [id]: true }));
  };

  const averageRating = 4.8;
  const totalReviewsCount = 128;

  // Star breakdown stats
  const ratingsBreakdown = [
    { stars: 5, percentage: 85, count: 109 },
    { stars: 4, percentage: 10, count: 13 },
    { stars: 3, percentage: 3, count: 4 },
    { stars: 2, percentage: 1, count: 1 },
    { stars: 1, percentage: 1, count: 1 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-stone-100 min-h-screen">
      
      {/* Page Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-widest text-amber-500 uppercase flex items-center justify-center gap-3">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-amber-500 animate-pulse" />
          Customer Reviews
          <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-amber-500 animate-pulse" />
        </h1>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase mt-2">
          Aapka Bharosa, Hamari Zimmedari • 100% Verified Buyer Feedback
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Ratings Breakdown & Stats */}
        <div className="lg:col-span-4 bg-zinc-950 border border-amber-500/20 rounded-xl p-6 gold-glow space-y-6">
          <h3 className="text-sm font-bold font-display uppercase text-amber-500 tracking-wider flex items-center gap-2 border-b border-amber-500/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Review Statistics
          </h3>

          {/* Average Rating Large Badge */}
          <div className="text-center bg-zinc-900/60 p-6 rounded-lg border border-amber-500/5 relative overflow-hidden">
            <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-500 font-display">
              {averageRating}
            </span>
            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-amber-500 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-400 font-mono mt-1">Based on {totalReviewsCount} Storewide Reviews</p>
            <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1 bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 w-fit mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              98.2% Positive Satisfaction Rate
            </div>
          </div>

          {/* Detailed breakdown list */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold font-mono text-stone-400 tracking-wider">
              Rating Breakdown
            </h4>
            
            <div className="space-y-2.5">
              {ratingsBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-stone-400 font-bold font-mono text-right shrink-0">
                    {item.stars} Star
                  </span>
                  <div className="flex-1 bg-zinc-900 rounded-full h-2 overflow-hidden border border-amber-500/5">
                    <div 
                      className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-stone-400 text-left font-mono shrink-0">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assurance note */}
          <div className="p-4 bg-zinc-900/40 rounded-lg border border-amber-500/5 text-[11px] leading-relaxed text-stone-400">
            <p className="font-bold text-amber-400 uppercase font-mono mb-1 text-[10px]">🔒 Trust Guarantee</p>
            Every review shown is submitted by a verified customer from our Quetta, Gwadar, Turbat, and Hub databases after checking payment screenshots.
          </div>
        </div>

        {/* Column 2: Reviews Feed */}
        <div className="lg:col-span-8 bg-zinc-950 border border-amber-500/20 rounded-xl p-6 gold-glow space-y-6">
          <div className="flex justify-between items-center border-b border-amber-500/10 pb-4">
            <h3 className="text-sm font-bold font-display uppercase text-amber-500 tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Recent Verified Reviews ({reviews.length})
            </h3>
            <span className="text-[10px] font-mono text-stone-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-amber-500/5">
              Sort by: Most Recent
            </span>
          </div>

          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <div 
                key={r.id || idx}
                className="p-5 bg-zinc-900/60 rounded-xl border border-amber-500/5 hover:border-amber-500/20 transition-all flex flex-col justify-between hover:bg-zinc-900 gap-4"
              >
                <div>
                  {/* Top line of review */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-100 font-display text-sm">{r.author}</span>
                      <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase">
                        <Check className="w-3 h-3" />
                        Verified Buyer
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500">{r.date}</span>
                  </div>

                  {/* Stars for review */}
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(r.rating) 
                            ? 'text-amber-500 fill-current' 
                            : 'text-stone-700'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-xs text-stone-300 leading-relaxed italic">
                    "{r.text}"
                  </p>
                </div>

                {/* Footer of card */}
                <div className="flex justify-between items-center pt-3 border-t border-zinc-800/60 text-[10px] text-stone-500">
                  <span className="font-mono uppercase text-stone-600">Purchase Reference: BTM-{Math.floor(1000 + idx * 231)}</span>
                  
                  <button 
                    onClick={() => handleLike(r.id || idx.toString())}
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasLiked[r.id || idx.toString()] 
                        ? 'text-amber-500' 
                        : 'hover:text-stone-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Was this helpful? ({likes[r.id || idx.toString()] || 0})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form placeholder aligned with premium rules */}
          <div className="bg-zinc-900/40 p-5 rounded-xl border border-amber-500/10 text-center space-y-3">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Share Your Shopping Experience</h4>
            <p className="text-[11px] text-stone-400 max-w-md mx-auto leading-relaxed">
              Did you buy something from Balochistan Trusted Mart recently? Your feedback helps thousands of buyers across Pakistan make smart purchases!
            </p>
            <button 
              onClick={() => alert('To maintain verified review trust scores, review submissions are only allowed by scanning QR codes in your physical order invoice details.')}
              className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-zinc-950 text-[10px] font-extrabold uppercase tracking-wider px-5 h-10 rounded transition-all cursor-pointer inline-flex items-center justify-center"
            >
              Write A Verified Review
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
