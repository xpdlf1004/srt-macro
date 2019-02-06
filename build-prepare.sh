
#!/bin/bash
# set -e : exit when one of the below commands are failed
set -e

yarn run build
yarn tsc -p ./tsconfig.server.json

mkdir -p build/electron
cp electron/*.ts build/electron/
yarn tsc build/electron/main.ts

cp ./build.package.json ./build/package.json

(cd build && ../node_modules/.bin/ncc build electron/main.js -o ./)

cp -r dist build/
