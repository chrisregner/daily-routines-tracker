import { expect } from 'chai'

import * as selectors from './selectors'

describe('REDUX: selectors', () => {
  it('should have selector that gets a routine by id', () => {
    const expected = {
      id: '2',
      routineName: 'Second routine',
    }

    const actual = selectors.getRoutineById(
      {
        routines: [
          {
            id: '1',
            routineName: 'First routine',
          },
          {
            id: '2',
            routineName: 'Second routine',
          },
          {
            id: '3',
            routineName: 'Third routine',
          },
        ]
      },
      '2'
    )

    expect(actual).to.deep.equal(expected)
  })

  it('should have selector that gets all routines with shouldNotify property set to true', () => {
    const expected = [
      {
        id: '1',
        routineName: 'First routine',
        shouldNotify: true,
      },
      {
        id: '3',
        routineName: 'Third routine',
        shouldNotify: true,
      },
    ]

    const actual = selectors.getRoutinesThatShouldNotify(
      {
        routines: [
          {
            id: '1',
            routineName: 'First routine',
            shouldNotify: true,
          },
          {
            id: '2',
            routineName: 'Second routine',
          },
          {
            id: '3',
            routineName: 'Third routine',
            shouldNotify: true,
          },
        ]
      },
      '2'
    )

    expect(actual).to.deep.equal(expected)
  })
})
