// ✅ STEP 1 — Rule Filter
// Removes completely irrelevant topics based on user input
// Filters by: target field + experience level

const ruleFilter = (topics, userInput) => {
  const { targetField, experience, masteryLevel } = userInput;

  // ✅ Normalize user input to lowercase for matching
  const normalizedField = targetField.toLowerCase().trim();

  // ✅ Map mastery level to experience levels to include
  const masteryLevelMap = {
    Basic: ["Beginner"],
    Professional: ["Beginner", "Intermediate"],
    Expert: ["Beginner", "Intermediate", "Advanced"],
  };

  // ✅ Map experience to allowed levels
  const experienceLevelMap = {
    Beginner: ["Beginner"],
    Intermediate: ["Beginner", "Intermediate"],
    Advanced: ["Beginner", "Intermediate", "Advanced"],
  };

  // ✅ Combine experience + mastery to get allowed levels
  const allowedByExperience = experienceLevelMap[experience] || ["Beginner"];
  const allowedByMastery = masteryLevelMap[masteryLevel] || ["Beginner"];

  // Use the broader of the two
  const allowedLevels = allowedByMastery.length >= allowedByExperience.length
    ? allowedByMastery
    : allowedByExperience;

  // ✅ Filter topics
  const filtered = topics.filter((topic) => {

    // 1️⃣ Check if topic field matches user input (exact or partial)
    const fieldMatch =
      topic.field.includes(normalizedField) ||
      normalizedField.includes(topic.field) ||
      topic.keywords.some((kw) => normalizedField.includes(kw)) ||
      topic.keywords.some((kw) => kw.includes(normalizedField));

    // 2️⃣ Check if topic level is allowed based on experience + mastery
    const levelMatch = topic.level.some((lvl) => allowedLevels.includes(lvl));

    return fieldMatch && levelMatch;
  });

  // ✅ If no match found (unknown field), return all topics that match experience
  // This handles edge cases like "Game Development" not in our database
  if (filtered.length === 0) {
    return topics.filter((topic) =>
      topic.level.some((lvl) => allowedLevels.includes(lvl))
    );
  }

  return filtered;
};

module.exports = ruleFilter;