import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { toggleLeftDrawer, toggleRightDrawer, toggleBottomDrawer } from '../../redux/actions';
import LeftDrawer from '../LeftDrawer/LeftDrawer';
import RightDrawer from '../RightDrawer/RightDrawer';
import Ticker from '../Ticker/Ticker';
import { drawerWidth } from '../../redux/constants';
import {config} from "../../config";
import './Main.scss'

const styles = theme => ({
  toolbar: {
    "background-color": '#076293',
    "font-family": `'Open Sans', sans-serif  !important`,
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    [theme.breakpoints.up('md')]: {
      marginLeft: `40px`,
    }
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 5,
    color: "#fff"
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  navLogo: {
    cursor: 'pointer',
    fontFamily: 'Gobold Bold Italic, Open Sans, sans-serif;',
    color: '#fff'
  }
});

class Main extends Component {

  componentDidUpdate() {
  }

  resetView () {
    const { map, width } = this.props;

    toggleLeftDrawer(false);
    toggleRightDrawer(false);
    toggleBottomDrawer(false);

    map.flyTo({
      center: config.map.center,
      zoom:  width === 'xs' || width === 'sm' ? config.map.zoom.mobile : config.map.zoom.desktop
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <AppBar className={classes.toolbar + " toolbar"}>
            <Toolbar disableGutters={true}>
              <Hidden mdUp>
              <IconButton
                aria-label="open drawer"
                onClick={()=>{toggleLeftDrawer(true)}}
                className={classNames(classes.menuButton)}>
                <MenuIcon/>
              </IconButton>
              </Hidden>
              <div className={classes.flex}>
                <div className={classes.navLogo}><span onClick={()=>{this.resetView()}}>CHBP | Map</span></div>
              </div>
              <Button onClick={()=>{toggleRightDrawer(true)}} className="vendorButton">Event List</Button>
            </Toolbar>
          </AppBar>
          <LeftDrawer/>
          <RightDrawer/>
          <Ticker/>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
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

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Main));