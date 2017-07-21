describe.skip('Daily Routine Tracker', () => {
  // Managing the Routines
  describe('Adding a Routine')
  describe('Editing a Routine')
  describe('Deleting a Routine')

  // Duration and Tracker
  describe('Starting a tracker')
  describe('Stopping a tracker')
  describe('Resuming a tracker')
  describe('Showing of duration that tracker still needs to track')
  describe('Stopping a tracker when finished')

  // Duration and Tracker (part II)
  describe('Marking the routine completed when tracker is finished')
  describe('Resetting of a tracker manually')
  describe('Resetting of trackers every start of day')

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
  describe('Reorder the routines')

  // REMOVE THIS:
  describe('Time Object', () => {
    describe('duration', () => {
      it('should be decrementable to show the remaining time to track')
      it('converts moments hrs, mins, secs to secs')
    })

    describe('time', () => {
      it('should be able to be used to compare against the clock')
      it('should compare every minute')
    })
  })
})
