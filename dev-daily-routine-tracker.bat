rem start cmd /k "yarn run mocha -- --reporter min --watch app/components/**/*.unit.js"
rem start cmd /k "yarn run mocha -- --reporter min --watch app/containers/**/*.unit.js"
rem start cmd /k "yarn run mocha -- --reporter min --watch app/duck/**/*.unit.js"
rem start cmd /k "yarn run mocha -- --reporter min --watch app/pages/**/*.unit.js app/services/**/*.unit.js"
start cmd /k "yarn run test:watch -- --reporter min"
start cmd /k ""
start cmd /k ""
start "" "%PROGRAMFILES%/Git/git-cmd.exe"
cls
yarn run start
