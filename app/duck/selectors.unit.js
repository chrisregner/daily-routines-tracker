import { expect } from 'chai'

import * as selectors from './selectors'

describe('REDUX: selectors', () => {
  it('should have selector for getting a routine by id', () => {
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
})
