import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

import responsiveContainerStyles from 'components/common/responsive-container.sass';
import PinnedSection from './pinned-section';
import cx from 'classnames';
import styles from './pinboard-page.sass';
import PinboardPaneSection from 'components/pinboard-page/pinboard-pane-section';


export default class PinboardPage extends Component {
  componentDidUpdate(prevProps, prevState) {
    const { shouldRedirect, pinboard } = this.props;
    if (shouldRedirect && pinboard.url !== '') {
      browserHistory.replace(pinboard.url);
    }
  }

  render() {
    const {
      pinboard,
      changePinboardTab,
      currentTab,
      hasMapMarker,
      itemsByTypes,
      removeItemInPinboardPage,
      isInitiallyLoading,
    } = this.props;

    if (isInitiallyLoading) {
      return null;
    }

    return (
      <div className={ cx(responsiveContainerStyles.responsiveContainer, styles.pinboardPage, 'pinboard-page') }>
        <Link to='/search/'>Back to search page</Link>
        <div className='pinboard-info'>
          <div className='pinboard-title'>{ pinboard.title }</div>
          <div className='pinboard-description'>{ pinboard.description }</div>
        </div>
        <div className='data-visualizations'>
          <PinboardPaneSection
            changePinboardTab={ changePinboardTab }
            currentTab={ currentTab }
            hasMapMarker={ hasMapMarker }
          />
        </div>
        <PinnedSection
          itemsByTypes={ itemsByTypes }
          removeItemInPinboardPage={ removeItemInPinboardPage }/>
      </div>
    );
  }
}

PinboardPage.propTypes = {
  pinboard: PropTypes.object,
  params: PropTypes.object,
  itemsByTypes: PropTypes.object,
  removeItemInPinboardPage: PropTypes.func,
  changePinboardTab: PropTypes.func,
  currentTab: PropTypes.string,
  hasMapMarker: PropTypes.bool,
  shouldRedirect: PropTypes.bool,
  isInitiallyLoading: PropTypes.bool,
};

PinboardPage.defaultProps = {
  itemsByTypes: {},
};
