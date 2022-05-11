import React, {Component} from "react";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth/index";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";
import {config} from '../../config';
import {
  findMyLocation,
  setBottomDrawerData,
  toggleBottomDrawer,
  setMap,
  selectMapItem
} from "../../redux/actions";
import {
  FIND_MY_LOCATION_ERROR,
  FIND_MY_LOCATION_SUCCESS,
  LAYER_BAR_RETAIL_SERVICE,
  LAYER_BAR_RETAIL_SERVICE_LABEL,
  LAYER_BAR_RETAIL_SERVICE_SELECTED,
  LAYER_BEER_GARDEN, LAYER_BEER_GARDEN_LOUNGE_LABEL,
  LAYER_BEER_GARDEN_LOUNGE_OUTLINE,
  LAYER_FREE_EVENTS,
  LAYER_FREE_EVENTS_LABEL, LAYER_FREE_EVENTS_POLYGON, LAYER_FREE_EVENTS_SELECTED,
  LAYER_NONPROFIT,
  LAYER_NONPROFIT_LABEL, LAYER_NONPROFIT_SELECTED,
  LAYER_STAGE
} from "../../redux/constants";

mapboxgl.accessToken = config.map.accessToken;

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

class Map extends Component {
  geoLocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });

  bearingControl = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: false
  });

  componentDidMount() {

    const {width} = this.props;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: config.map.style,
      center: config.map.center,
      zoom: width === 'xs' || width === 'sm' ? config.map.zoom.mobile : config.map.zoom.desktop,
      bearing: width === 'xs' || width === 'sm' ? config.map.bearing.mobile : config.map.bearing.desktop
    });

    map.addControl(this.geoLocate);
    map.addControl(this.bearingControl);

    // Fired on each Geolocation API position update which returned as success.
    this.geoLocate.on('geolocate', this.handleGeolocationSuccess);

    // Catch GeolocateControl errors
    this.geoLocate.on("error", this.handleGeolocationError);

    map.on("load", () => {});

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
    const data = features[0];
    const {map} = this.props;
    const layer = data.layer.id;
    // Map containing list of highlight layers associated with each layer. For example, the "bars-retail-service" layer
    // has two additional layers rendered on top: "bars-retail-service-selected" and "bars-retail-service-label"
    const layerHighLightMap = {
      [LAYER_STAGE]: [LAYER_BEER_GARDEN_LOUNGE_OUTLINE],
      [LAYER_BAR_RETAIL_SERVICE]: [LAYER_BAR_RETAIL_SERVICE_SELECTED, LAYER_BAR_RETAIL_SERVICE_LABEL],
      [LAYER_BEER_GARDEN]: [LAYER_BEER_GARDEN_LOUNGE_OUTLINE],
      [LAYER_BEER_GARDEN_LOUNGE_LABEL]: [LAYER_BEER_GARDEN_LOUNGE_OUTLINE],
      [LAYER_NONPROFIT]: [LAYER_NONPROFIT_LABEL, LAYER_NONPROFIT_SELECTED],
      [LAYER_FREE_EVENTS]: [LAYER_FREE_EVENTS_LABEL, LAYER_FREE_EVENTS_SELECTED],
      [LAYER_FREE_EVENTS_POLYGON]: [LAYER_BEER_GARDEN_LOUNGE_OUTLINE]
    };
    let highlightLayer =  typeof layerHighLightMap[layer] === "object" ? layerHighLightMap[layer] : null;
    if (highlightLayer !== null) {
      highlightLayer.forEach(layer => {
        map.setLayoutProperty(layer, "visibility", "visible");
      })
    }

    setBottomDrawerData(data.properties);
    toggleBottomDrawer(true);
    // Record feature selection on google analytics
    selectMapItem(data.properties.name);

    map.setFilter(LAYER_BEER_GARDEN_LOUNGE_OUTLINE, [
      "all",
      ["!=", "type", "Restaurant / Bar"],
      ["==", "id", data.properties.id]
    ]);

    map.setFilter(LAYER_BAR_RETAIL_SERVICE_LABEL, [
      "all",
      ["==", "id", data.properties.id]
    ])

    map.setFilter(LAYER_BAR_RETAIL_SERVICE_SELECTED, [
      "all",
      ["==", "id", data.properties.id]
    ])

    map.setFilter(LAYER_NONPROFIT_LABEL, [
      "all",
      ["==", "id", data.properties.id]
    ])

    map.setFilter(LAYER_NONPROFIT_SELECTED, [
      "all",
      ["==", "id", data.properties.id]
    ])

    map.setFilter(LAYER_FREE_EVENTS_LABEL, [
      "all",
      ["==", "id", data.properties.id]
    ])

    map.setFilter(LAYER_FREE_EVENTS_SELECTED, [
      "all",
      ["==", "id", data.properties.id]
    ])
  }

  /**
   * Overwrite the GeolocateControl _updateCamera function
   * // TODO Don't track user location if out of bounds. Consider going back to custom implementation
   * @param position
   */
  handleGeolocationSuccess = position => {

    // get geolocation
    const location = new mapboxgl.LngLat(
      position.coords.longitude,
      position.coords.latitude
    );

    // "Long,Lat"
    let formattedLocation = [location.lng, location.lat].join(",");

    findMyLocation({
      type: FIND_MY_LOCATION_SUCCESS,
      payload: formattedLocation
    });
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
      layers: [
        LAYER_FREE_EVENTS,
        LAYER_FREE_EVENTS_LABEL,
        LAYER_FREE_EVENTS_SELECTED,
        LAYER_FREE_EVENTS_POLYGON,
        LAYER_NONPROFIT,
        LAYER_NONPROFIT_LABEL,
        LAYER_NONPROFIT_SELECTED,
        LAYER_STAGE,
        LAYER_BAR_RETAIL_SERVICE,
        LAYER_BAR_RETAIL_SERVICE_LABEL,
        LAYER_BAR_RETAIL_SERVICE_SELECTED,
        LAYER_BEER_GARDEN,
        LAYER_BEER_GARDEN_LOUNGE_OUTLINE,
        LAYER_BEER_GARDEN_LOUNGE_LABEL
      ]
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
