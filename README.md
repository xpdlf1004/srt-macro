# srt-macro

## Description
SRT macro uses Nodejs version 12.10

## Project setup

```
yarn install
```

## Development

### Run server

```
yarn run start:server
```

### Run client

```
yarn run start:client
```

## Production

### Compiles and minifies client for production

```
yarn run build
```

### Electron build

```
sh ./build-prepare.sh
cd build
yarn run build:win OR yarn run build:osx OR yarn run build:linux
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Run your end-to-end tests

```
yarn run test:e2e
```

### Run your unit tests

```
yarn run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
