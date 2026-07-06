# CownIt

CownIt is a cross-platform commitment tracking application built with Expo and React Native.
It supports role-based access for individuals, HR, and CEO users, with demo data for commits, achievements, monthly updates, messages, and HR comments.

## Features

- Role-based login demo for `individual`, `hr`, and `ceo`
- Mobile-first Expo app with responsive layout for tablets
- Dashboard-style navigation using `TopBar`, `Sidebar`, and `MobileNav`
- In-app data flows for people, commits, achievements, monthly updates, messages, and HR commentary
- Sample seeded data for quick local testing
- Web support enabled via Expo (`npm run web`)

## Demo Credentials

- Password for all demo users: `password`
- Choose a role and a user from the login screen

## Tech Stack

- Expo `~56.0.12`
- React Native `0.85.3`
- React `19.2.3`
- TypeScript `~6.0.3`
- React Native Safe Area Context
- React Native Screens
- React Native SVG
- Expo Document Picker
- React Native Picker

## Getting Started

From the repository root:

```bash
npm install
npm run start
```

Then open the Expo developer tools and launch on a simulator, device, or web browser.

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Run on Web

```bash
npm run web
```

## Project Structure

- `App.tsx` - Expo app entrypoint that exports the root application from `src/App`
- `src/App.jsx` - Main app component with login state, role routing, and responsive navigation
- `src/pages/Login.jsx` - Demo login screen with role/user selection
- `src/components/` - UI components for the app experience
- `src/data/seed.js` - Seed data for people, commits, achievements, updates, messages, and HR comments
- `server/` - Node.js + SQLite backend server with its own README
- `web/` - Separate Vite-based web app workspace

## Backend Server

There is a backend server in `server/` for API and data persistence. It includes a `README.md` with setup and API details.

To start the backend:

```bash
cd server
npm install
npm start
```

## Notes

- The app currently uses seeded local state data for demo purposes.
- The root workspace also contains a separate `web/` app and a standalone `server/` backend.

## License

This repository does not specify a license.
