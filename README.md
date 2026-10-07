# Time Tracker
<img width="1105" height="802" alt="image" src="https://github.com/user-attachments/assets/99bc6f1f-a6ff-4cf1-bea1-ff9838bb7d12" />

A vanilla JavaScript app for tracking coding sessions by category and subcategory, with persistent storage and crash detection.

**Live demo:** https://kmarkic02-dev.github.io/time-tracker/

## Features

- Two-stage cascading picker (category → subcategory)
- Live timer with Start/Stop
- Sessions saved to `localStorage` — persist across refreshes and tab closures
- Heartbeat mechanism that detects unexpected closes (crash, battery death, force-quit)
- Running total across all sessions
- Delete individual sessions

## How it works

Each running session is stored in `localStorage` with a single `startTime` timestamp. Elapsed time is always *derived* (`Date.now() - startTime`), never accumulated — so it never drifts.

To handle unexpected closes, the app writes a `lastHeartbeat` timestamp every 5 seconds while the timer is running. On page load, if the last heartbeat is older than 10 seconds, the timer is treated as "closed unexpectedly." Elapsed time is then truncated to the last heartbeat, so time spent away from the browser (dead battery, crash) isn't counted toward the session.

This is more reliable than the `beforeunload` event, which doesn't fire on crashes or force-quits.

## Built with

- JavaScript (ES6+)
- HTML5
- CSS3
- `localStorage` API

## Running locally

Clone the repo and open `index.html` in a browser. No build step, no dependencies.

## What I learned

- Managing persistent application state without a framework
- Treating `startTime` as the single source of truth, and deriving elapsed time from it
- Detecting tab closure with a heartbeat + threshold pattern
- Handling edge cases: refreshes, crashes, force-quits, mobile tab discards

## Possible next steps

- Filter sessions by category or date range
- Option to add custom categories and subcategories
- Weekly summary chart
- Export sessions to CSV
