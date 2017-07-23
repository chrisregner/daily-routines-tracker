import { createStore, applyMiddleware,compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import rootReducer from './reducers'

export default function configureStore (initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(ReduxThunk)
  ))

  if (module.hot)
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers')
      store.replaceReducer(nextRootReducer)
    })

  return store
}
