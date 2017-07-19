import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { AppContainer } from 'react-hot-loader'

import App from 'components/App'
import dailyRoutineTracker from 'duck/reducers'
import configureStore from 'duck/store'
import './styles/main.css'

let store = configureStore()

store.subscribe(() => {
  console.log(store.getState())
})

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)

if (module.hot) {
  module.hot.accept('components/App', () => {
    const NextApp = require('components/App').default
    render(NextApp)
  })
}