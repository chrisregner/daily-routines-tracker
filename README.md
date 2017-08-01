Daily Routine Tracker
========================================

TODO
----------------------------------------

- add & test other components
  - misc
    - [done] edit resetRoutine action/reducer so that it stops the tracker as necessary
    - [done] edit editRoutine action/reducer so that it resets the time left as necessary
    - [done] pass RoutineItem\'s specs for conditional rendering
    - [done] use buttons instead of link in RoutineItem controls and correct the usage of buttons and links elsewhere as applicable
    - [done] test two of my custom proptypes
    - [done] add the virtual class library
- prod build
  - css minification
  - gzip
  - ensure tree shaking
- final tests
  - xbrowser test
  - check page load
  - ensure flash of loading fonts is no more
- misc
  - [done] add footer
  - delete older micromanage.me versions
  - update README.md
    - acknowledgement for used notif audio file
      - https://freesound.org/people/hykenfreak/sounds/202029/
      - https://freesound.org/people/hykenfreak/


Features To do list
----------------------------------------

- Managing routines
  - [done] Adding a routine
  - [done] Editing a routine
  - [done] Deleting a routine
  - [done] Marking the routine done
  - [done] Marking the routine undone
  - [done] Sorting routines
- Tracking Routines
  - [done] Starting the tracker of a routine
  - [done] Stopping the tracker of a routine
  - [done] Resuming the tracker of a routine
  - [done] Resetting the tracker of a routine
  - [done] Showing the time that is still needed to track for each routine
  - [done] Stopping the tracker of routine when finished tracking
  - [done] Marking the routine done when finished tracking
  - [done] Alarms to ring when finished tracking
  - [done] Resetting all trackers
- [done] Toggling a routine completed
- Routines data
  - [done] Persisting the data in local storage
  - Exporting data
  - Importing data

### Issues

- [done] logical management of state when simultaneously tracking, toggling completeness and/or editing a routine
- [done] logical conditional rendering for routine controls

### Maybe in future

- Reminder for each routine
- Editing the time tracked
- Spreadsheet or a dashboard that shows daily/weekly/monthly/yearly progress

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

