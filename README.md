Daily Routine Tracker
========================================

TODO
----------------------------------------

- add & test other components
  - [done] edit resetRoutine action/reducer so that it stops the tracker as necessary
  - [done] edit editRoutine action/reducer so that it resets the time left as necessary
  - [done] pass RoutineItem\'s specs for conditional rendering
  - [done] use buttons instead of link in RoutineItem controls and correct the usage of buttons and
    links elsewhere as applicable
  - the rest of the functionality
- final design/theming
  - add page transitions for mobile
- optimization
  - review implemented features and specified features
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

---

# Features

describe.skip('Daily Routine Tracker', () => {
  // Managing the Routines
  DONE.describe('Adding a Routine')
  INCOMPLETE.describe('Editing a Routine')
    .maybe('RoutineForm should have the controls that RoutineItem has')
    .maybe('If RoutineForm does have the controls of RoutineItem, synchronize the data as appropriate')
    .maybe('Or maybe leave the time controls on RoutineItem alone')
  DONE.describe('Deleting a Routine')

  // Duration and Tracker
  DONE.describe('Starting a tracker')
  DONE.describe('Stopping a tracker')
  DONE.describe('Resuming a tracker')
  DONE.describe('Showing of duration that tracker still needs to track')
  DONE.describe('Stopping a tracker when finished')

  // Duration and Tracker (part II)
  DONE.describe('Marking the routine completed when tracker is finished')
  INCOMPLETE.describe('Resetting of a tracker manually')
    .should('show only reset button instead of start button when routine is marked done')
    .should('mark undone if reset button is pressed when it is done')
  describe('Resetting of trackers every start of day')
  describe('Alarming when tracking is done')

  // Marking the Routines
  describe('Marking the routine completed')
  describe('Marking the routine incomplete')

  // Reminder
  describe('Ringing of reminder alarms')
  describe('Turning off of a reminder reminder alarm')
  describe('Showing of pending reminders')
  describe('Editing of a reminder')
  describe('Removing of a reminder')

  // Data export/import
  describe('Exporting of daily routine set')
  describe('Importing of daily routine set')

  // Managing the Routines (part II)
  describe('Reordering the routines')
})
