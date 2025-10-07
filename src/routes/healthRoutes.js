const express = require('express');
const multer = require('multer');
const router = express.Router();

// Import controllers - Each handles specific domain
const healthController = require('../controllers/healthController');
const ocrController = require('../controllers/ocrController');
const factorController = require('../controllers/factorController');
const riskController = require('../controllers/riskController');
const recommendationController = require('../controllers/recommendationController');

// Simple file upload middleware
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff/;
    const fileType = allowedTypes.test(file.mimetype.toLowerCase());
    if (fileType) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Main endpoints - Each controller handles its specific responsibility
router.post('/analyze', upload.single('image'), healthController.completeAnalysis);
router.post('/ai-analysis', upload.single('image'), healthController.getAiAnalysis);
router.post('/parse', upload.single('image'), ocrController.parseImage);
router.post('/factors', factorController.extractFactors);
router.post('/risk', riskController.classifyRisk);
router.post('/recommendations', recommendationController.generateRecommendations);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Health Risk Profiler API',
    endpoints: [
      'POST /api/health/analyze - Complete analysis',
      'POST /api/health/ai-analysis - Complete analysis using ai',
      'POST /api/health/parse - OCR parsing only', 
      'POST /api/health/factors - Extract factors',
      'POST /api/health/risk - Classify risk',
      'POST /api/health/recommendations - Get recommendations'
    ]
  });
});

module.exports = router;