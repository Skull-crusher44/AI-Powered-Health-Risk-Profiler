// A simple, rule-based engine for classifying health risk based on factors.

/**
 * Defines the scoring weights for each identified risk factor.
 */
const FACTOR_WEIGHTS = {
  'smoking': 25,
  'poor diet': 20,
  'low exercise': 18,
  'age risk': 15,
  'poor sleep': 10,
  'high stress': 12,
  'excessive alcohol': 15,
  'obesity risk': 20,
};

/**
 * Provides a map where we store that why each factor is a risk.
 */
const RATIONALE_MAP = {
  'smoking': 'Tobacco use is a major contributor to health risk.',
  'poor diet': 'A diet high in processed foods, fat, or sugar increases health risks.',
  'low exercise': 'A sedentary lifestyle is a significant health risk factor.',
  'age risk': 'Age over 50 is a non-modifiable risk factor.',
  'poor sleep': 'Lack of adequate sleep can impact overall health.',
  'high stress': 'Chronic high stress levels negatively affect health.',
  'excessive alcohol': 'Excessive alcohol consumption is a known health risk.',
  'obesity risk': 'Obesity is linked to a variety of chronic diseases.',
};

/**
 * Calculates a risk score and determines a risk level based on a list of factors.
*/

const classifyRisk = async (factors) => {
  // Calculate the total score by summing the weights of the input factors.
  const score = factors.reduce((total, factor) => {
    return total + (FACTOR_WEIGHTS[factor] || 0);
  }, 0);

  // Determine the risk level based on the final score.
  let riskLevel;
  if (score > 60) {
    riskLevel = 'high';
  } else if (score > 30) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  // The rationale is a list of explanations for each factor found.
  const rationale = factors
    .filter(factor => FACTOR_WEIGHTS[factor]) // Only include factors that contributed to the score
    .map(factor => RATIONALE_MAP[factor] || `The factor "${factor}" contributes to overall risk.`); // Map each factor to its explanation

  return {
    risk_level: riskLevel,
    score: Math.min(score, 100), // Ensure score doesn't exceed 100
    rationale: rationale,
  };
};

module.exports = {
  classifyRisk,
};