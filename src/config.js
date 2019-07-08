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
  }
}

export {config}