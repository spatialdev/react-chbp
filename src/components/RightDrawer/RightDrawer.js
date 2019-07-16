import React, {Component} from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {withStyles} from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {
  toggleRightDrawer, setTabValue, toggleBottomDrawer,
  setBottomDrawerData, selectRightMenuItem
} from "../../redux/actions";
import './RightDrawer.scss';
import turfCenter from "@turf/center";
import {
  LAYER_BAR_RETAIL_SERVICE_LABEL,
  LAYER_BAR_RETAIL_SERVICE_SELECTED,
  LAYER_BEER_GARDEN_LOUNGE_OUTLINE, LAYER_FREE_EVENTS_LABEL, LAYER_FREE_EVENTS_SELECTED,
  LAYER_NONPROFIT_LABEL,
  LAYER_NONPROFIT_SELECTED
} from "../../redux/constants";

const styles = theme => ({
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72
  },
  drawerPaper: {
    height: '100%'
  }
});

const filters = [
  "All",
  "Stage",
  "Free Event",
  "Sponsor"
]

class RightMenu extends Component {

  // Update global state with tab index & selection
  handleTabChange = (event, value) => {
    setTabValue({index: value, name: filters[value]})
  };

  handleItemSelection = (feature) => {

    const {map, width} = this.props;
    // Get center of point/polygon
    const bbox = turfCenter(feature);

    // Highlight feature pin
    this.highlightFeatureLayer(feature);

    // Zoom to feature center
    map.flyTo({
      center: bbox.geometry.coordinates,
      zoom: 20.5
    });

    // Set bottom drawer data
    setBottomDrawerData(feature.properties);
    // Open bottom drawer
    toggleBottomDrawer(true);
    // Record action on google analytics
    selectRightMenuItem(feature.properties.name);

    // If we're in mobile mode, close the left drawer
    if (width === 'xs' || width === 'sm') {
      toggleRightDrawer(false);
    }
  }

  componentDidUpdate() {
  }

  componentDidMount() {
  }

  highlightFeatureLayer(feature) {

    const {map} = this.props;

    // Creates a map from the feature "type" to the highlight layers. For example, "type": "Stage" highlight layer is
    /// "beer-garden-lounge-outline"
    let typeHighlightMap = {
      "Stage": [LAYER_BEER_GARDEN_LOUNGE_OUTLINE],
      "Sponsor": [LAYER_NONPROFIT_LABEL, LAYER_NONPROFIT_SELECTED],
      "Free Event": [LAYER_FREE_EVENTS_LABEL, LAYER_FREE_EVENTS_SELECTED],
      "Art / Music": [LAYER_NONPROFIT_LABEL, LAYER_NONPROFIT_SELECTED],
      "Restaurant / Bar": [LAYER_BAR_RETAIL_SERVICE_SELECTED, LAYER_BAR_RETAIL_SERVICE_LABEL],
      "Retail": [LAYER_BAR_RETAIL_SERVICE_SELECTED, LAYER_BAR_RETAIL_SERVICE_LABEL],
      "Service": [LAYER_BAR_RETAIL_SERVICE_SELECTED, LAYER_BAR_RETAIL_SERVICE_LABEL],
      "Nonprofit": [LAYER_NONPROFIT_LABEL, LAYER_NONPROFIT_SELECTED]
    };

    let highlightLayer =  typeof typeHighlightMap[feature.properties.type.trim()] === "object" ? typeHighlightMap[feature.properties.type.trim()] : null;
    if (highlightLayer !== null) {
      console.log("HIGHLIGHT LAYER", highlightLayer)
      highlightLayer.forEach(layer => {
        map.setLayoutProperty(layer, "visibility", "visible");
      })
    }

    map.setFilter(LAYER_BEER_GARDEN_LOUNGE_OUTLINE, [
      "all",
      ["!=", "type", "Restaurant / Bar"],
      ["==", "id", feature.properties.id]
    ]);

    map.setFilter(LAYER_BAR_RETAIL_SERVICE_LABEL, [
      "all",
      ["==", "id", feature.properties.id]
    ])

    map.setFilter(LAYER_BAR_RETAIL_SERVICE_SELECTED, [
      "all",
      ["==", "id", feature.properties.id]
    ])

    map.setFilter(LAYER_NONPROFIT_LABEL, [
      "all",
      ["==", "id", feature.properties.id]
    ])

    map.setFilter(LAYER_NONPROFIT_SELECTED, [
      "all",
      ["==", "id", feature.properties.id]
    ])

    map.setFilter(LAYER_FREE_EVENTS_LABEL, [
      "all",
      ["==", "id", feature.properties.id]
    ])

    map.setFilter(LAYER_FREE_EVENTS_SELECTED, [
      "all",
      ["==", "id", feature.properties.id]
    ])

  }

  render() {

    const {rightDrawerOptions, polygonData, classes} = this.props;
    const {open, anchor, tabs} = rightDrawerOptions;

    let activeItems = polygonData.features.filter((item) => {
      return tabs.index !== 0 ? filters.indexOf(item.properties.type) === tabs.index : true;
    })

    return (
      <div className="RightMenu">
        <SwipeableDrawer
          classes={{
            paper: classes.drawerPaper
          }}
          className="RightMenuDrawer"
          anchor={anchor}
          open={open}
          onClose={() => toggleRightDrawer(false)}
          onOpen={() => toggleRightDrawer(true)}
        >

          <Tabs
            value={tabs.index}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            classes={{root: classes.tabsRoot}}
            textColor="primary"
            fullWidth
          >
            <Tab classes={{root: classes.tabRoot}} label="All"/>
            <Tab classes={{root: classes.tabRoot}} label="Stage"/>
            <Tab classes={{root: classes.tabRoot}} label="Free Event"/>
            <Tab classes={{root: classes.tabRoot}} label="Sponsor"/>
          </Tabs>

          <List
            className="ListWrapper"
            role="button"
            onClick={() => toggleRightDrawer(false)}
            onKeyDown={() => toggleRightDrawer(false)}
          >
            {activeItems.map((item) => {
              return (
                <ListItem onClick={() => this.handleItemSelection(item)} button key={item.properties.id}>
                  <ListItemText primary={item.properties.name}/>
                </ListItem>
              );
            })}
          </List>
        </SwipeableDrawer>
      </div>
    );
  }

}

RightMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    polygonData: state.polygonData,
    active: state.active,
    leftDrawerOptions: state.leftDrawerOptions,
    rightDrawerOptions: state.rightDrawerOptions,
    map: state.map
  };
}

export default connect(mapStateToProps)(withStyles(styles)(RightMenu));
