const fs = require('fs');
const { parseRequestInput } = require('../utils/parser');
const factorService = require('../services/factorService');
const riskService = require('../services/riskService');
const recommendationService = require('../services/recommendationService');
const aiService = require('../services/aiService');

/**
 * The main controller for orchestrating the full health analysis pipeline.
 */
const healthController = {
  async completeAnalysis(req, res) {
    try {
      // Step 1: Use the shared utility to parse the input whether it is file, text or json object then call the ocrService  
      const parseResult = await parseRequestInput(req);

      if (parseResult.status !== 'ok') {
        const statusCode = parseResult.status === 'error' ? 400 : 200;
        return res.status(statusCode).json(parseResult);
      }
      console.log(parseResult);
      const { answers } = parseResult;

      // Step 2: Extract health risk factors from the answers.
      const factorResult = await factorService.extractFactors(answers);

      // Step 3: Classify the risk based on the extracted factors.
      const riskResult = await riskService.classifyRisk(factorResult.factors);

      // Step 4: Generate recommendations based on the risk level and factors.
      const recommendationResult = await recommendationService.generateRecommendations(
        riskResult.risk_level,
        factorResult.factors
      );

      // Step 5: Assemble the final, comprehensive response.
      res.json({
        status: 'ok',
        summary: {
          risk_level: riskResult.risk_level,
          risk_score: riskResult.score,
          key_factors: factorResult.factors,
        },
        results: {
          parsing: parseResult,
          factors: factorResult,
          risk: riskResult,
          recommendations: recommendationResult,
        }
      });

    } catch (error) {
      console.error('Error in completeAnalysis pipeline:', error);
      res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred during the analysis.'
      });
    } finally {
      // Ensure the uploaded file is deleted after processing.
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  },

  async getAiAnalysis(req, res) {
    try {
      const parseResult = await parseRequestInput(req);

      if (parseResult.status === 'error') {
        return res.status(400).json(parseResult);
      }

      if (parseResult.status === 'incomplete_profile') {
        return res.status(200).json(parseResult);
      }

      const aiResult = await aiService.getAIAnalysis(JSON.stringify(parseResult.answers));
      console.log(aiResult);
      res.json({
        status: 'ok',
        factors: aiResult.factors,
        risk: aiResult.risk,
        recommendations: aiResult.recommendations,
      });

    } catch (error) {
      console.error('Error in getAiAnalysis:', error);
      res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred during the AI analysis.'
      });
    } finally {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }
};

module.exports = healthController;
