# Act as a Senior Frontend Developer

Your task is to build **ZenFlow**, a minimalist single-page focus application.
The goal is to create a tool that feels "invisible" and calm.

## Technical Requirements

1. **Architecture:** Use Vanilla JS, HTML, and CSS. Do not use frameworks like 
   React or Vue. Keep it lightweight.
2. **Visual Style:** 
   - Use a "Nordic Noir" or "Evergreen" color palette.
   - Background: Dark (#1a1b26) or Soft Cream (#f2efea).
   - Typography: Use system-ui or a clean sans-serif like 'Inter'.
   - Implement "Glassmorphism" for the main task container.
3. **Core Functionality:**
   - **Task Entry:** A large, borderless input field in the center. When a task 
     is submitted, it replaces the input with static text.
   - **Timer:** A 25-minute countdown that starts automatically when the task 
     is set. Provide a small "plus 5 min" button.
   - **Soundboard:** Three small icons at the bottom. Clicking an icon toggles 
     an audio loop. (Use placeholder URLs from a public CDN like Pixabay 
     for the demo).
4. **Data Persistence:** Use `localStorage` to save the active task so a 
   page refresh doesn't lose the user's progress.

## UI Specifics

- The timer should only become fully opaque when the mouse moves.
- Provide a "Clear Task" button that resets the state for a new goal.
- Transitions should be slow (0.5s ease-in-out) to maintain a "Zen" feel.

## Constraints

- Code must be clean and modular.
- The CSS must be responsive (mobile-friendly).
- Ensure the audio loops seamlessly without audible gaps.

## Expected Output

Provide the complete `index.html`, `main.css`, and `app.js` in a single 
consolidated response or a clear file structure.
