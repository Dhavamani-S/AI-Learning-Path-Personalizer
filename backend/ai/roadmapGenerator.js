// ✅ ROADMAP GENERATOR — Progressive Difficulty
const topicDatabase = require("./topicDatabase");
const ruleFilter = require("./ruleFilter");
const weightedScoring = require("./weightedScoring");
const { semanticSimilarity } = require("./semanticSimilarity");
const { generateTopicsForField } = require("./topicGenerator");

const generateRoadmap = async (userInput) => {
  const { duration, experience, masteryLevel, targetField } = userInput;

  const totalDays = duration * 30;

  // ✅ Check static database
  const normalizedField = targetField.toLowerCase().trim();
  const staticMatch = topicDatabase.filter(t =>
    t.field.includes(normalizedField) ||
    normalizedField.includes(t.field) ||
    t.keywords.some(k => normalizedField.includes(k))
  );

  let sourceDatabase;
  let isStaticDomain = false;

  if (staticMatch.length > 0) {
    isStaticDomain = true;
    console.log(`Static match found for: ${targetField}`);
    sourceDatabase = topicDatabase;
  } else {
    console.log(`Unknown domain: ${targetField} — generating via Gemini...`);
    sourceDatabase = await generateTopicsForField(targetField, experience, masteryLevel);
  }

  // ✅ Step 1 — Rule Filter
  const filteredTopics = ruleFilter(sourceDatabase, userInput);

  // ✅ Step 2 — Weighted Scoring
  const scoredTopics = weightedScoring(filteredTopics, userInput);

  // ✅ Step 3 — Semantic Similarity
  const rankedTopics = semanticSimilarity(scoredTopics, userInput);

  // ✅ Split topics by difficulty (for static database)
  const beginnerTopics = rankedTopics.filter(t =>
    t.level.includes("Beginner") && !t.level.includes("Intermediate") && !t.level.includes("Advanced")
  );
  const intermediateTopics = rankedTopics.filter(t =>
    t.level.includes("Intermediate") && !t.level.includes("Advanced")
  );
  const advancedTopics = rankedTopics.filter(t =>
    t.level.includes("Advanced")
  );

  // ✅ Calculate phase percentages based on experience + mastery
  let beginnerPercent, intermediatePercent, advancedPercent;

  if (experience === "Beginner") {
    if (masteryLevel === "Basic") {
      beginnerPercent = 0.70; intermediatePercent = 0.30; advancedPercent = 0.00;
    } else if (masteryLevel === "Professional") {
      beginnerPercent = 0.40; intermediatePercent = 0.40; advancedPercent = 0.20;
    } else {
      beginnerPercent = 0.25; intermediatePercent = 0.40; advancedPercent = 0.35;
    }
  } else if (experience === "Intermediate") {
    if (masteryLevel === "Basic") {
      beginnerPercent = 0.20; intermediatePercent = 0.60; advancedPercent = 0.20;
    } else if (masteryLevel === "Professional") {
      beginnerPercent = 0.10; intermediatePercent = 0.50; advancedPercent = 0.40;
    } else {
      beginnerPercent = 0.00; intermediatePercent = 0.40; advancedPercent = 0.60;
    }
  } else {
    if (masteryLevel === "Basic") {
      beginnerPercent = 0.00; intermediatePercent = 0.40; advancedPercent = 0.60;
    } else if (masteryLevel === "Professional") {
      beginnerPercent = 0.00; intermediatePercent = 0.20; advancedPercent = 0.80;
    } else {
      beginnerPercent = 0.00; intermediatePercent = 0.10; advancedPercent = 0.90;
    }
  }

  const beginnerDays = Math.round(totalDays * beginnerPercent);
  const intermediateDays = Math.round(totalDays * intermediatePercent);
  const advancedDays = totalDays - beginnerDays - intermediateDays;

  const daysPerTopicMap = { Basic: 2, Professional: 3, Expert: 4 };
  const daysPerTopic = daysPerTopicMap[masteryLevel] || 2;

  // ✅ Generate modules
  const modules = [];
  let currentDay = 1;

  const generatePhaseModules = (topics, phaseDays, phaseLabel) => {
    if (phaseDays <= 0 || topics.length === 0) return;

    let dayCount = 0;
    let topicIndex = 0;

    while (dayCount < phaseDays) {
      const topic = topics[topicIndex % topics.length];
      const subtopicsForTopic = topic.subtopics;
      const subtopicsPerDay = Math.ceil(subtopicsForTopic.length / daysPerTopic);

      for (let d = 0; d < daysPerTopic && dayCount < phaseDays; d++) {
        const startIdx = d * subtopicsPerDay;
        const endIdx = startIdx + subtopicsPerDay;
        const daySubtopics = subtopicsForTopic.slice(startIdx, endIdx);
        const subtopic = daySubtopics.join(" & ") || subtopicsForTopic[0];

        modules.push({
          day: currentDay,
          phase: phaseLabel,
          topic: topic.topic,
          subtopic: subtopic,
          duration: topic.duration,
          resources: [],
          isCompleted: false,
        });

        currentDay++;
        dayCount++;
      }

      topicIndex++;
    }
  };

  // ✅ FIXED — clean if/else, no duplication
if (!isStaticDomain) {
  // ✅ Now Gemini topics have proper levels — use same level-based splitting
  const geminiBeginners = rankedTopics.filter(t =>
    t.level.includes("Beginner") && !t.level.includes("Intermediate") && !t.level.includes("Advanced")
  );
  const geminiIntermediate = rankedTopics.filter(t =>
    t.level.includes("Intermediate") && !t.level.includes("Advanced")
  );
  const geminiAdvanced = rankedTopics.filter(t =>
    t.level.includes("Advanced")
  );

  generatePhaseModules(geminiBeginners.length > 0 ? geminiBeginners : rankedTopics, beginnerDays, "Beginner");
  generatePhaseModules(geminiIntermediate.length > 0 ? geminiIntermediate : rankedTopics, intermediateDays, "Intermediate");
  generatePhaseModules(geminiAdvanced.length > 0 ? geminiAdvanced : rankedTopics, advancedDays, "Advanced");
} else {
    // Static database — use level-based splitting
    generatePhaseModules(
      beginnerTopics.length > 0 ? beginnerTopics : rankedTopics,
      beginnerDays,
      "Beginner"
    );
    generatePhaseModules(
      intermediateTopics.length > 0 ? intermediateTopics : rankedTopics,
      intermediateDays,
      "Intermediate"
    );
    generatePhaseModules(
      advancedTopics.length > 0 ? advancedTopics : rankedTopics,
      advancedDays,
      "Advanced"
    );
  }

  return { totalDays, modules };
};

module.exports = generateRoadmap;