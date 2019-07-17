import React, {Component} from 'react';
import './Ticker.scss';
import schedule from '../../data/schedule_2019';
import Moment from 'moment';
import 'moment-timezone';
import {extendMoment} from 'moment-range';
import { Box } from '@material-ui/core';

class Ticker extends Component {

  constructor(props) {
    super(props);
    this.state = {nowPlaying: schedule};
    this.fetchIntervalHandle = null;
  }

  fetchNowPlaying() {
    const moment = extendMoment(Moment);
    const now = moment().tz("America/Los_Angeles");
    const nowPlaying = schedule.filter((artist) => {
      const start = moment(artist.start_time, 'YYYY-MM-DD HH:mm');
      const end   = moment(artist.end_time, 'YYYY-MM-DD HH:mm');
      const range = moment.range(start, end);
      return range.contains(now);
    })
    this.setState({
      nowPlaying: nowPlaying
    });
  }

  componentDidMount() {
    this.fetchNowPlaying();
    this.fetchIntervalHandle = setInterval(() => this.fetchNowPlaying(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchIntervalHandle);
  }

  render() {
    return(
      <Box component="div" display={this.state.nowPlaying.length > 0 ? "block" : "none"}>
        <div className="nowPlaying">NOW PLAYING:</div>
        <div className="tickerWrap">
          <div className="ticker">
            {
              this.state.nowPlaying.map((set, index) => 
                <span key={index} className="tickerItem">
                  ...{set.stage.toUpperCase()} - {set.artist.toUpperCase()}...
                </span>
              )
            }
          </div>
        </div>
      </Box>
    );
  }
}

export default Ticker;