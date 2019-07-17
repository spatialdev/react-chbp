/********************
 *
 * Global application configuration
 *
 ********************/

const config = {
  "ga": {
    "id": "UA-XXXXXXXX-X",
    "event": {
      "vendor": {
        "CATEGORY": "Vendor",
        "action": {
          "MAP_CLICK": "Map Click Select",
          "RIGHT_PANEL_VENDOR_SELECT": "Vendor List Select (Right Panel)",
          "LEFT_PANEL_VENDOR_SELECT": "Featured Vendor Select (Left Panel)"
        }
      },
      "geoLocate": {
        "CATEGORY": "GeoLocate",
        "action": {
          "SELECT": "Select Geolocate button",
          "ERROR": "Error",
          "SUCCESS": "Get Position Success",
          "OUT_OF_BOUNDS": "Get Position Out of bounds"
        }
      },
      "ui": {
        "CATEGORY": "UI Interaction",
        "action": {"RIGHT_MENU_SELECT": "Right panel open", "LEFT_MENU_SELECT": "Left panel open"}
      }
    }
  },
  "map": {
    "accessToken": "pk.eyJ1Ijoic3BhdGlhbGRldiIsImEiOiJjanh0bHczc2Qwdnd0M25udGQzZm9tcTBzIn0.MnBju8Y2wP6N6nFm4nNu7A",
    "style": "mapbox://styles/spatialdev/cjxyccxk90prc1cpyq11zt62g",
    "center": [-122.319, 47.614],
    "bounds": [[-122.32140396058543, 47.612702531671545], [-122.3144109050901, 47.61535256842217]],
    "zoom": 16.75,
    "bearing": 270
  }
};

export {config}