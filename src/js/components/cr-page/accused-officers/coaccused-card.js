import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import pluralize from 'pluralize';

import StaticRadarChart from 'components/common/radar-chart';
import Hoverable from 'components/common/higher-order/hoverable';
import { roundedPercentile } from 'utils/calculations';

import {
  wrapperStyle, topSectionWrapperStyle, allegationTextStyle, sustainedTextStyle,
  percentileTextStyle, officerInfoTextStyle, bottomSectionWrapperStyle, categoryTextStyle,
  outcomeTextStyle, rankStyle, fullNameStyle, titleWrapperStyle, chartWrapperStyle,
  metricWrapperStyle, outcomeTextWrapperStyle
} from './coaccused-card.style';


class CoaccusedCard extends Component {
  render() {
    const {
      rank, fullname, allegationCount, sustainedCount, allegationPercentile, demographic,
      category, findingOutcomeMix, radarAxes, radarColor, id, hovering
    } = this.props;

    return (
      <Link to={ `/officer/${id}/` } style={ wrapperStyle(hovering) } className='test--accused-card'>
        <div style={ topSectionWrapperStyle }>
          <div>
            <div style={ chartWrapperStyle }>
              <StaticRadarChart
                width={ 38 }
                height={ 38 }
                radius={ 18 }
                hideAxisText={ true }
                data={ radarAxes }
                { ...radarColor }/>
            </div>
            <div style={ titleWrapperStyle }>
              <div style={ rankStyle } className='test--accused-card-rank'>{ rank }</div>
              <div style={ fullNameStyle(hovering) } className='test--accused-card-name'>{ fullname }</div>
            </div>
          </div>
          <div style={ metricWrapperStyle } className='test--accused-card-metric'>
            <span style={ allegationTextStyle }>
              { `${allegationCount} ${pluralize('allegation', allegationCount)}` }
            </span>
            <span style={ sustainedTextStyle(sustainedCount) }>{ `${sustainedCount} sustained` }</span>
          </div>
          <div style={ percentileTextStyle } className='test--accused-card-percentile'>
            More than { roundedPercentile(allegationPercentile) }% of other officers
          </div>
          <div style={ officerInfoTextStyle } className='test--accused-card-demographic'>
            { demographic }
          </div>
        </div>
        <div style={ bottomSectionWrapperStyle }>
          <div style={ categoryTextStyle(hovering) } className='test--accused-card-category'>{ category }</div>
          <div style={ outcomeTextWrapperStyle } className='test--accused-card-outcome'>
            <div style={ outcomeTextStyle }>{ findingOutcomeMix }</div>
          </div>
        </div>
      </Link>
    );
  }
}

CoaccusedCard.propTypes = {
  rank: PropTypes.string,
  fullname: PropTypes.string,
  allegationCount: PropTypes.number,
  sustainedCount: PropTypes.number,
  allegationPercentile: PropTypes.number,
  radarColor: PropTypes.object,
  radarAxes: PropTypes.array,
  demographic: PropTypes.string,
  category: PropTypes.string,
  id: PropTypes.number,
  findingOutcomeMix: PropTypes.string,
  hovering: PropTypes.bool
};

CoaccusedCard.defaultProps = {
  percentile: {
    items: []
  },
  findingOutcomeMix: ''
};

export default Hoverable(CoaccusedCard);