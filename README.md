# AI Apprentice Demo: Balanced Input Control

A lightweight static website demonstrating how to disable clipboard paste while maintaining support for manual typing and voice dictation tools.

## Project Purpose
This project was created for a Gen AI class extra credit assignment. It aims to show that educational platforms can discourage "copy-paste" behaviors without sacrificing accessibility or modern productivity tools like voice dictation (e.g., Wispr Flow).

## How to Run Locally
1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. No server or build steps are required.

## How to Deploy on GitHub Pages
1. Create a new repository on GitHub.
2. Push these files to the `main` branch.
3. Go to **Settings > Pages** in your GitHub repository.
4. Under **Build and deployment**, set the source to **Deploy from a branch** and select the `main` branch.
5. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Demo Talking Points
- **Clipboard Signature Heuristic:** Explain that manual browser-to-browser pastes usually include multiple data types (like `text/html`), while dictation tools typically only provide `text/plain`. We use this signature to differentiate the input source.
- **Strict Mode:** Use the toggle in the Event Log to show the difference between blocking *everything* that looks like a paste (which breaks Wispr Flow) versus a more surgical block that allows tools to function by checking the `data`, `isComposing`, and clipboard metadata properties.
- **The Problem:** Many "anti-cheating" systems block all non-keyboard input, which breaks accessibility and modern AI-driven tools.
- **The Solution:** Instead of blocking the `paste` event entirely, we target the `beforeinput` event with a combination of `inputType`, `data` presence, `isComposing` state, and clipboard signature heuristics.
- **The Balance:** This approach creates a "speed bump" for copying content while still allowing a student to "think out loud" via dictation. This is a more surgical and accessibility-friendly method of input control.

## Limitations
- **Browser Variability:** Different browsers and operating systems may handle dictation events differently.
- **Sophisticated Tools:** Some automation tools might simulate clipboard paste in a way that bypasses standard event listeners.
- **Not a Silver Bullet:** This is a demonstration of event handling, not a foolproof security measure. It is intended to foster discussion about UX and academic integrity.
