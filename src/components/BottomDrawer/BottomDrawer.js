import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Close} from '@material-ui/icons';
import html from 'html-react-parser';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {connect} from "react-redux";
import {toggleBottomDrawer} from '../../redux/actions';
import './BottomDrawer.scss';
import {
  LAYER_BAR_RETAIL_SERVICE_LABEL,
  LAYER_BAR_RETAIL_SERVICE_SELECTED,
  LAYER_BEER_GARDEN_LOUNGE_OUTLINE,
  LAYER_FREE_EVENTS_LABEL,
  LAYER_FREE_EVENTS_SELECTED,
  LAYER_NONPROFIT_LABEL,
  LAYER_NONPROFIT_SELECTED
} from "../../redux/constants";

let parse = require('url-parse');


const styles = theme => ({
  sheet: {},
  list: {
    width: 250,
  },
  paperAnchorBottom: {
    'max-height': '85vh'
  },
  fullList: {
    width: 'auto',
  },
  modal: {
    position: 'unset'
  },
  icon: {
    position: 'fixed',
    right: '15px',
    cursor: 'pointer',
    color: '#333'
  }
});

class BottomSheet extends Component {

  imgIconTypeMap = {}

  imgIconNameMap = {}

  games = []

  render() {

    const {classes, bottomDrawer} = this.props;
    const {options, data} = bottomDrawer;
    const {open, anchor} = options;
    let header = this.getHeader(data);
    let website = this.getWebsite(data);

    return (
      <div>
        <SwipeableDrawer
          classes={{paperAnchorBottom: classes.paperAnchorBottom, modal: classes.modal}}
          anchor={anchor}
          open={open}
          onClose={() => {
            toggleBottomDrawer(false);
            this.clearAllHighlightFilters();
          }}
          onOpen={() =>toggleBottomDrawer(true)}
          disableBackdropTransition={true}
          disableSwipeToOpen={true}
        >
          <div className="wrapperText">
            {header}
            <Close
              className={classes.icon}
              onClick={() => {
                this.clearAllHighlightFilters();
                toggleBottomDrawer(false);
              }}
            >
              close
            </Close>

            <div className="content-wrapper">
              <div className="title">{data.name}</div>
              <div className="category">{data.type}</div>
              {website}
              <div className="custom-content-wrapper">

                {typeof data.description !== 'undefined' && data.description !== null ?
                  html(data.description.replace(/(?:\r\n|\r|\n)/g, '<br>')) : ''}

              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  clearMapFilter = (filterName) => {

    const {map} = this.props;
    map.setFilter(filterName,
      ["all",
        ["==", "id", 0],
      ]);
  }

  hideMapLayer = (layerName) => {

    const {map} = this.props;
    const visibility = map.getLayoutProperty(layerName, 'visibility');

    if (visibility === 'visible') {
      map.setLayoutProperty(layerName, 'visibility', 'none');
    }

  }

  clearAllHighlightFilters = () => {
    this.clearMapFilter(LAYER_BAR_RETAIL_SERVICE_SELECTED);
    this.clearMapFilter(LAYER_BAR_RETAIL_SERVICE_LABEL);
    this.clearMapFilter(LAYER_BEER_GARDEN_LOUNGE_OUTLINE);
    this.clearMapFilter(LAYER_NONPROFIT_LABEL);
    this.clearMapFilter(LAYER_NONPROFIT_SELECTED);
    this.clearMapFilter(LAYER_FREE_EVENTS_LABEL);
    this.clearMapFilter(LAYER_FREE_EVENTS_SELECTED);

    this.hideMapLayer(LAYER_BAR_RETAIL_SERVICE_SELECTED);
    this.hideMapLayer(LAYER_BAR_RETAIL_SERVICE_LABEL)
    this.hideMapLayer(LAYER_BEER_GARDEN_LOUNGE_OUTLINE)
    this.hideMapLayer(LAYER_NONPROFIT_LABEL)
    this.hideMapLayer(LAYER_NONPROFIT_SELECTED)
    this.hideMapLayer(LAYER_FREE_EVENTS_LABEL)
    this.hideMapLayer(LAYER_FREE_EVENTS_SELECTED)
  }

  getHeader(data) {

    let svgPin = this.imgIconTypeMap[data.type];
    let svgIcon = this.imgIconNameMap[data.name];

    // If icon exists, render
    if (typeof svgIcon !== "undefined") {
      return (<div className="key-wrapper">
          <div className="svg-icon">
            <img alt="Featured vendor icon" src={svgIcon}/>
          </div>
        </div>
      )
      // If custom pin exists
    } else if (typeof svgPin !== "undefined") {
      return (
        <div className="key-wrapper">
          <div className="key-id">
            {data.id}
          </div>
          <div className="svg-pin">
            <img alt="Vendor icon" src={svgPin}/>
          </div>
        </div>)
      // Show nothing
    } else {
      return null;
    }
  }

  getWebsite(data) {

    if (typeof data !== "undefined") {
      let website = typeof data.website !== "undefined" && data.website !== null && data.website.length > 0 ?
        (<a className="category" target="_blank" rel="noopener noreferrer"
            href={`https:/${parse(data.website).pathname}`}>https:/{parse(data.website).pathname}</a>) : null;
      return website;
    } else {
      return null;
    }
  }
}

BottomSheet.propTypes = {
  bottomDrawer: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    bottomDrawer: state.bottomDrawer,
    map: state.map
  };
}

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(BottomSheet));