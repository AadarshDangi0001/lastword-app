# Last Word Client (Expo + JavaScript + NativeWind)

Production-ready Expo Router setup using JavaScript and Tailwind CSS via NativeWind.

## Stack

- Expo SDK 54
- Expo Router (file-based routing)
- JavaScript (no TypeScript)
- NativeWind + Tailwind CSS

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Add environment values

```bash
cp .env.example .env
```

3. Run app

```bash
npm run start
```

## Scripts

- `npm run start` - Start Expo
- `npm run start:clear` - Start Expo with cleared Metro cache
- `npm run android` - Open Android
- `npm run ios` - Open iOS
- `npm run web` - Open Web
- `npm run lint` - Run lint checks

## Project Structure

```text
app/
   _layout.js
   +not-found.js
   (tabs)/
      _layout.js
      index.js
      settings.js
src/
   components/
      layout/
      ui/
   config/
   constants/
   features/
   lib/
   services/
      api/
   utils/
assets/
global.css
tailwind.config.js
babel.config.js
metro.config.js
jsconfig.json
eas.json
```

## Production Notes

- Use `EXPO_PUBLIC_` prefixed variables for client-safe environment values.
- Update `app.json` identifiers (bundle/package IDs) before release.
- Configure EAS credentials and run `eas build --profile production` for store builds.
