Daily Routine Tracker
========================================

TODO
----------------------------------------

- add & test other components
  - [done] edit resetRoutine action/reducer so that it stops the tracker as necessary
  - [done] edit editRoutine action/reducer so that it resets the time left as necessary
  - [done] pass RoutineItem\'s specs for conditional rendering
  - use buttons instead of link in RoutineItem controls and correct the usage of buttons and links
    elsewhere as possible
- final design/theming
  - add page transitions for mobile
- optimization
  - lookout for unnecessary updates
  - override browser back and forward button to use history object
  - warn when attempting to refresh/back/forward in instances that may delete the state
  - do something about flash of loading fonts
  - remove unused stylesheets
  - code splitting
  - caching
  - ensure tree shaking
  - css minification
- final tests
  - test routes (?)
  - integration test?
  - test coverage
  - xbrowser test
    - placeholders appearance behavior
  - perf test
    - research
      - how to
      - recommended
    - apply
    - ensure tree shaking
  - accessibility test
    - research how to
    - apply
  - search and apply other important types of test
- misc
  - maybe rethink of the name
  - file Ant Design issues
    - decorated componet's display name isn't preserved
    - error when explicitly adding name property to class that are decorated
    - possibly unecessarily doubled layer when decorated with form creator
  - delete older micromanage.me versions
  - resolve unmet dependencies in npm
  - remove unused packages
  - remove unused modules
  - update README.md

Done
----------------------------------------

- setup project
  - [done] config webpack just to make things work
  - [done] config mocha
  - [done] config stylelint
  - [done] use eslint instead
- RoutineForm
  - [done] write its specs
  - [done] pass its specs
  - [done] style it
  - lint js and css
- [done] after studies
  - learnings
    - use proptypes for props received from HOCs
    - decorators
  - [done] fix the propType lint errors
  - [done] evaluate the function composition of current code
  - [done] evaluate the tests of current code, especially on HOC/decorator-relation aspect
- [done] chores
  - [done] routineForm proptype errors
  - [done] research writing integration specs
- [done] research
  - [done] redux app architecture
  - [done] research testing redux/react-redux
- [done] chores
  - purge chance.js in all specs
    - think how time should work
  - rename test files to .unit.js
