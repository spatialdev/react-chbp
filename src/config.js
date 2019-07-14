/********************
 *
 * Global application configuration
 *
 ********************/

const config = {
  // Google Analytics
  ga: {
    // Global GA identifier
    id: 'UA-XXXXXXXX-X',
    // Event Category constants
    event: {
      // Vendor click events
      vendor: {
        CATEGORY: 'Vendor',
        action: {
          MAP_CLICK: 'Map Click Select',
          RIGHT_PANEL_VENDOR_SELECT: 'Vendor List Select (Right Panel)',
          LEFT_PANEL_VENDOR_SELECT: 'Featured Vendor Select (Left Panel)'
        }
      },
      // Geolocate "Find Me" button
      geoLocate: {
        CATEGORY: 'GeoLocate',
        action: {
          SELECT: 'Select Geolocate button',
          ERROR: 'Error',
          SUCCESS: 'Get Position Success',
          OUT_OF_BOUNDS: 'Get Position Out of bounds'
        }
      },
      // User interaction w/ interface
      ui: {
        CATEGORY: 'UI Interaction',
        action: {
          RIGHT_MENU_SELECT: 'Right panel open',
          LEFT_MENU_SELECT: 'Left panel open'
        }
      }
    }
  },
  map: {
    accessToken: "pk.eyJ1Ijoic3BhdGlhbGRldiIsImEiOiJjanh0bHczc2Qwdnd0M25udGQzZm9tcTBzIn0.MnBju8Y2wP6N6nFm4nNu7A",
    centroid: [-122.31817942477232, 47.61410334875629],
    bounds: [
      // Southwest
      [-122.32140396058543, 47.612702531671545],
      // Northeast
      [-122.3144109050901, 47.61535256842217]
    ]
  }
}

export {config}