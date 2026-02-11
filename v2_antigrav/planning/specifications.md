# Wordle Solver Web Application - Specifications

## 1. Overview
A web-based helper for the popular game Wordle. Users can input their guesses and the feedback received (Green, Yellow, Gray), and the application will suggest the best next words to play based on an elimination algorithm.

## 2. Functional Requirements

### 2.1 Game Interface
- **Base Game Reference**: The solver follows the rules of the original [New York Times Wordle](https://www.nytimes.com/games/wordle/index.html).
- **Guesses**: The grid supports up to **6 guesses**.
- **Word Input**: Users must be able to enter a 5-letter word.
- **Feedback Input**: For each letter of the entered word, users must be able to toggle the state:
    - **Gray (Absent)**: Letter is not in the word.
    - **Yellow (Present)**: Letter is in the word but in the wrong spot.
    - **Green (Correct)**: Letter is in the word and in the correct spot.
- **Grid Display**: A visual representation of past guesses, similar to the actual game.

### 2.2 Solver Logic
- **Word List**: The app will use a standard Wordle dictionary sourced from established open-source repositories (e.g., `tabatkins/wordle-list` or similar JSON/npm package) to ensure accuracy with the official game.
- **Filtering**: Based on the feedback provided, the app must filter the remaining possible words.
- **Suggestions**: The app should display a list of recommended next guesses.
    - **Remaining Count**: The UI must explicitly display the **number of remaining possible solutions**.
    - **Ranking**: Suggestions should be ranked by their potential to eliminate the most remaining possibilities (Information Theory approach or simple elimination).

### 2.3 Controls
- **Reset**: Button to clear all data and start a new game.
- **Undo**: (Optional) Ability to remove the last guess if a mistake was made.
- **Hard Mode**: (Optional) Enforce Wordle's hard mode rules in suggestions.

## 3. Non-Functional Requirements
- **Performance**: Suggestions should calculate in under 200ms.
- **Responsiveness**: The UI must work seamlessly on both Desktop and Mobile.
- **Usability**: Feedback toggling should be intuitive (e.g., tap to cycle colors).

## 4. Data Structures
- **GameState**:
    - `guesses`: Array of objects `{ word: string, feedback: Pattern[] }`
    - `possibleSolutions`: Array of strings (remaining words)
- **Pattern**: Enum/Type `['CORRECT', 'PRESENT', 'ABSENT']`

## 5. Technology Stack
- **Frontend**: React (Vite + TypeScript)
- **Styling**: CSS Modules or Tailwind CSS
- **Testing**: Vitest + React Testing Library
