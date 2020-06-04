import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { take, slice, noop } from 'lodash';

import styles from './base-complaint-card.sass';
import MiniVisualToken from './mini-officer-visual-token';
import PlusButton from 'components/pinboard-page/relevant/common/plus-button';


export default class BaseComplaintCard extends Component {
  handleClick = e => {
    e.preventDefault();
    const { addItemInPinboardPage, rawData } = this.props;
    addItemInPinboardPage({
      type: 'CR',
      rawData,
      id: this.props.crid,
    });
  };

  handleFocus = () => {
    const { crid, focusItem } = this.props;
    focusItem({ type: 'CR', id: crid });
  };

  render() {
    const {
      incidentDate,
      category,
      officers,
      leftChild,
      pinned,
      leftHaftClick,
    } = this.props;

    const topOfficers = take(officers, 2);
    const otherOfficers = slice(officers, 2, 7);
    const notShowingOfficerCount = officers.length - topOfficers.length - otherOfficers.length;

    return (
      <div className={ styles.baseComplaintCard }>
        <div>
          <div className='left-half' onClick={ leftHaftClick ? this.handleFocus : noop }>
            { leftChild }
          </div>
          <div className='right-half' onClick={ this.handleFocus }>
            <div className='incident-date'>{ incidentDate }</div>
            <div className='category'>{ category }</div>
            <div className='top-officers'>
              { topOfficers.map(officer =>
                <div className='top-officer-row' key={ officer.id }>
                  <MiniVisualToken className='top-officer-row-token' percentile={ officer.percentile }/>
                  <div className='top-officer-row-officer-name'>{ officer.shortName }</div>
                </div>
              ) }
            </div>
            <div className='remaining-officers'>
              { otherOfficers.map(officer =>
                <MiniVisualToken className='remaining-officer' key={ officer.id } percentile={ officer.percentile }/>
              ) }
              {
                notShowingOfficerCount > 0 ?
                  <div className='not-showing-officer-count'>{ `${ notShowingOfficerCount }+` }</div>
                  : null
              }
            </div>
          </div>
        </div>
        { pinned || <PlusButton onClick={ this.handleClick } /> }
      </div>
    );
  }
}

BaseComplaintCard.propTypes = {
  leftChild: PropTypes.node,
  url: PropTypes.string,
  previewImageUrl: PropTypes.string,
  crid: PropTypes.string,
  incidentDate: PropTypes.string,
  category: PropTypes.string,
  point: PropTypes.object,
  officers: PropTypes.arrayOf(PropTypes.object),
  addItemInPinboardPage: PropTypes.func,
  pinned: PropTypes.bool,
  focusItem: PropTypes.func,
  rawData: PropTypes.object,
  leftHaftClick: PropTypes.bool,
};

BaseComplaintCard.defaultProps = {
  focusItem: noop,
  rawData: {},
  leftHaftClick: true,
};
