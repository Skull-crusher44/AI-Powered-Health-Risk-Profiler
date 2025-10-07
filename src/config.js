const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
  },
  security: {
    allowCors: process.env.ALLOW_CORS === 'true',
    trustedProxies: [], // Can be configured via env if needed, e.g., by splitting a comma-separated string
  },
  healthCheck: {
    enabled: true,
    path: '/status',
  },
  development: {
    detailedErrors: process.env.DETAILED_ERRORS === 'true',
  },
  uploads: {
      path: process.env.UPLOAD_DIR || 'uploads',
  },

  isDevelopment() {
    return this.server.environment === 'development';
  },

  getUploadPath() {
      // Use path.resolve to get an absolute path from the project root
      return path.resolve(__dirname, '..', this.uploads.path);
  },

  validateConfig() {
    const requiredVars = ['PORT', 'HOST', 'NODE_ENV'];
    const missingVars = requiredVars.filter(v => !(v in process.env));
    
    if (missingVars.length > 0) {
      // This will stop the server on startup if essential configs are missing
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    console.log('Required environment variables are present.');
  }
};

module.exports = config;
