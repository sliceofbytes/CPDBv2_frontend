import React, { Component, PropTypes } from 'react';
import { find } from 'lodash';

import { biographySectionStyle, menuStyle, menuItemStyle } from './biography-section.style';
import Timeline from './timeline';


export default class BiographySection extends Component {

  constructor(props) {
    super(props);

    this.biographyTabs = [
      { name: 'TIMELINE', renderer: () => <Timeline items={ this.props.timelineItems }/> },
      { name: 'SUMMARY', renderer: null },
      { name: 'MAP', renderer: null },
      { name: 'COACCUSALS', renderer: null },
      { name: 'ATTACHMENTS', renderer: null },
    ];
    this.activeTabName = 'TIMELINE';
  }

  renderMenu() {

    return (
      <div style={ menuStyle } className='test--biography-section-menu'>
        {
          this.biographyTabs.map((biographyTab, index) => (
            <span
              key={ index }
              style={ menuItemStyle(biographyTab.name === this.activeTabName) }
              className='test--biography-tab-name'
            >
              { biographyTab.name }
            </span>)
          )
        }
      </div>
    );
  }

  renderBiography() {
    const activeTab = find(this.biographyTabs, (tab) => tab.name === this.activeTabName );
    return activeTab.renderer();
  }

  render() {
    return (
      <div style={ biographySectionStyle }>
        { this.renderMenu() }
        { this.renderBiography() }
      </div>
    );
  }
}

BiographySection.propTypes = {
  timelineItems: PropTypes.array
};

BiographySection.defaultProps = {
  timelineItems: []
};
