const { createWorker } = require('tesseract.js');

    const expectedFields = [
    'age', 'smoker', 'exercise', 'diet',
    'sleep', 'stress', 'alcohol', 'weight',
    'height'
    ];

    /**
     * A helper function to clean up common OCR garbage from text values.
     */
    const sanitizeValue = (text) => {
    if (!text) return '';
    // Removes many common OCR noise characters, while keeping relevant ones.
    return text.trim().replace(/[^a-zA-Z0-9\s\/\-().,&]/g, '');
    };

    /**
     * Parses the raw text from OCR to find answers to survey questions.
     * This version uses more robust regex to find and clean each value.
     */
    const parseAndNormalize = (text) => {
    const answers = {};
    // Process the entire text block at once to be more resilient to formatting.
    const normalizedText = text.toLowerCase();

    // Age: Find number
    let match = normalizedText.match(/age:?\s*(\d+)/);
    if (match) answers.age = parseInt(match[1], 10);

    // Smoker: Find boolean-like words
    match = normalizedText.match(/smoker:?\s*(yes|no|true|false|y|n)/);
    if (match) answers.smoker = ['yes', 'true', 'y'].includes(match[1]);

    // Diet: Find the line and sanitize it
    match = normalizedText.match(/diet:?\s*([^\n\r]+)/);
    if (match) {
        let diet = sanitizeValue(match[1]);
        if (diet.includes('sugar')) diet = 'high sugar';
        else if (diet.includes('balanced')) diet = 'balanced';
        answers.diet = diet;
    }

    // Sleep: Find the line and try to extract the core info
    match = normalizedText.match(/sleep:?\s*([^\n\r]+)/);
    if (match) {
        const sleepMatch = match[1].match(/(\d+-\d+|\d+)\s*hours?/);
        answers.sleep = sleepMatch ? sleepMatch[0] : sanitizeValue(match[1]);
    }

    // Stress: Find the line and extract a rating
    match = normalizedText.match(/stress:?\s*([^\n\r]+)/);
    if (match) {
        const stressMatch = match[1].match(/(\d+|low|medium|high)/);
        answers.stress = stressMatch ? stressMatch[0] : sanitizeValue(match[1]);
    }

    // Alcohol: Find and sanitize, fixing common typos
    match = normalizedText.match(/alcohol:?\s*([^\n\r]+)/);
    if (match) {
        answers.alcohol = sanitizeValue(match[1]).replace('veek', 'week');
    }

    // Weight: Find and sanitize
    match = normalizedText.match(/weight:?\s*([^\n\r]+)/);
    if (match) {
        answers.weight = sanitizeValue(match[1]);
    }

    // Height
    match = normalizedText.match(/height:?\s*([^\n\r]+)/);
        if (match) answers.height = sanitizeValue(match[1]);
        
    return answers;
    };

    const parseImage = async (imagePath) => {
    let worker;
    try {
        console.log(`Starting OCR processing for: ${imagePath}`);
        
        worker = await createWorker('eng');
        const { data: { text, confidence } } = await worker.recognize(imagePath);
        
        console.log(`Extracted text:\n${text}`);
        console.log(` OCR Confidence: ${confidence}%`);

        const answers = parseAndNormalize(text);

        const foundFields = Object.keys(answers).filter(key => answers[key] !== null && answers[key] !== '');
        const missingFields = expectedFields.filter(field => !foundFields.includes(field));
        
        const overallConfidence = confidence > 80 ? 0.9 : (confidence / 100).toFixed(2);

        if (missingFields.length > expectedFields.length * 0.5) {
        console.warn('Incomplete profile detected, >50% fields missing.');
        return {
            status: 'incomplete_profile',
            reason: '>50% fields missing',
            missing_fields: missingFields,
            confidence: overallConfidence
        };
        }

        return {
        status: 'ok',
        answers,
        missing_fields: missingFields,
        confidence: parseFloat(overallConfidence)
        };

    } catch (error) {
        console.error('OCR Service Error:', error);
        throw new Error('Failed to process image with OCR.');
    } finally {
        if (worker) {
        await worker.terminate();
        console.log('OCR worker terminated.');
        }
    }
    };

    module.exports = {
    parseImage,
    parseAndNormalize,
    expectedFields,
};