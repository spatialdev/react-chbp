import {
  SET_POLYGON_DATA, SET_BOTTOM_DRAWER_DATA, TOGGLE_RIGHT_DRAWER, TOGGLE_LEFT_DRAWER, TOGGLE_BOTTOM_DRAWER,
  SET_TAB_VALUE, SET_MAP
} from './constants'
import polygonData from '../data/chbp_data_2019.json';

// Sort feature collection by vendor name
const sortFeatures = (a, b) => {
  if (a.properties.name.trim() > b.properties.name.trim()) return 1;
  if (a.properties.name.trim() < b.properties.name.trim()) return -1;
}

const initialState = {
  polygonData: {
    ...polygonData,
    features: polygonData.features.filter(feature=>feature.geometry !== null).sort(sortFeatures)
  },
  leftDrawerOptions: {
    anchor: 'left',
    open: true
  },
  rightDrawerOptions: {
    anchor: 'right',
    open: false,
    tabs: {
      index: 0,
      name: 'All'
    }
  },
  bottomDrawer: {
    options: {
      anchor: 'bottom',
      open: false,
    },
    data: {}
  },
  map: {}
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_POLYGON_DATA:
      return {
        ...state, polygonData
      }
    case SET_BOTTOM_DRAWER_DATA:
      return {
        ...state, bottomDrawer: {
          ...state.bottomDrawer,
          data: action.data
        }
      }
    case TOGGLE_LEFT_DRAWER:
      return {
        ...state, leftDrawerOptions: {
          ...state.leftDrawerOptions,
          open: action.open
        }
      }
    case TOGGLE_RIGHT_DRAWER:
      return {
        ...state, rightDrawerOptions: {
          ...state.rightDrawerOptions,
          open: action.open
        }
      }
    case TOGGLE_BOTTOM_DRAWER:
      return {
        ...state, bottomDrawer: {
          ...state.bottomDrawer,
          options: {
            ...state.bottomDrawer.options,
            open: action.open
          }
        }
      }
    case SET_TAB_VALUE:
      return {
        ...state, rightDrawerOptions: {
          ...state.rightDrawerOptions,
          tabs: action.tabs
        }
      }

    case SET_MAP:

      return {
        ...state, map: action.map
      }
    default:
      return state;
  }
}

export {reducer, initialState};
  