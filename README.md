# Health Risk Analysis API

This project is a backend service that analyzes health information. It can take information from an image, a JSON object, or plain text. It uses this information to identify health risks and provide recommendations.

## Project Setup

To get the project running on your local machine, follow these steps.

**1. Prerequisites:**
*   Node.js (v14 or newer)
*   npm

**2. Installation:**
*   Clone the repository to your computer.
*   Open a terminal in the project folder and run:
    ```bash
    npm install
    ```

**3. Environment Variables:**
*   Find the `.env.example` file and create a copy named `.env`.
*   Open the `.env` file and add your API key for the AI service:
    ```
    GROQ_API_KEY=your_groq_api_key_here
    PORT=3000
    ```

**4. Running the Server:**
*   To start the server, run:
    ```bash
    npm start
    ```
*   The server will be running at `http://localhost:3000`.
*   
## Techstack Used

*   **Backend:** Node.js, Express.js
*   **AI:** Groq SDK for large language model integration.
*   **OCR:** Tesseract.js for text extraction from images.
*   **File Handling:** Multer for managing file uploads.
*   **Environment Management:** Dotenv for handling environment variables.

## API Usage

The main endpoint for a complete analysis is `/health/analyze`. It's a `POST` request that can accept different types of input.

**Example 1: Sending a JSON object**

```bash
curl -X POST http://localhost:3000/health/analyze \
-H "Content-Type: application/json" \
-d 
'{'
  '"answers": {
    "age": 55,
    "smoker": true,
    "diet": "high in processed foods",
    "exercise": "rarely"
  }
}'
```

**Example 2: Sending an image**

You can also send an image file (like a photo of a survey). The server will read the text from the image.

```bash
curl -X POST http://localhost:3000/health/analyze \
-F "image=@/path/to/your/survey_image.png"
```

**Example 3: Sending plain text**

```bash
curl -X POST http://localhost:3000/health/analyze \
-H "Content-Type: text/plain" \
-d "Age: 55, Smoker: Yes, Diet: high fat, Exercise: 2 times a week"
```

**Successful Response:**

A successful request will return a JSON object with the analysis.

```json
{
  "status": "ok",
  "factors": [
    "age risk",
    "smoking",
    "poor diet"
  ],
  "risk": {
    "risk_level": "high",
    "score": 65,
    "rationale": [
      "Age over 50 is a risk factor.",
      "Smoking is a major health risk.",
      "A poor diet increases health risks."
    ]
  },
  "recommendations": [
    "Schedule regular health check-ups.",
    "Consider smoking cessation programs.",
    "Incorporate more fruits and vegetables into your diet."
  ]
}
```

## Other API Endpoints

Besides the main `/analyze` endpoint, the API provides endpoints to access each step of the analysis process individually.

### AI-based Analysis

This endpoint uses the AI service directly to perform the analysis.

```bash
curl -X POST http://localhost:3000/health/ai-analysis \
-H "Content-Type: application/json" \
-d 
'{'
  '"answers": {
    "age": 55,
    "smoker": true,
    "diet": "high in processed foods",
    "exercise": "rarely"
  }
}'
```

### Parse Text from Image

Extracts and parses health data from an uploaded image.

```bash
curl -X POST http://localhost:3000/health/parse \
-F "image=@/path/to/your/survey_image.png"
```

### Extract Factors

Extracts health risk factors from a JSON object of answers (rule-based).

```bash
curl -X POST http://localhost:3000/health/factors \
-H "Content-Type: application/json" \
-d 
'{'
  '"answers": {
    "age": 55,
    "smoker": true,
    "diet": "high in processed foods",
    "exercise": "rarely"
  }
}'
```

### Classify Risk

Calculates a risk score and level based on a list of factors (rule-based).

```bash
curl -X POST http://localhost:3000/health/risk \
-H "Content-Type: application/json" \
-d 
'{'
  '"factors": ["age risk", "smoking", "poor diet"]
}'
```

### Generate Recommendations

Generates recommendations based on risk level and factors (rule-based).

```bash
curl -X POST http://localhost:3000/health/recommendations \
-H "Content-Type: application/json" \
-d 
'{'
  '"risk_level": "high",
  "factors": ["age risk", "smoking", "poor diet"]
}'
```

### API Info

Get a list of available endpoints.

```bash
curl http://localhost:3000/health/
```

## Architecture

The project is built with Node.js and Express. It's structured to separate different parts of the work.

*   `src/app.js`: This is the main file that sets up the Express server and middleware.
*   `src/routes/`: This folder defines the API endpoints. For example, `healthRoutes.js` contains the `/health/analyze` route.
*   `src/controllers/`: Controllers handle the incoming requests from the routes. They manage the request and response and call the necessary services.
*   `src/services/`: This is where the main logic lives.
    *   `ocrService.js`: Handles extracting text from images.
    *   `aiService.js`: Connects to the Groq AI to get the health analysis.
    *   The project also has older services (`factorService.js`, `riskService.js`) that use a rule-based approach.
*   `src/utils/`: Contains helper functions. `parser.js` is used to handle the different input types (JSON, image, text).

The data flows from the route to the controller, which then uses the services to process the data and generate a response.

## Prompts and AI Integration

The core of the analysis comes from an AI model. We use the Groq API to get fast responses.

The process started with simple prompts asking the AI to identify risk factors. Through refinement, the prompt was improved to ask for a structured JSON output directly.

**Initial Prompt Idea:**
> "Analyze this health text: [text]. What are the risks?"

This gave unstructured text that was hard to use in an application.

**Refined Prompt:**
> "Based on the following health data, generate a JSON response with risk factors, a risk score, and recommendations. The JSON object should have three keys: "factors", "risk", and "recommendations". Data: [text]"

This final prompt ensures we get a clean JSON object every time, which makes the API reliable. It asks the AI to do the heavy lifting of not just analysis but also formatting.

## Known Issues and Potential Improvements

*   **AI Response Parsing**: The application expects a specific JSON format from the AI. If the AI model changes its output, it could break the parsing. More robust validation on the AI's response could be added.
*   **Security**: The server setup is simple. For a production environment, security middleware like `helmet` should be added to protect against common web vulnerabilities.
*   **No Database**: The application processes requests and doesn't save any data. To track user history or perform larger-scale analysis, a database would be needed.
*   **Testing**: The project has a `tests` folder, but more unit and integration tests are needed to ensure all parts of the application work correctly, especially the AI integration.
