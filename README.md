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
    files: [{ path: "./build/static/js/*.js" }, { path: "./build/static/css/*.css" }],
  });

  // ...
}
```

## API

```typescript
await buildSize({
  files: [
    {
      path: "./build/**/*.js", // path to files. Supports globs
      maxSize: 1024, // optional maxSize in bytes. Reaching this value will make check fail
    },
  ];
})
```
