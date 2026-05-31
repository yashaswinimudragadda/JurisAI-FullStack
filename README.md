
# JurisAI Full-Stack Application

JurisAI is a full-stack project designed to streamline legal research and information management. This repository contains the combined components of the JurisAI development process, including the frontend prototype and the backend infrastructure.

## Repository Structure

The project is organized into two main directories:

```text
JurisAI-FullStack/
├── day2/                # Frontend/Prototype Development
│   ├── node_modules/    # Dependencies
│   ├── src/             # Source code
│   └── package.json     # Scripts and dependencies for frontend
├── functions/           # JurisAI Backend (Firebase Cloud Functions)
│   ├── node_modules/    # Dependencies
│   ├── index.js         # Main API logic
│   └── package.json     # Scripts and dependencies for backend
└── README.md            # Project documentation

```
## Prerequisites
Before running the project locally, ensure you have the following installed:
 * Node.js (v16 or higher recommended)
 * npm
## Environment Setup
This project requires your own API keys and database credentials to function. You must create a .env file in the respective folders:
### 1. Backend Setup (/functions)
 1. Navigate to the functions folder: cd functions
 2. Create a file named .env.
 3. Add your MongoDB connection string:
   ```text
   MONGODB_URI=your_mongodb_connection_string_here
   
   ```
 4. Install dependencies and start the backend:
   ```bash
   npm install
   npm start
   
   ```
### 2. Frontend Setup (/day2)
 1. Navigate to the day2 folder: cd ../day2
 2. (Optional) If your frontend requires API keys (e.g., OpenAI), create a .env file and add them:
   ```text
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   
   ```
 3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   
   ```
## Running the Application
 * **Backend:** Access the backend locally by running npm start inside the functions directory.
 * **Frontend:** Start the development environment by running npm run dev inside the day2 directory.
## Notes for Contributors
 * Please ensure you do not commit your .env files to GitHub. Always add .env to your .gitignore file.
 * If you encounter issues with database connections, verify that your MongoDB URI is correctly formatted and that your IP address is whitelisted in the MongoDB Atlas dashboard.
```

***

### How to use this:
1.  **Create the file:** In your root folder (`JurisAI-FullStack`), create a new file named `README.md`.
2.  **Paste:** Paste the code block above into that file.
3.  **Commit:** Save the file and commit it to your repository (`git add README.md`, `git commit -m "Add README"`, `git push`).

This structure shows your HR manager that you understand how to organize a professional repository, document dependencies, and handle sensitive information like API keys securely. Good luck with the submission!

```
This README.md is designed to be professional, clear, and easy for your HR or team to follow. You can copy this entire block directly into a file named README.md in the root of your project folder.
```markdown
# JurisAI Full-Stack Application

JurisAI is a full-stack project designed to streamline legal research and information management. This repository contains the combined components of the JurisAI development process, including the frontend prototype and the backend infrastructure.

## Repository Structure

The project is organized into two main directories:

```text
JurisAI-FullStack/
├── day2/                # Frontend/Prototype Development
│   ├── node_modules/    # Dependencies
│   ├── src/             # Source code
│   └── package.json     # Scripts and dependencies for frontend
├── functions/           # JurisAI Backend (Firebase Cloud Functions)
│   ├── node_modules/    # Dependencies
│   ├── index.js         # Main API logic
│   └── package.json     # Scripts and dependencies for backend
└── README.md            # Project documentation

```
## Prerequisites
Before running the project locally, ensure you have the following installed:
 * Node.js (v16 or higher recommended)
 * npm
## Environment Setup
This project requires your own API keys and database credentials to function. You must create a .env file in the respective folders:
### 1. Backend Setup (/functions)
 1. Navigate to the functions folder: cd functions
 2. Create a file named .env.
 3. Add your MongoDB connection string:
   ```text
   MONGODB_URI=your_mongodb_connection_string_here
   
   ```
 4. Install dependencies and start the backend:
   ```bash
   npm install
   npm start
   
   ```
### 2. Frontend Setup (/day2)
 1. Navigate to the day2 folder: cd ../day2
 2. (Optional) If your frontend requires API keys (e.g., OpenAI), create a .env file and add them:
   ```text
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   
   ```
 3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   
   ```
## Running the Application
 * **Backend:** Access the backend locally by running npm start inside the functions directory.
 * **Frontend:** Start the development environment by running npm run dev inside the day2 directory.
## Notes for Contributors
 * Please ensure you do not commit your .env files to GitHub. Always add .env to your .gitignore file.
 * If you encounter issues with database connections, verify that your MongoDB URI is correctly formatted and that your IP address is whitelisted in the MongoDB Atlas dashboard.
```

***

