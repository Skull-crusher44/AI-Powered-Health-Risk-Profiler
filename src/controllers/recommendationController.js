const recommendationService = require('../services/recommendationService');

/**
 * Controller for generating health recommendations.
 */
const recommendationController = {
  /**
   * Receives a risk level and a list of factors, validates the input,
   * and passes it to the recommendation service.
   */
  async generateRecommendations(req, res) {
    try {
      const { risk_level, factors } = req.body;

      // Basic validation to ensure required fields are present and have the correct type.
      if (!risk_level || typeof risk_level !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Request body must contain a "risk_level" string.'
        });
      }
      if (!factors || !Array.isArray(factors)) {
        return res.status(400).json({
          status: 'error',
          message: 'Request body must contain a "factors" array.'
        });
      }

      // send the core logic to the service layer.
      const recommendationResult = await recommendationService.generateRecommendations(risk_level, factors);
      
      // Send the successful response.
      res.json(recommendationResult);

    } catch (error) {
      // Log the error and return a generic server error message.
      console.error('Error in recommendationController.generateRecommendations:', error);
      res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred.'
      });
    }
  }
};

module.exports = recommendationController;
