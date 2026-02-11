# Wordle Solver

A React-based web application for solving Wordle puzzles. It suggests optimal next guesses based on previous feedback using frequency analysis.

## Features
- **Solver Logic**: Filters valid words based on Green/Yellow/Gray feedback.
- **Smart Suggestions**: Ranks words by letter frequency to maximize information gain.
- **Game Interface**: Full interactive Wordle grid and virtual keyboard.
- **Responsive Design**: Works on Desktop and Mobile.
- **Dark/Light Mode**: Adapts to system preference.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Running Locally (Development)
Start the development server with hot reload:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
Build the project for deployment:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Previewing Production Build
Test the production build locally:
```bash
npm run preview
```

### Running Tests
Run the test suite (Unit & Integration):
```bash
npm test
```
