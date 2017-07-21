describe('Daily Routine Tracker', () => {
  it('should let you add a routine')

  context('when adding a routine', () => {
    it('should require you to specify the name')
    it('should optionally allow you to add duration')
    it('should optionally allow you to add an reminder')
  })

  it('should show a list of added routine(s)')

  describe('list of added routine', () => {
    context('when routine has not been added', () => {
      it('should show no routine')
    })

    context('when one routine is added', () => {
      it('should show that one routine')
    })

    context('when multiple routines are added', () => {
      it('should show those multiple routines')
    })

    describe('each routine on list', () => {
      it('should show a name')

      describe('duration', () => {
        context('when duration was provided', () => {
          context('when time not been tracked for the routine yet', () => {
            it('should show you the duration')
          })

          context('when there is already time tracked for the routine', () => {
            it('should show you the amount of time you need to track inorder to meet the provided duration')
          })
        })

        context('when duration is not provided', () => {
          it('should not show any duration')
        })
      })

      describe('track button', () => {
        context('when duration was provided', () => {
          context('when the tracker is not already running', () => {
            context('when time has not been tracked for the routine yet', () => {
              it('should show the track button')
              it('should begin tracking time starting from zero when pressed')
            })

            context('when there is already some but insufficient time tracked for the routine', () => {
              it('should show the track button')
              it('should begin tracking time starting from the time that has already been tracked when pressed')
            })

            context('when sufficient time has already been tracked', () => {
              it('should show the reset button')
              it('should reset the amount of time tracked and zero, and allows tracking time again, when pressed')
            })
          })

          context('when the tracker is already running', () => {
            it('should show the stop button')
          })
        })

        context('when duration is not provided', () => {
          it('should not show any button')
        })
      })

      describe('reminder', () => {
        context('when reminder is provided', () => {
          it('should show an alarm icon')
        })

        context('when reminder is not provided', () => {
          it('should not show an alarm')
        })
      })

      it('should have a button to toggle if its completed or not')

      describe('the button that should toggle the button whether its completed or not', () => {
        context('when timer has not tracked all the time required by duration yet', () => {
          it('should mark the routine completed when pressed')
        })

        context('when timer has already tracked all the time required by duration', () => {
          it('should mark the routine incomplete when pressed')
        })

        context('when it has been previously pressed to mark the routine complete', () => {
          it('should mark the routine incomplete')
        })

        context('when it has been previously pressed to mark the routine incomplete', () => {
          it('should mark the routine complete')
        })
      })

      it('can be reordered using a drag button')

      it('should have an edit button', () => {
        it('should open the routine form when pressed')
      })

      context('when item is pressed anywhere that is not a button', () => {
        it('should also open the routine form')
      })

      // TODO: put these in correct context
      describe('the routine form', () => {
        it('should let you update the name')
        it('should let you change the duration if any')
        it('should let you remove the duration if any')
        it('should let you a duration if there is none')
        it('should let you change the reminder if any')
        it('should let you remove the reminder if any')
        it('should let you a reminder if there is none')
        it('should let you delete the routine altogether')

        it('should let you toggle the completeness of the routine')

        it('should let you start the tracker')
        it('should let you stop the tracker')
        it('should let you reset the tracker')
      })
    })
  })

  describe('the reminder', () => {

  })
})
