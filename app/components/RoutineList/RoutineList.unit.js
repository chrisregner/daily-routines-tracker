import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import moment from 'moment'
import td from 'testdouble'

import RoutineList, { customPropTypes } from './RoutineList'
import RoutineItem from './subcomponents/RoutineItem'

describe('COMPONENT: RoutineList', () => {
  const getRequiredProps = props => Object.assign({
    handlers: {
      sampleHandler: () => {},
    },
    isSorting: false,
    routines: [],
  }, props)

  afterEach(() => { td.reset() })

  it('should render without crashing', () => {
    const wrapper = shallow(<RoutineList {...getRequiredProps()} />)
    expect(wrapper).to.be.present()
  })

  context('when routines prop is passed', () => {
    const getItsSortableList = (wrapper) => (
      wrapper.find(wrapper.instance().SortableList)
    )
    const getItsSortableItem = (wrapper) => (
      getItsSortableList(wrapper)
        .dive()
        .dive()
        .find(wrapper.instance().SortableItem)
    )

    it('should render its sortable list', () => {
      const wrapper = shallow(
        <RoutineList {...getRequiredProps({
          routines: [{
            id: '1',
            routineName: 'First Routine',
          }],
        })} />
      )
      const itsSortableList = getItsSortableList(wrapper)

      expect(itsSortableList).to.have.lengthOf(1)
    })

    describe('its sortable list', () => {
      it('should receive the correct routines, onSortEnd props', () => {
        const passedRoutines = [{
          id: '1',
          routineName: 'First Routine',
        }]

        const wrapper = shallow(
          <RoutineList {...getRequiredProps({
            routines: passedRoutines,
          })} />
        )

        const itsSortableList = getItsSortableList(wrapper)

        const expected = {
          onSortEnd: wrapper.instance().handleSortEnd,
          routines: passedRoutines,
        }

        const actual = itsSortableList.props()

        expect(actual).to.deep.match(expected)
      })

      context('isSorting prop is set to true', () => {
        it('should receive false as useDragHandle as prop', () => {
          const wrapper = shallow(
            <RoutineList {...getRequiredProps({
              isSorting: true,
              routines: [{
                id: '1',
                routineName: 'First Routine',
              }],
            })} />
          )

          const itsSortableList = getItsSortableList(wrapper)

          expect(itsSortableList).to.have.prop('useDragHandle', false)
        })
      })

      context('isSorting prop is set to false', () => {
        it('should receive false as useDragHandle as prop', () => {
          const wrapper = shallow(
            <RoutineList {...getRequiredProps({
              isSorting: false,
              routines: [{
                id: '1',
                routineName: 'First Routine',
              }],
            })} />
          )

          const itsSortableList = getItsSortableList(wrapper)

          expect(itsSortableList).to.have.prop('useDragHandle', true)
        })
      })

      it('should render one of its sortable item for each passed routines', () => {
        const testWithRoutines = (routines) => {
          const wrapper = shallow(
            <RoutineList {...getRequiredProps({
              routines: routines,
            })} />
          )
          const itsSortableItems = getItsSortableItem(wrapper)

          expect(itsSortableItems).to.have.lengthOf(routines.length)
        }

        testWithRoutines([{
          id: '1',
          routineName: 'First Routine',
        }])

        testWithRoutines([
          {
            id: '1',
            routineName: 'First Routine',
          },
          {
            id: '2',
            routineName: 'Second Routine',
          },
          {
            id: '3',
            routineName: 'Third Routine',
          },
        ])
      })

      describe('its sortable item', () => {
        it('should receive the correct key, index and routineData props', () => {
          const passedRoutines = [
            {
              id: '1',
              routineName: 'First Routine',
            },
            {
              id: '2',
              routineName: 'Second Routine',
            }
          ]
          const wrapper = shallow(
            <RoutineList {...getRequiredProps({
              routines: passedRoutines,
            })} />
          )
          const itsSortableItems = getItsSortableItem(wrapper)

          const firstExpected = {
            index: 0,
            routineData: passedRoutines[0]
          }
          const firstActual = itsSortableItems.at(0).props()

          const secondExpected = {
            index: 1,
            routineData: passedRoutines[1]
          }
          const secondActual = itsSortableItems.at(1).props()

          expect(firstActual).to.deep.match(firstExpected)
          expect(secondActual).to.deep.match(secondExpected)
        })

        it('should render RoutineItem with the correct routineData and handlers as props', () => {
          // silence the warning about context created by sortableElement of react-sortable-hoc
          td.replace(console, 'error')

          const passedHandlers = {
            handlerOne: () => {},
            handlerTwo: () => {},
          }
          const passedRoutines = [
            {
              id: '1',
              routineName: 'First Routine',
            },
            {
              id: '2',
              routineName: 'Second Routine',
            }
          ]
          const wrapper = shallow(
            (
              <RoutineList {...getRequiredProps({
                routines: passedRoutines,
                handlers: passedHandlers,
              })} />
            )
          )
          const itsSortableItems = getItsSortableItem(wrapper)

          const firstExpected = {
            ...passedRoutines[0],
            ...passedHandlers,
          }
          const firstActual = itsSortableItems.at(0).dive().dive().find(RoutineItem).props()

          const secondExpected = {
            ...passedRoutines[1],
            ...passedHandlers,
          }
          const secondActual = itsSortableItems.at(1).dive().dive().find(RoutineItem).props()

          expect(firstActual).to.deep.match(firstExpected)
          expect(secondActual).to.deep.match(secondExpected)
        })
      })
    })
  })

  context('when no routines prop is passed', () => {
    it('should inform user that there are no routine', () => {
      const wrapper = shallow(
        <RoutineList {...getRequiredProps({
          routines: [],
        })} />
      )

      expect(wrapper.text()).to.contain('no routine')
    })
  })

  describe('method handleSortEnd()', () => {
    it('should call the passed handleSetRoutines with routines sorted according to its arguments', () => {
      const handleSetRoutines = td.function()
      const wrapper = shallow(
        <RoutineList {...getRequiredProps({
          handlers: {
            handleSetRoutines
          },
          routines: [
            {
              id: '1',
              routineName: 'First Routine',
            },
            {
              id: '2',
              routineName: 'Second Routine',
            },
            {
              id: '3',
              routineName: 'Third Routine',
            },
            {
              id: '4',
              routineName: 'Fourth Routine',
            },
          ],
        })} />
      )
      const handleSortEnd = wrapper.instance().handleSortEnd

      const expectedArg = [
        {
          id: '2',
          routineName: 'Second Routine',
        },
        {
          id: '3',
          routineName: 'Third Routine',
        },
        {
          id: '1',
          routineName: 'First Routine',
        },
        {
          id: '4',
          routineName: 'Fourth Routine',
        },
      ]

      td.verify(handleSetRoutines(), { times: 0, ignoreExtraArgs: true })
      handleSortEnd({ oldIndex: 0, newIndex: 2 })
      td.verify(handleSetRoutines(expectedArg), { times: 1, ignoreExtraArgs: true })
    })
  })
})
