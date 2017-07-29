import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import deepMap from 'deep-map'
import moment from 'moment'

import App from 'components/App'
import configureStore from 'duck/store'
import stateFromLocalStorage from 'services/stateFromLocalStorage'
import './styles/main.css'

const store = configureStore(stateFromLocalStorage)

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
