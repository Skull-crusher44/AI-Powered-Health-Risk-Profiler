// Rule-based engine for identifying health risk factors from survey data.

/**
 * Defines the rules for mapping survey answers to health risk factors.
 * Each key is the human-readable factor name.
 * 'condition' is a function that returns true if the answers indicate the factor.
 * 'confidence' is a score indicating the reliability of the rule.
 */
const FACTOR_RULES = {
  'smoking': {
    condition: answers => answers.smoker === true,
    confidence: 0.95
  },
  'poor diet': {
    condition: answers => {
      const diet = answers.diet?.toLowerCase() || '';
      return diet.includes('high sugar') || diet.includes('high fat') || diet.includes('processed');
    },
    confidence: 0.90
  },
  'low exercise': {
    condition: answers => {
      const exercise = answers.exercise?.toLowerCase() || '';
      return exercise.includes('rarely') || exercise.includes('never');
    },
    confidence: 0.88
  },
  'age risk': {
    condition: answers => answers.age > 50,
    confidence: 0.85
  },
  'poor sleep': {
    condition: answers => {
      if (!answers.sleep) return false;
      // Extracts the first number from the sleep string.
      const sleepHours = parseInt(String(answers.sleep).match(/\d+/)?.[0]);
      return sleepHours < 6;
    },
    confidence: 0.82
  },
  'high stress': {
    condition: answers => {
      const stress = answers.stress?.toLowerCase() || '';
      return stress.includes('high') || ['4', '5'].includes(stress);
    },
    confidence: 0.85
  },
  'excessive alcohol': {
    condition: answers => {
      const alcohol = answers.alcohol?.toLowerCase() || '';
      return alcohol.includes('daily') || alcohol.includes('heavy');
    },
    confidence: 0.88
  },
  'obesity risk': {
    // NOTE: This is a highly simplified check, not a real BMI calculation.
    // It just looks for a high weight value (e.g., > 100kg) or a mention of 'obese'.
    condition: answers => {
      if (!answers.weight) return false;
      const weightStr = String(answers.weight).toLowerCase();
      const weightKg = parseFloat(weightStr.match(/[\d.]+/)?.[0]);
      return weightKg > 100 || weightStr.includes('obese');
    },
    confidence: 0.70
  }
};

/**
 * Extracts health risk factors from survey answers using the defined rules.
 * @param {object} answers - An object containing the survey answers.
 * @returns {Promise<object>} An object with the extracted factors and a calculated confidence score.
 */
const extractFactors = async (answers) => {
  const extractedFactors = [];
  const confidences = [];

  // Iterate over each rule and check if the condition is met.
  for (const [factor, rule] of Object.entries(FACTOR_RULES)) {
    try {
      if (rule.condition(answers)) {
        extractedFactors.push(factor);
        confidences.push(rule.confidence);
      }
    } catch (err) {
      // if any erro in parsing factor occur 
      console.error(`Error evaluating rule for factor: "${factor}"`, err);
    }
  }

  // Calculate the average confidence score. If no factors are found, confidence is 0.
  const overallConfidence = confidences.length
    ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
    : 0;

  return {
    factors: extractedFactors,
    confidence: parseFloat(overallConfidence.toFixed(2)),
  };
};

module.exports = {
  extractFactors,
};