import {createStore, applyMiddleware, compose} from 'redux';
import {reducer} from './reducer';
import {logger} from "../middleware/ga-middleware";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger),
  )
);

export {store};
