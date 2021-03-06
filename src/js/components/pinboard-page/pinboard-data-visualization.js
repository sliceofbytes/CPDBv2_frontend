import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import GeographicContainer from 'containers/pinboard-page/geographic-container';
import SocialGraphContainer from 'containers/pinboard-page/social-graph-container';
import styles from './pinboard-data-visualization.sass';


export default class PinboardDataVisualization extends Component {
  expandedLink(visualizationName) {
    const { pinboard } = this.props;

    return `/${visualizationName}/pinboard/${pinboard.id}/`;
  }

  render() {
    const { hasMapMarker } = this.props;

    return (
      <div className={ styles.pinboardDataVisualization }>
        <div className='visualization-item'>
          <SocialGraphContainer />
          <Link to={ this.expandedLink('social-graph') } className='expanded-mode-btn'>Expand</Link>
        </div>
        {
          hasMapMarker &&
          (<div className='visualization-item'>
            <GeographicContainer />
            <Link to={ this.expandedLink('geographic') } className='expanded-mode-btn'>Expand</Link>
          </div>)
        }
      </div>
    );
  }
}

PinboardDataVisualization.propTypes = {
  pinboard: PropTypes.object,
  hasMapMarker: PropTypes.bool,
};

PinboardDataVisualization.defaultProps = {
  pinboard: {},
  hasMapMarker: false,
};
