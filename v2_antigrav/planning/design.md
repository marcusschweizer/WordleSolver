# Design & UX - Wordle Solver

## 1. Design Philosophy
Minimalist, clean, and data-focused. The interface should feel familiar to Wordle players but offer distinct "Solver" capabilities without clutter.

## 2. Color Palette
We will support both Dark and Light modes, defaulting to System Preference or Dark Mode for that "hacker/solver" vibe.

### Dark Mode (Default)
- **Background**: `#121213` (Wordle Dark Gray)
- **Surface/Tile**: `#3a3a3c` (Empty Tile)
- **Text**: `#ffffff`
- **Accents**:
    - **Green (Correct)**: `#538d4e`
    - **Yellow (Present)**: `#b59f3b`
    - **Gray (Absent)**: `#3a3a3c` (Darker for keyboard dims: `#565758`)
    - **Blue (Action/Highlight)**: `#4da6ff` (For primary buttons like "Solve" or "Reset")

### Light Mode
- **Background**: `#ffffff`
- **Surface/Tile**: `#d3d6da`
- **Text**: `#000000`
- **Accents**:
    - **Green**: `#6aaa64`
    - **Yellow**: `#c9b458`
    - **Gray**: `#787c7e`

## 3. Typography
- **Font Family**: 'Inter', sans-serif (Clean, modern, legible at small sizes).
- **Weights**:
    - *Regular (400)*: Body text, suggestions.
    - *Bold (700)*: Tiles, headers, button text.

## 4. Layout

### 4.1 Global Structure
- **Header**:
    - Title: "Wordle Solver"
    - Theme Toggle (Sun/Moon icon)
    - Reset Button (Icon: Refresh)
- **Main Content**:
    - **Left Column (Game Board)**: Use the standard 5x6 grid. Interactive tiles.
    - **Right Column (Suggestions)**: A scrolling list of recommended words.
        - *Desktop*: Side-by-side.
        - *Mobile*: Stacked (Board top, Suggestions bottom or collapsible drawer).
- **Footer**:
    - Copyright / GitHub Link.

### 4.2 Interactions
1.  **Entering a Guess**:
    - User types letters. They appear in the active row.
    - User clicks/taps a tile to cycle colors: `Gray -> Yellow -> Green -> Gray`.
2.  **Getting Suggestions**:
    - As soon as valid feedback is entered (or typically after pressing "Enter" in the real game), the solver updates the Right Column.
3.  **Selecting a Suggestion**:
    - Clicking a suggestion auto-fills the active row with that word (for convenience).

## 5. Wireframes (Conceptual)
```
+--------------------------------------------------+
|  Wordle Solver    [Refresh]            [Theme]   |
+--------------------------------------------------+
|                                                  |
|  [ W ] [ O ] [ R ] [ D ] [ S ]    SUGGESTIONS    |
|  [ A ] [ B ] [ C ] [ D ] [ E ]    -----------    |
|  [ . ] [ . ] [ . ] [ . ] [ . ]    1. CRANE       |
|  [ . ] [ . ] [ . ] [ . ] [ . ]    2. SLATE       |
|  [ . ] [ . ] [ . ] [ . ] [ . ]    3. TRACE       |
|  [ . ] [ . ] [ . ] [ . ] [ . ]    ...            |
|                                                  |
|  [ Keyboard / Input Controls ]                   |
|                                                  |
+--------------------------------------------------+
```
