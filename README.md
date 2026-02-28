  # ResidensiKita

ResidensiKita is an AI-powered residential governance platform designed for Malaysian communities. Developed by DEV_SQUAD as a submission for KitaHack 2026, it aims to replace reactive maintenance in high-rise living with a proactive, structured issue routing platform. The platform transforms communities into AI-assisted governance systems rather than acting merely as a marketplace or a chat group.

## 1. Technical Architecture

The system's architecture connects a web frontend to real-time cloud services and AI processing:

* **Frontend Interface**: Built using React for the web user interface.
* **Authentication**: Utilizes Firebase Auth as the user authentication layer.
* **Database**: Powered by Firestore Database to handle real-time data storage.
* **AI Processing**: Incorporates the Gemini Vision API for AI-based image classification of building issues.
* **Matching Engine**: Uses a rule-based expert ranking system to match the structured JSON output (severity, cost, skill) with local experts.

## 2. Implementation Details

The implementation heavily relies on deep integration with Google AI, specifically utilizing Gemini 2.5 Flash Vision.

* **Image to Action Pipeline**: The core flow involves a user uploading an image, which is analyzed by Gemini Vision to classify the severity, extract the required skill, and facilitate community matching.
* **JSON Schema Enforcement**: To guarantee deterministic output from the LLM, the system enforces a strict structured JSON schema. This schema standardizes the AI response into specific properties: title, category, severity, suggestedAction, estimatedCostRange, and requiredSkill.
* **Reliability**: The implementation includes exponential backoff retry logic to ensure stable and resilient API communications.

## 3. Challenges Faced

During the development and user validation phases, several challenges were identified and addressed:

* **User Trust and Transparency**: Interviews with apartment residents and building management revealed a strong need for cost clarity, urgency indicators, and a preference for trusted local experts.
* **UI/UX Adjustments**: To solve the transparency challenges, the team implemented severity badges, cost range displays, and structured job postings directly into the interface.
* **AI Consistency**: Ensuring the AI provided actionable and predictable data required strict JSON schema enforcement so the rule-based matching engine could process the data reliably.

## 4. Future Roadmap

The project has a defined roadmap scaling from 2025 through 2028, focusing on expanding capabilities and reach:

* **Scaling Dashboards**: Developing multi-building dashboards to manage larger residential portfolios.
* **Institutional Integration**: Implementing authority routing integration to streamline communication with building management or local councils.
* **Proactive Systems**: Advancing the platform's AI to include predictive maintenance capabilities.
* **Expansion**: Achieving nationwide deployment across Malaysian residential communities.

## Running the code

Run `npm i` to install the dependencies.
<br>
Run `npm run dev` to start the development server.
  