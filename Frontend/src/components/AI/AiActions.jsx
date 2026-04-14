import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import Modal from "../Common/Modal";
import MarkdownRenderer from "../Common/MarkdownRenderer";

const AiActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");

    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary");
      console.log(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain");
      return;
    }

    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept,
      );
      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to explain concept");
      console.log(error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        {/* HEADER */}
        <div className="border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-500">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* GENERATE SUMMARY */}
          <div className="group rounded-xl border border-slate-200/60 bg-linear-to-br to-white p-5 transition-all duration-200 hover:border-slate-300/60 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-100 to-cyan-100">
                    <BookOpen
                      className="h-4 w-4 text-blue-600"
                      strokeWidth={2}
                    />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    Generate Summary
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Generate a summary of the document
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="h-10 shrink-0 rounded-xl bg-linear-to-r from-teal-500 to-teal-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-teal-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Loading...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* EXPLAIN CONCEPT */}
          <div className="group rounded-xl border border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white p-5 transition-all duration-200 hover:border-slate-300/60 hover:shadow-md">
            <form onSubmit={handleExplainConcept}>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-b from-amber-100 to-orange-100">
                  <Lightbulb
                    className="h-4 w-4 text-amber-600"
                    strokeWidth={2}
                  />
                </div>
                <h4 className="font-semibold text-slate-900">
                  Explain a Concept
                </h4>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                Enter a topic or concept from the document to get a detailed
                explanation.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder='e.g. "Artificial Intelligence"'
                  className="h-11 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-purple-500/10 focus:outline-none"
                  disabled={loadingAction === "explain"}
                />
                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className="h-11 shrink-0 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingAction === "explain" ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Loading...
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* RESULT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="prose prose-sm prose-slate max-h-[60vh] max-w-none overflow-y-auto">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AiActions;
