const ocrService = require('../services/ocrService');

/**
 * it check whether input is file or text or json input 
 */
const parseRequestInput = async (req) => {
  // Case 1: The request contains an image file.
  if (req.file) {
    return await ocrService.parseImage(req.file.path);
  }

  // Case 2: The request contains a body.
  if (req.body) {
    let text;
    // Check for a JSON body with a 'text' key.
    if (req.is('application/json') && req.body.text) {
      text = req.body.text;
    } 
    // Check for a plain text body.
    else if (req.is('text/plain') && typeof req.body === 'string') {
      text = req.body;
    }

    if (text) {
      const answers = await ocrService.parseAndNormalize(text);
      const foundFields = Object.keys(answers).filter(key => answers[key] !== null && answers[key] !== '');
      const missingFields = ocrService.expectedFields.filter(field => !foundFields.includes(field));

      if (missingFields.length > ocrService.expectedFields.length * 0.5) {
        return {
          status: 'incomplete_profile',
          reason: '>50% fields missing',
          missing_fields: missingFields,
        };
      }

      return {
        status: 'ok',
        answers,
        missing_fields: missingFields,
      };
    }
  }

  // If no valid input is found, return a standard error object.
  return {
    status: 'error',
    message: 'Request must contain an image file or a valid text body.',
  };
};

module.exports = {
  parseRequestInput,
};
