const factorService = require('../services/factorService');

/**
 * Controller for handling factor extraction from health survey answers.
 */
const factorController = {
  /**
   * Receives survey answers, validates the input, and passes it to the
   * factor service for extraction.
   */
  async extractFactors(req, res) {
    try {
      const { answers } = req.body;

      // Basic validation to ensure the 'answers' object exists and is not empty.
      if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Request body must contain a non-empty "answers" object.'
        });
      }

      // Delegate the core logic to the service layer.
      const factorResult = await factorService.extractFactors(answers);
      
      // Send the successful response.
      res.json(factorResult);

    } catch (error) {
      console.error('Error in factorController.extractFactors:', error);
      res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred.'
      });
    }
  }
};

module.exports = factorController;
