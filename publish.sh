#!/bin/bash
npm version patch --no-git-tag-version
yarn install && yarn build && yarn prepack && npm publish --access public
