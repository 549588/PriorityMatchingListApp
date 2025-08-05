<<<<<<< HEAD
# Evaluation Engine

## Overview
The Evaluation Engine is an application designed to facilitate the evaluation of candidates through AI-generated multiple choice questions. It allows users to trigger evaluation requests, submit answers, and save evaluated scores to a CSV file for record-keeping and analysis.

## Features
- Trigger evaluation requests for candidates.
- AI-enabled generation of multiple choice questions based on specified criteria.
- Submission of answers and evaluation of scores.
- Saving evaluated scores to a CSV file for easy access and reporting.

## Project Structure
```
Evaluation-Engine
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── evaluationController.ts
│   │   └── questionController.ts
│   ├── routes
│   │   ├── evaluationRoutes.ts
│   │   └── questionRoutes.ts
│   ├── services
│   │   ├── aiService.ts
│   │   ├── evaluationService.ts
│   │   └── csvService.ts
│   ├── models
│   │   ├── question.ts
│   │   └── evaluation.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Evaluation-Engine
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Access the API endpoints for triggering evaluations and submitting answers.

## API Endpoints
- **Evaluation Routes**
  - `POST /evaluate` - Trigger an evaluation request.
  - `POST /evaluate/score` - Save the evaluated score to a CSV file.

- **Question Routes**
  - `GET /questions` - Fetch AI-generated questions.
  - `POST /questions/submit` - Submit answers for evaluation.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
=======
# AITalentFlow
AITalentFlow
>>>>>>> d7c3520d5dbff52c8453e6e4d4b469d07e0da680
