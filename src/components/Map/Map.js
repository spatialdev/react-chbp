import React, {Component} from "react";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth/index";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import {
  findMyLocation,
  setBottomDrawerData,
  toggleBottomDrawer,
  setMap,
  selectMapItem
} from "../../redux/actions";
import {
  FIND_MY_LOCATION_ERROR,
  FIND_MY_LOCATION_OUT_OF_BOUNDS,
  FIND_MY_LOCATION_SELECT,
  FIND_MY_LOCATION_SUCCESS
} from "../../redux/constants";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3BhdGlhbGRldiIsImEiOiJjanh0bHczc2Qwdnd0M25udGQzZm9tcTBzIn0.MnBju8Y2wP6N6nFm4nNu7A";

const styles = theme => ({
  map: {
    [theme.breakpoints.down("sm")]: {
      position: "relative",
      // toolbar height
      top: "56px",
      height: `calc(100% - 56px)`
    },
    [theme.breakpoints.up("md")]: {
      position: "relative",
      // 65 = toolbar height
      top: "65px",
      // 280 = left drawer width
      left: "280px",
      height: `calc(100% - 65px)`,
      width: `calc(100% - 280px)`
    },
    [theme.breakpoints.up("lg")]: {
      position: "relative"
    }
  }
});

const CHBP_CENTROID = [-122.31817942477232, 47.61410334875629];
const CHBP_BOUNDS = [
  //southwest
  [-122.32140396058543, 47.612702531671545],
  //northeast
  [-122.3144109050901, 47.61535256842217]
];

class Map extends Component {
  geoLocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: CHBP_CENTROID,
      zoom: 17
    });

    map.addControl(this.geoLocate);

    // Replace GeolocateControl's _updateCamera function
    // see: https://github.com/mapbox/mapbox-gl-js/issues/6789
    // this.geoLocate._updateCamera = this.handleGeolocation;

    // Catch GeolocateControl errors
    this.geoLocate.on("error", this.handleGeolocationError);

    map.on("load", () => {
    });

    map.on("click", e => {
      this.handleMapClick(e);
    });

    // Set Map object in global state
    setMap(map);
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.map}>
        <div ref={el => (this.mapContainer = el)} className="GL-Map"/>
      </div>
    );
  }

  // Display feature info in bottom panel
  displayFeatureInfo(e, features) {
    const data = features[0].properties;
    const {map} = this.props;

    setBottomDrawerData(data);
    toggleBottomDrawer(true);
    // Record feature selection on google analytics
    selectMapItem(data.name);

    map.setFilter("vendor pins highlight", [
      "all",
      ["!=", "type", ""],
      ["!=", "type", ""],
      ["!=", "type", ""],
      ["!=", "type", ""],
      ["!=", "name", ""],
      ["!=", "name", ""],
      ["!=", "name", ""],
      ["==", "id", data.id],
      ["!=", "show_icon", true]
    ]);

    map.setLayoutProperty("vendor pins highlight", "visibility", "visible");
  }

  /**
   * Overwrite the GeolocateControl _updateCamera function
   * // TODO Don't track user location if out of bounds. Consider going back to custom implementation
   * @param position
   */
  handleGeolocation = position => {
    // get geolocation
    const location = new mapboxgl.LngLat(
      position.coords.longitude,
      position.coords.latitude
    );
    const bounds = this.map.getMaxBounds();
    // "Long,Lat"
    let formattedLocation = [location.lng, location.lat].join(",");
    // Report "select" action to google analytics
    findMyLocation({type: FIND_MY_LOCATION_SELECT, payload: null});

    if (bounds) {
      // if geolocation is within maxBounds
      if (
        location.lng >= bounds.getWest() &&
        location.lng <= bounds.getEast() &&
        location.lat >= bounds.getSouth() &&
        location.lat <= bounds.getNorth()
      ) {
        // Report "success" action to google analytics
        findMyLocation({
          type: FIND_MY_LOCATION_SUCCESS,
          payload: formattedLocation
        });
        // Zoom into user's location
        this.map.fitBounds(location.toBounds(position.coords.accuracy));
      } else {
        // Report "out of bounds" action to google analytics
        findMyLocation({
          type: FIND_MY_LOCATION_OUT_OF_BOUNDS,
          payload: formattedLocation
        });
        // TODO display a helpful message about being outside of bounds
      }
    }
  };

  /**
   * Catch GeolocateErrors and dispatch to middleware
   * see https://developer.mozilla.org/en-US/docs/Web/API/PositionError
   * @param error
   */
  handleGeolocationError = error => {
    let message;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        message = "The request to get user location timed out.";
        break;
      default:
        message = "Error handling Geolocation button select.";
    }

    findMyLocation({type: FIND_MY_LOCATION_ERROR, payload: message});
  };

  handleMapClick = e => {
    const {map} = this.props;

    // Fetch Map feature from specified layer list.
    // TODO grab this layer list from a configuration
    let features = map.queryRenderedFeatures(e.point, {
      layers: []
    });

    if (features.length > 0) {
      this.displayFeatureInfo(e, features);
    }
  };
}

function mapStateToProps(state) {
  return {
    polygonData: state.polygonData,
    active: state.active,
    leftDrawerOptions: state.leftDrawerOptions,
    map: state.map
  };
}

export default connect(mapStateToProps)(
  withWidth()(withStyles(styles, {withTheme: true})(Map))
);
