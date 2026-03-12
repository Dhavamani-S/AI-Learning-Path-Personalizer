// ✅ STEP 3 — Semantic Similarity
// Fine-tunes topic recommendations using text meaning
// Phase 1: Keyword-based similarity (works now, no API cost)
// Phase 2: Can be upgraded to OpenAI/Gemini embeddings later

// ✅ Synonym map — maps common variations to standard keywords
const synonymMap = {
  // Web Development
  "web dev": "web development",
  "frontend": "web development",
  "front end": "web development",
  "backend": "web development",
  "back end": "web development",
  "fullstack": "web development",
  "full stack": "web development",
  "mern": "web development",
  "mean": "web development",
  "react": "web development",
  "node": "web development",
  "nodejs": "web development",
  "html css": "web development",

  // Data Science
  "data analysis": "data science",
  "data analytics": "data science",
  "data analyst": "data science",
  "business intelligence": "data science",
  "bi": "data science",
  "data engineer": "data science",

  // AI / ML
  "ai": "artificial intelligence",
  "ml": "artificial intelligence",
  "machine learning": "artificial intelligence",
  "deep learning": "artificial intelligence",
  "nlp": "artificial intelligence",
  "computer vision": "artificial intelligence",
  "generative ai": "artificial intelligence",
  "llm": "artificial intelligence",
  "chatbot": "artificial intelligence",

  // Cybersecurity
  "cyber security": "cybersecurity",
  "ethical hacking": "cybersecurity",
  "hacking": "cybersecurity",
  "penetration testing": "cybersecurity",
  "pen testing": "cybersecurity",
  "network security": "cybersecurity",
  "infosec": "cybersecurity",

  // Mobile
  "mobile app": "mobile development",
  "android": "mobile development",
  "ios": "mobile development",
  "flutter": "mobile development",
  "react native": "mobile development",
  "app development": "mobile development",

  // Cloud
  "cloud": "cloud computing",
  "aws": "cloud computing",
  "azure": "cloud computing",
  "gcp": "cloud computing",
  "google cloud": "cloud computing",
  "devops": "cloud computing",
  "docker": "cloud computing",
  "kubernetes": "cloud computing",
};

// ✅ Normalize user input using synonym map
const normalizeInput = (input) => {
  const lower = input.toLowerCase().trim();

  // Check if any synonym matches
  for (const [synonym, standard] of Object.entries(synonymMap)) {
    if (lower.includes(synonym)) {
      return standard;
    }
  }

  return lower; // Return as-is if no synonym found
};

// ✅ Calculate similarity score between two strings
// Uses character-level overlap (Jaccard similarity)
const calculateSimilarity = (str1, str2) => {
  const set1 = new Set(str1.toLowerCase().split(" "));
  const set2 = new Set(str2.toLowerCase().split(" "));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size; // 0 to 1
};

// ✅ Main semantic similarity function
// Re-ranks scored topics using text similarity
const semanticSimilarity = (scoredTopics, userInput) => {
  const { targetField, description } = userInput;

  // Normalize user input
  const normalizedField = normalizeInput(targetField);
  const normalizedDesc = description
    ? normalizeInput(description)
    : "";

  const reRanked = scoredTopics.map((topic) => {
    let semanticScore = topic.score;

    // 1️⃣ Similarity between topic field and user target field
    const fieldSimilarity = calculateSimilarity(topic.field, normalizedField);
    semanticScore += fieldSimilarity * 15;

    // 2️⃣ Similarity between topic name and user target field
    const topicSimilarity = calculateSimilarity(topic.topic, normalizedField);
    semanticScore += topicSimilarity * 10;

    // 3️⃣ Similarity with description if provided
    if (normalizedDesc) {
      const descSimilarity = calculateSimilarity(topic.topic, normalizedDesc);
      semanticScore += descSimilarity * 12;

      // Also check subtopics against description
      const subtopicSimilarity = topic.subtopics.reduce((max, subtopic) => {
        const sim = calculateSimilarity(subtopic, normalizedDesc);
        return Math.max(max, sim);
      }, 0);
      semanticScore += subtopicSimilarity * 8;
    }

    // 4️⃣ Keyword similarity boost
    const keywordSimilarities = topic.keywords.map((kw) =>
      calculateSimilarity(kw, normalizedField)
    );
    const maxKeywordSim = Math.max(...keywordSimilarities);
    semanticScore += maxKeywordSim * 10;

    return { ...topic, finalScore: semanticScore };
  });

  // ✅ Sort by final score descending
  reRanked.sort((a, b) => b.finalScore - a.finalScore);

  return reRanked;
};

// ✅ Export both functions
module.exports = { semanticSimilarity, normalizeInput };