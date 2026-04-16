import React, { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative h-72 w-full" style={{ perspective: "1000px" }}>
      <div
        className={`relative h-full w-full transform-gpu cursor-pointer transition-transform duration-500`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* CARD (QUESTION) - FRONT SIDE */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border-2 border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* STAR BUTTON */}
          <div className="flex items-start justify-between">
            <div className="rounded bg-slate-100 px-4 py-1 text-[10px] text-slate-600 uppercase">
              {flashcard?.difficulty}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                flashcard?.isStarred
                  ? "bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500"
              }`}
            >
              <Star
                className="h-4 w-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* QUESTION CONTENT*/}
          <div className="flex flex-1 items-center justify-center px-4 py-6">
            <p className="test-lg text-center leading-relaxed font-semibold text-slate-900">
              {flashcard.question}
            </p>
          </div>

          {/* FLIP INDICATOR */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* CARD (QUESTION) - BACK SIDE */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border-2 border-emerald-400/60 bg-linear-to-br from-emerald-500 to-teal-500 p-8 shadow-xl shadow-emerald-500/30"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* STAR BUTTON */}
          <div className="h-4 w-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                flashcard.isStarred
                  ? "border border-white/40 bg-white/30 text-white backdrop-blur-sm"
                  : "border border-white/20 bg-white/20 text-white/70 backdrop-blur-sm hover:bg-white/30 hover:text-white"
              }`}
            >
              <Star
                className="h-4 w-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* ANSWER CONTENT*/}
          <div className="flex flex-1 items-center justify-center px-4 py-6">
            <p className="text-center text-base leading-relaxed font-medium text-white">
              {flashcard.answer}
            </p>
          </div>

          {/* FLIP INDICATOR */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-white/70">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
