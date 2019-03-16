# CodeCheck Build Size

## Installation

```
yarn add --dev codecheck-build-size
```

or

```
npm install --dev codecheck-build-size
```

## Usage

Add to your `codecheck.js` file:

```typescript
import { buildSize } from "codecheck-build-size";

export async function main() {
  await buildSize({
    files: [
      { path: "./build/static/js/*.js", maxSize: "1MB" },
      { path: "./build/static/css/*.css" },
      { path: "./build/static/images/*.jpg" },
    ],
  });

  // ...
}
```

## API

```typescript
await buildSize({
  files: [
    {
      path: string, // glob supporting path to files
      maxSize?: number | string, // optional maximum allowed size. Can be a number meaning bytes or string like "1MB" or "100KB".
    },
  ];
})
```
