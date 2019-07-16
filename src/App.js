import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Provider} from 'react-redux';
import {store} from './redux/store'
import Map from './components/Map/Map.js';
import BottomSheet from './components/BottomDrawer/BottomDrawer'
import Main from './components/Main/Main';
import {config} from './config';

import './App.scss';

class App extends Component {
  state = {
    clickedMenuItem: null,
    polygonData: null,
  };

  componentDidMount() {

    // Initialize Google Analytics
    const {ga} = config;
    ReactGA.initialize(ga.id, {
      debug: process.env.NODE_ENV === 'development',
      titleCase: false,
      gaOptions: {
        name: 'dev2018'
      }
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  handleMenuData = (itemId) => {
    this.setState({clickedMenuItem: itemId}, () => {
    });
  };

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Main clickedMenuItem={this.handleMenuData}/>
          <Map/>
          <BottomSheet/>
        </div>
      </Provider>
    );
  }
}

export default App;
