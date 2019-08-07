<p align="center">
  <img src="./meta/check.png" width="700" alt="codechecks.io">
  <h3 align="center">Build Size Watcher</h3>
  <p align="center">Keep your build size in check and detect when it gets too big</p>

  <p align="center">
    <a href="https://circleci.com/gh/codechecks/build-size-watcher"><img alt="Build Status" src="https://circleci.com/gh/codechecks/build-size-watcher/tree/master.svg?style=svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
    <a href="https://codechecks.io"><img src="https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true" alt="codechecks.io"></a>
  </p>
</p>

## Install

```sh
npm add --save-dev @codechecks/build-size-watcher
```

or

```sh
yarn add --dev @codechecks/build-size-watcher
```

## Usage

Add to your `codechecks.yml` file:

```yml
checks:
  - name: build-size-watcher
    options:
      files:
        - path: "./build/static/js/*.js"
          maxSize: 1MB
        - path: "./build/static/css/*.css"
        - path: "./build/static/images/*.jpg"
  # ...
```

With each pull request you will get a summary like `Change +3 KB(+1%) Total 300KB` and detailed size
breakdown for each path in check's details.

## API

### buildSizeWatcher(options: BuildSizeWatcherOptions): Promise\<void>

#### BuildSizeWatcherOptions

```typescript
interface BuildSizeWatcherOptions {
  gzip?: boolean; // defaults to true
  files: {
    path: string; // supports globs
    maxSize?: number | string;
  }[];
  name?: string; // defaults to "Build Size"
}
```

##### gzip

optional `boolean`<br>\
Default: `true`<br>\
Specify if files should be gzipped before size calculation

##### files

```typescript
interface FileDescription {
  path: string; // supports glob
  maxSize?: number | string;
}
```

List of files to track.

###### files.path

`string`<br>\
Path specifying files to bundle together while calculating size. Supports globs. It's great when you
have to deal with checksums in file names: ex. `"./build/static/js/*.js"`

###### files.maxSize

optional `number|string`<br>\
Provide the maximum size of all files matched by `files.path`. It can be a number in bytes or a string
like "1KB" or "1MB". When max size is reached the whole check will report failure.

##### name

optional `string`<br>\
Default: `Build Size`<br>\
Specify the name for check. Might be useful when you track multiple builds for example in monorepo.

## Contributing

All contributions are welcomed. Read more in [CONTRIBUTING.md](./CONTRIBUTING.md)

## Licence

MIT @ [codechecks.io](https://codechecks.io)
