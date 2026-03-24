import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

/**
 * @desc    Generate flashcards from a document
 * @route   POST /api/ai/generate-flashcards
 * @access  Private
 */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count } = req.body;

    // Validate input
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'completed' });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404,
      });
    }

    // Generate flashcards using Gemini API
    const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count));

    // Save flashcards to database
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcards generated successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate quiz from a document
 * @route   POST /api/ai/generate-quiz
 * @access  Private
 */
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 10, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'completed',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not processed yet',
        statusCode: 404,
      });
    }

    // Generate quiz questions using Gemini API
    const questions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions));

    // Save quiz to database
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `Quiz for ${document.title}`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully',
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate document summary
 * @route   POST /api/ai/generate-summary
 * @access  Private
 */
export const generateSummary = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Chat with AI assistant about a document
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chat = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Explain a concept from the document
 * @route   POST /api/ai/explain-concept
 * @access  Private
 */
export const explainConcept = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history for a document
 * @route   POST /api/ai/chat-history/:documentId
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
