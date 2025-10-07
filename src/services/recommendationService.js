
/**
 * A map of risk factors to specific, actionable, non-diagnostic recommendations.
 */
const RECOMMENDATION_MAP = {
  'smoking': 'Consider smoking cessation programs or consult a healthcare provider for support.',
  'poor diet': 'Incorporate more fruits, vegetables, and whole grains into your diet. Reduce processed foods.',
  'low exercise': 'Aim for at least 30 minutes of moderate physical activity, like brisk walking, most days of the week.',
  'age risk': 'Schedule regular preventive health check-ups with your doctor.',
  'poor sleep': 'Establish a regular sleep schedule and aim for 7-9 hours of quality sleep per night.',
  'high stress': 'Practice stress-reduction techniques such as mindfulness, meditation, or yoga.',
  'excessive alcohol': 'Reduce alcohol intake to moderate levels as defined by health guidelines.',
  'obesity risk': 'Consult with a healthcare provider or a registered dietitian to create a healthy weight management plan.',
};

/**
 * Generates a list of health recommendations based on risk factors and risk level.
 * This function implements the core logic for Step 4: Recommendations.
 */
const generateRecommendations = async (riskLevel, factors) => {
  // Using a Set ensures that we don't have duplicate recommendations.
  const recommendations = new Set();

  // Add recommendations for each specific factor identified.
  factors.forEach(factor => {
    if (RECOMMENDATION_MAP[factor]) {
      recommendations.add(RECOMMENDATION_MAP[factor]);
    }
  });

  // Add a general recommendation based on the overall risk level.
  if (riskLevel === 'high') {
    recommendations.add('Given the high risk level, it is crucial to consult a healthcare professional for a comprehensive evaluation.');
  } else if (riskLevel === 'medium') {
    recommendations.add('Regular monitoring and consistent lifestyle improvements are recommended.');
  } else {
    if (recommendations.size === 0) {
      recommendations.add('Continue to maintain your healthy lifestyle and schedule regular check-ups.');
    }
  }

  return {
    risk_level: riskLevel,
    factors: factors,
    recommendations: [...recommendations], // Convert the Set back to an array for the JSON response.
  };
};

module.exports = {
  generateRecommendations,
};
