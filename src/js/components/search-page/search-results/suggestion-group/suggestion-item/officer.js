import React, { PropTypes } from 'react';

import SuggestionItemBase from './base';
import { grayTextStyle } from './base.style';
import { complaintsTextStyle, sustainedTextStyle } from './officer.style';


class OfficerItem extends SuggestionItemBase {
  renderSecondRow() {
    const { demographicInfo, complaintCount, sustainedCount } = this.props.suggestion;

    return (
      <div style={ grayTextStyle }>
        <span>{ demographicInfo }, </span>
        <span style={ complaintsTextStyle(complaintCount > 0) }>{ complaintCount } Complaints, </span>
        <span style={ sustainedTextStyle(sustainedCount > 0) }>{ sustainedCount } Sustained</span>
      </div>
    );
  }
}

OfficerItem.propTypes = {
  suggestion: PropTypes.object
};

OfficerItem.defaultProps = {
  suggestion: {},
  complaintCount: 0,
  sustainedCount: 0
};

export default OfficerItem;