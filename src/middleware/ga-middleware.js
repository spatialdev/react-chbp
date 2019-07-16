import {config} from '../config';
import {
  TOGGLE_RIGHT_DRAWER, TOGGLE_LEFT_DRAWER,
  FIND_MY_LOCATION_ERROR,
  FIND_MY_LOCATION_SUCCESS,
  FIND_MY_LOCATION_OUT_OF_BOUNDS,
  FIND_MY_LOCATION_SELECT,
  RIGHT_PANEL_VENDOR_SELECT,
  LEFT_PANEL_VENDOR_SELECT,
  MAP_VENDOR_SELECT
} from '../redux/constants';
import ReactGA from 'react-ga';

const logger = store => next => action => {

  const {type} = action;
  const {event} = config.ga;

  //TODO case statement ????
  if (type === TOGGLE_RIGHT_DRAWER) {
    // Record right menu button click
    ReactGA.event({
      category: event.ui.CATEGORY,
      action: event.ui.action.RIGHT_MENU_SELECT,
      label: action.open ? 'open' : 'close'
    });

  } else if (type === TOGGLE_LEFT_DRAWER) {

    // Record left menu button click
    ReactGA.event({
      category: event.ui.CATEGORY,
      action: event.ui.action.LEFT_MENU_SELECT,
      label: action.open ? 'open' : 'close'
    });

  } else if (type === RIGHT_PANEL_VENDOR_SELECT) {

    // Record left menu "Must See" item selection
    ReactGA.event({
      category: event.vendor.CATEGORY,
      action: event.vendor.action.RIGHT_PANEL_VENDOR_SELECT,
      label: action.name
    })

  } else if (type === LEFT_PANEL_VENDOR_SELECT) {

    // Record right menu vendor list item selection
    ReactGA.event({
      category: event.vendor.CATEGORY,
      action: event.vendor.action.LEFT_PANEL_VENDOR_SELECT,
      label: action.name
    });

  } else if (type === MAP_VENDOR_SELECT) {

    // Record vendor selection from Map click
    ReactGA.event({
      category: event.vendor.CATEGORY,
      action: event.vendor.action.MAP_CLICK,
      label: action.name
    });

  } else if (type === FIND_MY_LOCATION_ERROR
    || type === FIND_MY_LOCATION_SUCCESS
    || type === FIND_MY_LOCATION_OUT_OF_BOUNDS
    || type === FIND_MY_LOCATION_SELECT) {

    // All geolocate events start with "FIND_MY_LOCATION_". The suffix corresponds to the action type in
    // config.js under ga.geoLocate
    let prefix = 'FIND_MY_LOCATION_';
    let locationAction = action.type.substr(prefix.length, action.type.length);

    let eventOptions = {
      category: event.geoLocate.CATEGORY,
      action: event.geoLocate.action[locationAction],
      label: action.payload
    }

    // Delete label if payload is null
    if (action.payload === null) delete event.label

    ReactGA.event(eventOptions);

  }

  let result = next(action)
  return result
}

export {logger}