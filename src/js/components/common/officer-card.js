import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import pluralize from 'pluralize';
import { kebabCase } from 'lodash';

import { wrapperStyle, lightTextStyle, boldTextStyle } from './officer-card.style';
import { getThisYear } from 'utils/date';
import {
  extraInfoStyle,
  noBorderSectionStyle,
  sectionStyle,
  sustainedStyle,
} from 'components/common/officer-card.style';
import Hoverable from 'components/common/higher-order/hoverable';
import StaticRadarChart from 'components/common/radar-chart/index';
import { roundedPercentile } from 'utils/calculations';


export class OfficerCard extends Component {
  render() {
    const {
      officerId,
      fullName,
      complaintCount,
      sustainedCount,
      birthYear,
      complaintPercentile,
      race,
      gender,
      style,
      hovering,
      percentile,
      openCardInNewPage,
      rank,
      footer,
    } = this.props;
    const officerSlug = kebabCase(fullName);

    const complaintString = () => {
      const complaint = `${complaintCount} ${pluralize('Allegation', complaintCount)}`;
      const sustained = `${sustainedCount} Sustained`;
      return (
        <span className='test--officer-card-metric'>
          <span>{ complaint }</span> <span style={ sustainedStyle(hovering) }>{ sustained }</span>
        </span>
      );
    };

    const ageString = () => {
      if (!birthYear) {
        return '';
      }
      const age = getThisYear() - birthYear - 1;
      return `${age}-year-old`;
    };

    const extraInfo = () => {
      return `${ageString()} ${race} ${gender}`;
    };

    const complaintPercentileString = (hovering) => {
      if (complaintPercentile) {
        const complaintFormat = roundedPercentile(complaintPercentile);
        return (
          <p
            style={ lightTextStyle(hovering) }
            className='test--officer-card-percentile'
          >
            More than { complaintFormat }% of other officers
          </p>
        );
      }
      return '';
    };

    const chartData = percentile && percentile.items;

    const radarConfig = {
      width: 230,
      height: 100,
      radius: 40,
      backgroundColor: percentile ? percentile.visualTokenBackground : undefined,
    };

    return (
      <Link
        to={ `/officer/${officerId}/${officerSlug}/` }
        style={ { ...wrapperStyle(hovering), ...style } }
        target={ openCardInNewPage ? '_blank' : null }
        className='test--officer-card'
      >
        <StaticRadarChart data={ chartData } { ...radarConfig } />
        <div>
          <div style={ sectionStyle }>
            <p style={ lightTextStyle(hovering) } className='test--officer-card-rank'>{ rank }</p>
            <p style={ boldTextStyle(hovering) } className='test--officer-card-name'>{ fullName }</p>
          </div>
          <div style={ sectionStyle }>
            <p style={ boldTextStyle(hovering) }>{ complaintString() }</p>
            { complaintPercentileString(hovering) }
          </div>
          <div style={ noBorderSectionStyle } className='test--officer-card-demographic'>
            <p style={ extraInfoStyle(hovering) }>{ extraInfo() }</p>
          </div>
          { footer }
        </div>
      </Link>
    );
  }
}

OfficerCard.propTypes = {
  officerId: PropTypes.number,
  fullName: PropTypes.string,
  visualTokenBackgroundColor: PropTypes.string,
  style: PropTypes.object,
  complaintCount: PropTypes.number,
  sustainedCount: PropTypes.number,
  complaintPercentile: PropTypes.number,
  birthYear: PropTypes.number,
  race: PropTypes.string,
  gender: PropTypes.string,
  hovering: PropTypes.bool,
  percentile: PropTypes.object,
  openCardInNewPage: PropTypes.bool,
  rank: PropTypes.string,
  footer: PropTypes.object,
};

OfficerCard.defaultProps = {
  openCardInNewPage: false
};

export default Hoverable(OfficerCard);