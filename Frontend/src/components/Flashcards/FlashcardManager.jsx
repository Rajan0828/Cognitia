import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../../components/Common/Spinner";
import Modal from "../../components/Common/Modal";
import Flashcard from "../../components/Flashcards/Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDoc(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully.");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length,
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length,
      );
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to review flashcard.");
      console.error(error);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId
              ? { ...card, isStarred: !card.isStarred }
              : card,
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success("Flashcard starred status updated");
    } catch (error) {
      toast.error(error.message || "Failed to toggle star.");
      console.error(error);
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted successfully.");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    return (
      <div className="space-y-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-emerald-600"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/* FLASHCARD DISPLAY */}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* NAVIGATION CONTROLS */}
          <div className="flex items-center gap-6">
            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-100"
            >
              <ChevronLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                strokeWidth={2.5}
              />
              Previous
            </button>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-sm font-semibold text-slate-700">
                {currentCardIndex + 1} {""}
                <span className="font-normal text-slate-400"></span> {" / "}
                {selectedSet.cards.length}
              </span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-100"
            >
              Next
              <ChevronRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100">
            <Brain className="h-8 w-8 text-emerald-600" strokeWidth={2} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            No Flashcards Yet
          </h3>
          <p className="mb-8 max-w-sm text-center text-sm text-slate-500">
            Generate flashcards from your document to start learning and
            reinforce your knowledge
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            {generating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* HEADER WITH GENERATE BUTTON */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {flashcardSets.length} {""}
              {flashcardSets.length === 1 ? "set" : "sets"} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            {generating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" strokeWidth={2} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        {/* FLASHCARD SETS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative cursor-pointer rounded-2xl border-2 border-slate-200 bg-white/80 p-6 backdrop-blur-xl transition-all duration-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>

              {/* SET CONTENT */}
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
                  <Brain className="h-6 w-6 text-emerald-600" strokeWidth={2} />
                </div>

                <div>
                  <h4 className="mb-1 text-base font-semibold text-slate-900">
                    Flashcard Set
                  </h4>
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                    <span className="text-sm font-semibold text-emerald-700">
                      {set.cards.length}
                      {""}
                      {set.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="h-11 rounded-xl bg-linear-to-r from-rose-500 to-red-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:from-rose-600 hover:to-red-600 hover:shadow-xl hover:shadow-rose-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
