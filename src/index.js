import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer'
import scheduleReducer from './reducers/scheduleReducer'
import { combineReducers } from 'redux';
import * as serviceWorker from './serviceWorker';

const rootReducer = combineReducers({
  userReducer,
  scheduleReducer
})

const store = createStore(userReducer, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
