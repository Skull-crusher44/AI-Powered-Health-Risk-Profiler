const riskService = require('../services/riskService');

/**
 * Controller for handling health risk classification.
 */
const riskController = {
  /**
   * Receives a list of health factors, validates the input, and passes it
   * to the risk service for classification.
   */
  async classifyRisk(req, res) {
    try {
      const { factors } = req.body;

      // Basic validation to ensure 'factors' is a non-empty array.
      if (!factors || !Array.isArray(factors)) {
        return res.status(400).json({
          status: 'error',
          message: 'Request body must contain a "factors" array.'
        });
      }

      // If the factors array is empty, we can return a default low-risk response.
      if (factors.length === 0) {
        return res.json({
          risk_level: 'low',
          score: 0,
          rationale: ['No risk factors provided.']
        });
      }

      // Delegate the core logic to the service layer.
      const riskResult = await riskService.classifyRisk(factors);
      
      // Send the successful response.
      res.json(riskResult);

    } catch (error) {
      // Log the error and return a generic server error message.
      console.error('Error in riskController.classifyRisk:', error);
      res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred.'
      });
    }
  }
};

module.exports = riskController;
