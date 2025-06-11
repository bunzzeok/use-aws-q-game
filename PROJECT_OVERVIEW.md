# Project Overview

This document provides a concise overview of the **use-aws-q-game** project, a React+TypeScript implementation of a Sudoku game automatically managed and improved by Amazon Q AI.

## 1. Directory Structure
```
.
├── build/               # Build output (e.g., Netlify deployment)
├── netlify.toml         # Netlify configuration
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Locked dependency versions
├── PROGRESS.md          # AI-managed project progress log
├── public/              # CRA public static assets
├── README.md            # Main project readme (overview, run & test guide)
├── src/                 # Application source code
│   ├── App.tsx
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── integration-tests/
│   ├── scripts/
│   ├── styles/
│   ├── types/
│   └── utils/
├── test.txt             # Sample placeholder file
└── tsconfig.json        # TypeScript configuration
```

## 2. Project Description

**use-aws-q-game** is a Sudoku game built with React and TypeScript.  It incorporates AI-driven project management by Amazon Q AI to continuously record, analyze, and improve the codebase.

## 3. Main Features

- Three difficulty levels (Easy, Medium, Hard)
- Hint system with limited hints per difficulty
- Note-taking (memo) feature
- Mistake limit (max 5 incorrect entries)
- Timer with pause/resume
- Dark mode / light mode toggle
- Cell highlighting and automatic memo
- Undo/redo functionality
- Game save and load
- Game statistics and achievements
- Material Design-inspired UI/UX

## 4. How to Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd use-aws-q-game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   # http://localhost:3000
   ```

## 5. Testing

```bash
# Run all tests
npm test

# Verify Sudoku puzzle validity
npm run verify-puzzles
```

## 6. Tech Stack & Deployment

- **Frontend:** React, TypeScript, CSS
- **Testing:** Jest & React Testing Library
- **CI/CD:** GitHub Actions for automated tests and builds
- **Hosting:** Netlify (configured via netlify.toml and build folder)