import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed,
  ).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white/80 p-6 backdrop-blur-xl transition-all duration-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
      onClick={handleStudyNow}
    >
      <div className="space-y-4">
        {/* ICON AND TITLE */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
            <BookOpen className="h-6 w-6 text-emerald-600" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="mb-1 line-clamp-2 text-base font-semibold text-slate-900"
              title={flashcardSet?.documentId?.title}
            >
              {flashcardSet?.documentId?.title}
            </h3>
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="flex items-center gap-3 pt-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="text-sm font-semibold text-slate-700">
              {totalCards} {totalCards === 1 ? "Card" : "Cards"}
            </span>
          </div>
          {reviewedCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <TrendingUp
                className="h-3.5 w-3.5 text-emerald-600"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-emerald-700">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* PROGRESS BAR */}
        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Progress
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {reviewedCount}/{totalCards} reviewed
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* STUDY BUTTON */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="group/btn relative h-11 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-50 to-teal-100 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:text-white active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            Study Now
          </span>
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
