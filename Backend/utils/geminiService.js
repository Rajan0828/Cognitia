import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in environment variables.');
  process.exit(1);
}

/**
 * Generate flashcards from text
 * @param {string} text - The input text to generate flashcards from
 * @param {number} numCards - The number of flashcards to generate
 * @return {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count}educational flashcards from the following text.
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [Concise, accurate answer]
    D: [Difficulty level: Easy, Medium, Hard]
    
    Separate each flashcard with "---"
    
    Text:
    ${text.substring(0, 15000)}`; // Limit input to 15k characters

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;

    // Parse the generated text into flashcard objects
    const flaschards = [];
    const cards = generatedText.split('---').filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split('\n');
      let question = '',
        answer = '',
        difficulty = 'medium';

      for (const line of lines) {
        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          answer = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flaschards.push({ question, answer, difficulty });
      }
    }

    return flaschards.slice(0, count); // Return only the requested number of flashcards
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Generate quiz questions
 * @param {string} text - The input text to generate quiz questions from
 * @param {number} numQuestions - The number of quiz questions to generate
 * @return {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple-choice quiz questions from the following text.
    Format each question as:
    Q: [Question]
    Q1: [Option 1]
    Q2: [Option 2]
    Q3: [Option 3]
    Q4: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explanation of the correct answer]
    D: [Difficulty level: Easy, Medium, Hard]
    
    Separate each question with "---"
    
    Text:
    ${text.substring(0, 15000)}`; // Limit input to 15k characters

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;

    const questions = [];
    const questionBlocks = generatedText.split('---').filter((q) => q.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split('\n');
      let question = '',
        options = [],
        correctAnswer = '',
        explanation = '',
        difficulty = 'medium';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('Q:')) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.matches(/^0\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith('C:')) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('E:')) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('D:')) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({ question, options, correctAnswer, explanation, difficulty });
      }
    }
    return questions.slice(0, numQuestions); // Return only the requested number of questions
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate quiz');
  }
};

/**
 * Generate a summary of the document
 * @param {string} text - The input text to generate a summary from
 * @return {Promise<string>}
 */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text, highlighting the key points, main ideas and important points. Keep the summary clear and structured, using bullet points if necessary.

    Text:
    ${text.substring(0, 20000)}`; // Limit input to 20k characters

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary');
  }
};

/**
 * Chat with AI assistant about a document
 * @param {string} question - The user's question about the document
 * @param {string} chunks - Relevant text chunks from the document to provide context for the AI
 * @return {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {
  const prompt = `Based on the following context from a documment, analyse the context and answer the user's question. If the answer is not in the context, say "I don't know". Be concise and accurate in your response.

  Context:
  ${context}

  Question: ${question}

  Answer:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to chat with AI');
  }
};

/**
 * Explain a concept from the document
 * @param {string} concept - The concept to explain
 * @param {string} context - Relevant context from the document to provide background for the explanation
 * @return {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
  const prompt = `Explain the concept of "${concept}" based on the following context from a document. Provide a clear and concise explanation suitable for someone learning the concept for the first time. Include examples if relevant.

  Context:
  ${context.substring(0, 20000)}`; // Limit input to 20k characters

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to explain concept');
  }
};
