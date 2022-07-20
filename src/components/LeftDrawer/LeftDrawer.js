import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {OpenInNewSharp} from '@material-ui/icons';
import {
  toggleLeftDrawer,
  selectLeftMenuItem,
  toggleBottomDrawer,
  setBottomDrawerData
} from '../../redux/actions';
import {drawerWidth} from '../../redux/constants';
import turfCenter from '@turf/center';
import './LeftDrawer.scss';
import imgFlier from '../../images/chbp_doodle_logo_3.png';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  drawerPaper: {
    width: drawerWidth,
    height: '100%'
  },
  list: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '10px'
    }
  }
});

class LeftDrawer extends Component {

  handleItemSelection = (vendor) => {
    const {map, width} = this.props;
    // Get polygon/point center
    const bbox = turfCenter(vendor);

    // Zoom to center
    map.flyTo({
      center: bbox.geometry.coordinates,
      zoom: 18.5
    });

    // Set bottom drawer data
    setBottomDrawerData(vendor.properties);
    // Open bottom drawer
    toggleBottomDrawer(true);
    // Record selection on google analytics
    selectLeftMenuItem(vendor.properties.name);

    // If we're in mobile mode, close the left drawer
    if (width === 'xs' || width === 'sm') {
      toggleLeftDrawer(false);
    }
  };

  filterLeftMenuItems = data => {
    // Left menu items ordered by importance
    let leftMenuMap = {
      "Main Stage": [],
      "Vera Stage": [],
      "JuneShine Beer Garden": [],
      "Jameson Beer Garden": [],
      "Chophouse Row": []
    };
    const items = data.features;
    items.forEach(vendor => {
      if (vendor.properties.left_panel === true) {
        leftMenuMap[vendor.properties.name] = vendor;
      }
    });
    return Object.keys(leftMenuMap).map(key => leftMenuMap[key]);
  };

  componentDidUpdate() {
  }

  render() {
    const {classes, polygonData, leftDrawerOptions, width} = this.props;
    const {anchor, open} = leftDrawerOptions;
    const menuItems = this.filterLeftMenuItems(polygonData);
    // On large screens, make the left drawer permanently open
    const drawerVariant = (width === 'md' || width === 'lg' || width === 'xl') ? 'permanent' : 'temporary';

    return (
      <SwipeableDrawer
        variant={drawerVariant}
        anchor={anchor}
        open={open}
        onClose={() => toggleLeftDrawer(false)}
        onOpen={() => toggleLeftDrawer(true)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        {/* Drawer Flier Image */}
        <img alt='Official Capitol Hill Block Party Flier' className='Flier' src={imgFlier}/>

        {/*  Map Legend */}
        <div className="Legend">
          <div className="legend-title">Map legend:</div>
          <div className="legend-item-wrapper">
            <span className="legend-box">
              <span className="map-pin stage"></span>
            </span>
            <span className="legend-item-text">Stage</span>
          </div>
          <div className="legend-item-wrapper">
            <span className="legend-box">
              <span className="map-pin beer-garden"></span>
            </span>
            <span className="legend-item-text">Beer Garden / Food Court</span>
          </div>
          <div className="legend-item-wrapper">
            <span className="legend-box">
              <span className="map-pin free-events"></span>
            </span>
            <span className="legend-item-text">Free Event</span>
          </div>
          <div className="legend-item-wrapper">
            <span className="legend-box">
              <span className="map-pin sponsor"></span>
            </span>
            <span className="legend-item-text">Sponsor / Non-profit</span>
          </div>
          <div className="legend-item-wrapper">
            <span className="legend-box">
              <span className="map-pin art-music"></span>
            </span>
            <span className="legend-item-text">Art / Music</span>
          </div>
          <div className="legend-item-wrapper">
            <span className="legend-box">
              <span className="map-pin restaurant"></span>
            </span>
            <span className="legend-item-text">Restaurant / Bar / Retail / Service</span>
          </div>
        </div>

        <Divider/>

        {/*  Must See List */}
        <div className="legend-title sub-section">Don't Miss:</div>
        <List>
          {menuItems.map((item, index) => {
            return (
              <div key={item.properties.id}>
                <ListItem className="list-item-wrapper" button onClick={() => this.handleItemSelection(item)}>
                  <ListItemText disableTypography={true} classes={{root: 'list-item-text'}}
                    primary={item.properties.name}/>
                </ListItem>
              </div>
            );
          })}
          <Divider/>
          {/*  Go to https://www.capitolhillblockparty.com/ */}
          <a className="list-link" href="https://www.capitolhillblockparty.com/" target="_blank"
            rel="noopener noreferrer">
            <ListItem classes={{root: classes.list}} className="list-item-wrapper" button>
              <ListItemText disableTypography={true} classes={{root: 'list-item-text'}}
                            primary="Capitol Hill Block Party Official Website"/>
                              <OpenInNewSharp className="link-icon">open_in_new</OpenInNewSharp>
            </ListItem>
          </a>
        </List>
      </SwipeableDrawer>
    );
  }
}

LeftDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  polygonData: PropTypes.object.isRequired,
  leftDrawerOptions: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    polygonData: state.polygonData,
    active: state.active,
    leftDrawerOptions: state.leftDrawerOptions,
    map: state.map
  };
}

export default connect(mapStateToProps)(
  withWidth()(withStyles(styles, {withTheme: true})(LeftDrawer))
);
