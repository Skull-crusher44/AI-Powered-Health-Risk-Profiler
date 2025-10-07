const fs = require('fs');
const { parseRequestInput } = require('../utils/parser');

/**
 * The controller responsible for the OCR parsing step.
 * It now uses a shared utility to handle the request.
 */
const ocrController = {
  /**
   * Handles a request to parse survey data from an image or text,
   * using the shared input parser utility.
   */
  async parseImage(req, res) {
    try {
      // utility will check whether input is file, text or json object 
      const parseResult = await parseRequestInput(req);

      // The utility returns a status, which we can use to send the right response.
      if (parseResult.status === 'error') {
        return res.status(400).json(parseResult);
      }
      
      // For 'ok' or 'incomplete_profile', send a 200 OK response.
      res.json(parseResult);

    } catch (error) {
      console.error('Error in ocrController.parseImage:', error);
      res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
    } finally {
      // The controller is responsible for cleaning up the file created by multer.
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }
};

module.exports = ocrController;