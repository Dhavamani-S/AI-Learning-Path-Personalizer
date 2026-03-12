// ✅ STEP 2 — Weighted Scoring
// Ranks filtered topics based on relevance to user input
// Higher score = more relevant = shown earlier in roadmap

const weightedScoring = (filteredTopics, userInput) => {
  const { targetField, experience, masteryLevel, description } = userInput;

  const normalizedField = targetField.toLowerCase().trim();
  const normalizedDesc = description ? description.toLowerCase().trim() : "";

  // ✅ Score each topic
  const scored = filteredTopics.map((topic) => {
    let score = 0;

    // 1️⃣ Base weight from topic database (already set per topic)
    score += topic.weight;

    // 2️⃣ Exact field match bonus
    if (topic.field === normalizedField) {
      score += 20;
    }

    // 3️⃣ Keyword match with target field
    const fieldKeywordMatches = topic.keywords.filter((kw) =>
      normalizedField.includes(kw) || kw.includes(normalizedField)
    ).length;
    score += fieldKeywordMatches * 5;

    // 4️⃣ Experience level match bonus
    const experienceBonus = {
      Beginner: { Beginner: 10, Intermediate: 3, Advanced: 0 },
      Intermediate: { Beginner: 5, Intermediate: 10, Advanced: 3 },
      Advanced: { Beginner: 2, Intermediate: 5, Advanced: 10 },
    };
    topic.level.forEach((lvl) => {
      score += experienceBonus[experience]?.[lvl] || 0;
    });

    // 5️⃣ Mastery level bonus
    const masteryBonus = {
      Basic: { Beginner: 10, Intermediate: 0, Advanced: 0 },
      Professional: { Beginner: 5, Intermediate: 10, Advanced: 3 },
      Expert: { Beginner: 3, Intermediate: 7, Advanced: 10 },
    };
    topic.level.forEach((lvl) => {
      score += masteryBonus[masteryLevel]?.[lvl] || 0;
    });

    // 6️⃣ Description keyword match bonus (if user described their goal)
    if (normalizedDesc) {
      const descMatches = topic.keywords.filter((kw) =>
        normalizedDesc.includes(kw)
      ).length;
      score += descMatches * 8;
    }

    return { ...topic, score };
  });

  // ✅ Sort by score descending (highest relevance first)
  scored.sort((a, b) => b.score - a.score);

  return scored;
};

module.exports = weightedScoring;