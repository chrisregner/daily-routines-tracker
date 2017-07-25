start cmd /k "yarn run mocha -- --reporter min --watch app/components/**/*.unit.js"
start cmd /k "yarn run mocha -- --reporter min --watch app/containers/**/*.unit.js"
start cmd /k "yarn run mocha -- --reporter min --watch app/duck/**/*.unit.js"
start cmd /k "yarn run mocha -- --reporter min --watch app/pages/**/*.unit.js app/utils/**/*.unit.js"
start cmd /k ""
start cmd /k ""
start "" "%PROGRAMFILES%/Git/git-cmd.exe"
cls
yarn run start
