# Chrome Extension

## Dependencies

Node Package Manager (npm)
```
> npm -v
8.1.0
```

## Installation

1. Build the code:
```
npm install
npm run build
```
(The code outputs to directory `dist/`)
2. Navigate to `chrome://extensions`
3. Turn on "Developer Mode"
4. Click "Load unpacked" and select directory `dist/`

### Test server

A test API server is in directory `test-api-server/`. Requires Node.js

To run:
1. Navigate to `test-api-server/`
2. Build the code:
```
npm install
npm run build
```
3. Run:
```
npm start
```
