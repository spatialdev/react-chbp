import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Close} from '@material-ui/icons';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {connect} from "react-redux";
import {toggleBottomDrawer} from '../../redux/actions';
import './BottomDrawer.scss';


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

    const {classes, bottomDrawer, map} = this.props;
    const {options, data} = bottomDrawer;
    const {open, anchor} = options;
    let style = this.getBottomSheetTemplate(data);
    let header = this.getHeader(data)

    return (
      <div>
        <SwipeableDrawer
          classes={{paperAnchorBottom: classes.paperAnchorBottom, modal: classes.modal}}
          anchor={anchor}
          open={open}
          onClose={() => {
            toggleBottomDrawer(false);
            // Clear highlight filter
            // map.setFilter('vendor pins highlight',
            //   ["all",
            //     ["==", "id", 0],
            //   ]);
          }}
          onOpen={() =>toggleBottomDrawer(true)}
          disableBackdropTransition={true}
          disableSwipeToOpen={true}
        >
          <div className="wrapperText">
            {header}
            <Close onClick={() => toggleBottomDrawer(false)} className={classes.icon}>
              close
            </Close>

            <div className="content-wrapper">
              <div className="title">{data.name}</div>
              <div className="category">{data.type}</div>
              <div className="custom-content-wrapper">

                {/*Need to show the following*/}
                {/*description,id,name,type,website*/}

                {data.description}

              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  getBottomSheetTemplate = (item) => {

    if (item.hasOwnProperty("id")) {
    }

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