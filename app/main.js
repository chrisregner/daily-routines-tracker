import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import App from 'components/App'
import configureStore from 'duck/store'
import deriveStateFromLocalData from 'services/deriveStateFromLocalData'
import './styles/main.css'

const stateFromLocalData = deriveStateFromLocalData(
    window.localStorage.getItem('state'),
    window.localStorage.getItem('timeLastOpen'),
  )

const store = configureStore(stateFromLocalData)

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

if (module.hot)
  module.hot.accept('components/App', () => {
    const NextApp = require('components/App').default
    render(NextApp)
  })
