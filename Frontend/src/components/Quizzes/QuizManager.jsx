import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../Common/Spinner";
import Button from "../Common/Button";
import Modal from "../Common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../Common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzesForDoc(documentId);
      setQuizzes(data.data);
    } catch (error) {
      toast.error("Failed to fetch quizzes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success("Quiz generated successfully.");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to generate quiz.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      toast.success("Quiz deleted successfully.");
      setIsDeleteModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to delete quiz.");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes yet"
          description="Generate a new quiz from your document to get started."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex justify-end gap-2">
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>

      {renderQuizContent()}

      {/* GENERATE QUIZ */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate new Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-700">
              Number of Questions
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              required
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:border-transparent focus:ring-2 focus:ring-[#00d492] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={generating}>
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuizManager;
