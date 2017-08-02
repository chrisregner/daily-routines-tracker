import { expect } from 'chai'
import td from 'testdouble'
import moment from 'moment'
import lolex from 'lolex'

import createMomentDerivedFromIso from 'services/createMomentDerivedFromIso'
import deriveStateFromLocalData from './deriveStateFromLocalData'

describe('deriveStateFromLocalData', () => {
  let fakeClock

  afterEach(() => {
    td.reset()

    if (fakeClock && fakeClock.uninstall)
      fakeClock.uninstall()
  })

  /*
   * Note: Read this if you wonder why we needed to use createMomentDerivedFromIso() instead of
   *   moment()
   *
   * Moment object values of the actual result is expected to be derived from ISO 8601 string,
   * and the fact that it is created from ISO 8601 is saved will be saved on those moment
   * objects as meta data. So if this actual result is compared to another object whose moment
   * object values **aren't derived from ISO 8601 string,** even if they have the same value,
   * the deep comparison will fail.
   *
   * Because of that we need it to campare it to an object whose moment object values are also
   * derived from ISO 8601, thus we createMomentDerivedFromIso() that does this:
   *
   *     moment( moment('<moment friendly string here>').toJSON() )
   *       ^                                                ^
   *       ^                                                ^
   *       ^                                This will convert it to ISO 8601 format
   *       ^
   *     and this would derive **from an ISO 8601** string
   */

  it('should be a function', () => {
    expect(deriveStateFromLocalData).to.be.a('function')
  })

  it(
    'should return a serialized version of the passed JSON string (first argument), where any ' +
    'ISO8601 string is converted into moment',
    () => {
      const sampleData = {
        routines: [
          {
            id: '1',
            routineName: 'Routine One',
            duration: createMomentDerivedFromIso('2013-02-08 09:30:26.123'),
          },
          {
            id: '2',
            routineName: 'Routine One',
            duration: createMomentDerivedFromIso(),
          },
        ],
      }
      const stringifiedSampleData = JSON.stringify(sampleData)

      const expected = sampleData
      const actual = deriveStateFromLocalData(stringifiedSampleData)

      expect(actual).to.deep.equal(expected)
    }
  )

  context(
    'when a tracker was running, some time is past (based on the second, ISO 8601 string ' +
    'argument), but the routine shouldn\'t be complete yet',
    () => {
      it('should reduce the timeLeft accordingly', () => {
        fakeClock = lolex.install({
          now: moment('2013-02-08 13:30:30.500').toDate(),
        })

        const timeLastTracked = moment('2013-02-08 13:00:00.000').toJSON()
        const sampleData = {
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
            },
            {
              id: '2',
              routineName: 'Routine One',
              isTracking: true,
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
              timeLeft: createMomentDerivedFromIso('2013-02-08 01:30:30.500'),
            },
          ],
        }
        const stringifiedSampleData = JSON.stringify(sampleData)

        const expected = {
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
            },
            {
              id: '2',
              routineName: 'Routine One',
              isTracking: true,
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
              timeLeft: createMomentDerivedFromIso('2013-02-08 01:00:00.000'),
            },
          ],
        }
        const actual = deriveStateFromLocalData(stringifiedSampleData, timeLastTracked)

        expect(actual).to.deep.equal(expected)
      })
    }
  )

  context('when a tracker was running, some time is past, and it should be completed already', () => {
    it('should adjust the routine data accordingly', () => {
      // In this scenario, more time is past than what is necessary to finish the tracker
      const testWithExcessiveTime = () => {
        fakeClock = lolex.install({
          now: moment('2013-02-09 00:00:00.000').toDate(),
        })

        const timeLastTracked = moment('2013-02-08 13:00:00.000').toJSON()
        const sampleData = {
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
            },
            {
              id: '2',
              routineName: 'Routine One',
              isTracking: true,
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
              timeLeft: createMomentDerivedFromIso('2013-02-08 01:30:30.500'),
            },
          ],
        }
        const stringifiedSampleData = JSON.stringify(sampleData)

        const expected = {
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
            },
            {
              id: '2',
              routineName: 'Routine One',
              isDone: true,
              isTracking: false,
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
              timeLeft: null,
              shouldNotify: true,
            },
          ],
        }
        const actual = deriveStateFromLocalData(stringifiedSampleData, timeLastTracked)

        expect(actual).to.deep.equal(expected)
      }

      // In this scenario, on the other hand,
      // only the exact time necessary to finish the tracker has passed
      const testWithExactTime = () => {
        fakeClock = lolex.install({
          now: moment('2013-02-08 14:30:30.500').toDate(),
        })

        const timeLastTracked = moment('2013-02-08 13:00:00.000').toJSON()
        const sampleData = {
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
            },
            {
              id: '2',
              routineName: 'Routine One',
              isTracking: true,
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
              timeLeft: createMomentDerivedFromIso('2013-02-08 01:30:30.500'),
            },
          ],
        }
        const stringifiedSampleData = JSON.stringify(sampleData)

        const expected = {
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
            },
            {
              id: '2',
              routineName: 'Routine One',
              isDone: true,
              isTracking: false,
              duration: createMomentDerivedFromIso('2013-02-08 12:00:00.000'),
              timeLeft: null,
              shouldNotify: true,
            },
          ],
        }
        const actual = deriveStateFromLocalData(stringifiedSampleData, timeLastTracked)

        expect(actual).to.deep.equal(expected)
      }

      testWithExcessiveTime()
      testWithExactTime()
    })
  })
})
