# Psychology Platform Mobile

React Native mobile application built with Expo SDK 57 and Expo Router.

## Stack

- Expo SDK 57
- React Native 0.86.3
- React 19.2.3
- Expo Router 57
- AsyncStorage for local JWT persistence
- REST API via `fetch`
- TypeScript

## Backend

This app connects to the Express backend from the Psychology Platform project.

Current API:

- GET `/api/health`
- GET `/api/users`
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/psychologists`
- GET `/api/articles`
- POST `/api/leads`

## 1. Install

```powershell
npm install
```

## 2. Configure API URL

Copy `.env.example` to `.env`.

### Physical Android/iPhone

The phone cannot use `localhost` to reach the backend on your PC.

Find your PC IPv4 address:

```powershell
ipconfig
```

Example:

```text
IPv4 Address . . . . . . . . . . : 192.168.1.100
```

Then `.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

The phone and PC must be on the same network.

### Android emulator

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

### iOS simulator

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## 3. Start

```powershell
npx expo start
```

Then open the project in Expo Go.

For SDK 57, the current Expo Go workflow requires signing into the same Expo account in the CLI and Expo Go in cases where the client requests authentication.

## Screens

- Home
- Login
- Register
- Psychologists
- Articles
- Profile
- Users (admin)
- API health
- Lead creation

## Authentication

After login the JWT is stored in AsyncStorage.

Every API request automatically sends:

```text
Authorization: Bearer <JWT>
```

## Important backend limitation

The current `/api/leads` endpoint accepts:

```json
{
  "user_id": "...",
  "source": "mobile"
}
```

It does not currently save email/phone from the lead form. The mobile app therefore sends the API fields that the current backend actually supports.

Also, `/api/users` is currently not protected by JWT on the backend. The mobile app hides the admin screen from non-admin users, but real authorization must be enforced on the Express server before production.
