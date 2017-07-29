import { expect } from 'chai'
import td from 'testdouble'
import moment from 'moment'

describe('stateFromLocalStorage', () => {
  it('should be a function')

  context('when a tracker was running, some time is past, but the routine shouldn\'t be complete yet', () => {
    it('should reduce the timeLeft accordingly')
    it('should resume the tracker')
  })

  context('when a tracker was running, some time is past, and it should be completed already', () => {
    it('should adjust the routine data accordingly')
    it('should show the \'a routine has completed\' modal and play the notif sound')
  })

  it('should be a serialized object derived from local storage of key \'state\' where any ISO8601 string is converted into moment', () => {
    const origLocalStorage = window.localStorage
    const sampleData = {
      routines: [
        {
          id: '1',
          routineName: 'Routine One',
          duration: moment(moment('2013-02-08 09:30:26.123').toJSON())
        },
        {
          id: '2',
          routineName: 'Routine One',
          duration: moment(moment().toJSON())
        },
      ]
    }
    const stringifiedSampleData = JSON.stringify(sampleData)

    const fakeGetItem = td.function()
    window.localStorage = { getItem: fakeGetItem }
    td.when(fakeGetItem('state')).thenReturn(stringifiedSampleData)

    const expected = sampleData
    const actual = require('./stateFromLocalStorage').default


    expect(actual).to.deep.equal(expected)

    // teardown
    window.localStorage = origLocalStorage
  })
})