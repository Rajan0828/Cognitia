/**
 * Splits a given text into chunks
 *
 * @param {string} text - The input text to be chunked
 * @param {number} chunkSize - The maximum size of each chunk (default: 1000 characters)
 * @param {number} overlap - The number of characters to overlap between chunks (default: 200 characters)
 * @return {Array<{content: string, chunkIndex: number, pageNumber: number}}
 */
export const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Clean text while preserving paragraph structure
  const cleanedText = text
    .replace(/\r\n/g, '\n') // Normalize newlines
    .replace(/\s+/g, ' ') // Replace multiple whitespace characters with a single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with a single space
    .replace(/ \n/g, '\n') // Remove spaces before newlines
    .trim();

  // Try to split by paragraphs first (single or double newlines)
  const paragraphs = cleanedText.split(/\n+/).filter((p) => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let chunkIndex = 0;
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    // If single paragraph exceeds chunk size, split it by words
    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join('\n\n'),
          chunkIndex: chunkIndex++,
          pageNumber: 0, // Page number can be set if available
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      // Split large paragraph into word-based chunks
      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(' '),
          chunkIndex: chunkIndex++,
          pageNumber: 0, // Page number can be set if available
        });

        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }
    // If adding the paragraph exceeds chunk size, save current chunk
    if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex++,
        pageNumber: 0, // Page number can be set if available
      });

      // Create overlap from previous chunk
      const prevChunkText = currentChunk.join(' ');
      const prevWords = prevChunkText.split(/\s+/);
      const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      // Add paragraph to current chunk
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  // Add any remaining text as a final chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      chunkIndex: chunkIndex,
      pageNumber: 0, // Page number can be set if available
    });
  }

  // Fallback: If no chunks were created, split by words
  if (chunks.length === 0 && cleanedText.length > 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
      const chunkWords = allWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(' '),
        chunkIndex: chunkIndex++,
        pageNumber: 0, // Page number can be set if available
      });

      if (i + chunkSize >= allWords.length) break;
    }
  }

  return chunks;
};

/**
 * Find relevant chunks based on a keyword or query
 * @param {Array<Object>} chunks - Array of chunk objects with content and metadata
 * @param {string} query - The keyword or query to search for
 * @param {number} maxChunks - Maximum number of relevant chunks to return (default: 5)
 * @return {Array<Object>} - Array of relevant chunk objects
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  // Common stop words to exclude from relevance scoring
  const stopWords = new Set([
    'the',
    'is',
    'in',
    'and',
    'to',
    'of',
    'a',
    'that',
    'it',
    'with',
    'as',
    'for',
    'was',
    'on',
    'are',
    'by',
    'this',
    'be',
    'or',
    'from',
    'at',
    'which',
    'but',
    'not',
    'all',
    'we',
    'they',
  ]);

  // Extract and clean query words
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    // Score each query word
    for (const word of queryWords) {
      // Exact word match (higher score)
      const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      score += exactMatches * 3;

      // Partial match (lower score)
      const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    const uniqueWordsFound = queryWords.filter((word) => content.includes(word)).length;
    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    const normalizedScore = score / Math.sqrt(contentWords);
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWordsFound,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.matchedWords !== a.matchedWords) {
        return b.matchedWords - a.matchedWords;
      }
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
