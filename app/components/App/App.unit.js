import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

describe('<App />', () => {
  it('should render', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })

  describe('its subcomponents/routes', () => {
    it('should have the \'Home page\' route')
    it('should have the \'Routine Form\' route')

    describe('the \'Routine Form\' route', () => {
      context('when id route param is \'new\'', () => {
        it('should use the <AddNewRoutineForm /> component with React Router\'s props')
      })

      context('when id route param is not \'new\'', () => {
        it('should use the <EditRoutineForm /> component with React Router\'s props')
      })
    })
  })
})
