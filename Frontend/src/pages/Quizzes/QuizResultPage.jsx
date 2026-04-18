import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/Common/PageHeader";
import Spinner from "../../components/Common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const { data: quiz, results: detailedResults } = results;
  const score = quiz.totalQuestions
    ? Math.round((quiz.score / quiz.totalQuestions) * 100)
    : 0;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(
    (result) => result.isCorrect,
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };
  // test
  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding!";
    if (score >= 80) return "Great Job!";
    if (score >= 70) return "Good Work!";
    if (score >= 60) return "Not Bad!";
    return "Try Again!";
  };
  return (
    <div className="mx-auto max-w-5xl">
      {/* BACK BUTTON */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-emerald-600"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            strokeWidth={2}
          />
          Back to Document
        </Link>
      </div>
      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* SCORE CARD */}
      <div className="mb-8 rounded-2xl border-2 border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="space-y-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/25">
            <Trophy className="h-7 w-7 text-emerald-600" strokeWidth={2} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-slate-600 uppercase">
              Your Score
            </p>
            <div
              className={`inline-block bg-linear-to-r text-5xl font-bold ${getScoreColor(score)} mb-2 bg-clip-text text-transparent`}
            >
              {score}%
            </div>
            <p className="text-lg font-medium text-slate-700">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* STATS */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
              <Target className="h-4 w-4 text-slate-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700">
                {totalQuestions} Total
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <CheckCircle2
                className="h-4 w-4 text-emerald-600"
                strokeWidth={2}
              />
              <span className="text-sm font-semibold text-emerald-700">
                {correctAnswers} Correct
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2">
              <XCircle className="h-4 w-4 text-rose-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-rose-700">
                {incorrectAnswers} Incorrect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION REVIEW */}
      <div className="space-y-6">
        <div className="mb-2 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-slate-600" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-slate-900">
            Detailed Review
          </h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer,
          );
          const correctAnswerIndex = result.correctAnswer.startsWith("0")
            ? parseInt(result.correctAnswer.substring(1), 10) - 1
            : result.options.findIndex((opt) => opt === result.correctAnswer);
          const isCorrect = result.isCorrect;

          return (
            <div
              key={index}
              className="rounded-2xl border-2 border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/25 backdrop-blur-xl"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1">
                    <span className="text-xs font-semibold text-slate-600">
                      Question {index + 1}
                    </span>
                  </div>
                  <h4 className="text-base leading-relaxed font-semibold text-slate-900">
                    {result.question}
                  </h4>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isCorrect
                      ? "border-2 border-emerald-200 bg-emerald-50"
                      : "border-2 border-rose-200 bg-rose-50"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      className="h-5 w-5 text-emerald-600"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <XCircle
                      className="h-5 w-5 text-rose-600"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>

              <div className="mb-4 space-y-3">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswerIndex;
                  const isUserAnswer = optIndex === userAnswerIndex;
                  const isWrongAnswer = isUserAnswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`relative rounded-lg border-2 px-4 py-3 transition-all duration-200 ${
                        isCorrectOption
                          ? " border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                          : isWrongAnswer
                            ? "border-rose-300 bg-rose-50"
                            : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${
                            isCorrectOption
                              ? "text-emerald-900"
                              : isWrongAnswer
                                ? "text-rose-900"
                                : "text-slate-700"
                          }`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2
                                className="h-3 w-3"
                                strokeWidth={2.5}
                              />
                              Correct
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                              <XCircle className="h-3 w-3" strokeWidth={2.5} />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EXPLANATION */}
              {result.explanation && (
                <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                      <BookOpen
                        className="h-4 w-4 text-slate-600"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                        Explanation
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex justify-center">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group relative inline-flex h-12 overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              strokeWidth={2.5}
            />
            Return to Document
          </span>
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;
