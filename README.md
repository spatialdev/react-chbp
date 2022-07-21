# react-chbp 🎸

https://map.capitolhillblockparty.com

The official interactive web application for Capitol Hill's annual Block Party! This interactive map will help you nagivate Seattle's premier showcase of the Pacific Northwest's best local talent.

## Development

- [React 16](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Node & npm](https://www.npmjs.com/)
- [MapboxGL.js](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Mapbox Studio](https://www.mapbox.com/mapbox-studio)

### Application

This project is a Single Page Application (SPA) bootstrapped by [Create React App](https://github.com/facebookincubator/create-react-app).

To get started, clone the repository and install the npm dependences
```bash
npm ci
```

Start the local development server
```
npm start
```
The app should be available at http://127.0.0.1:3000

### Data
Mapbox Studio is used to to host our static geojson file as a tileset, as well as a custom Mapbnox Style.

#### [chbp_data_2019.json](/src/data/chbp_data_2019.json)

Geojson FeatureCollection containing location and metadata for all event locations. This includes stages, sponsors, beer gardens, food courts, etc. Each feature contains a properties object with the following information

```json
  "properties": {
    "id": "351", // Unique feature id
    "details": null,
    "description": null,
    "name": "Main Stage", // Official feature name
    "website": null,
    "type": "State", // Feature type (Art/Music, Stage, Sponsor, etc.)
    "rotate": null, // Label rotation degree
    "left_panel": true // Used to display in left panel
  }
```

## Testing

/TODO

