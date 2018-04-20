import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { map } from 'lodash';

import {
  wrapperStyle,
  titleStyle,
  listStyle,
  listItemStyle,
  itemKeyStyle,
  itemValueStyle,
  arrowStyle,
  clearfixStyle,
} from './officer-info-widget.style';
import { imgUrl } from 'utils/static-assets';


export default class OfficerInfoWidget extends Component {
  render() {
    const {
      fullName,
      age,
      race,
      gender,
      badge,
      rank,
      unit,
      appointedDate,
      resignationDate,
    } = this.props;

    const listInfo = [
      {
        key: '',
        value: `${age} year old, ${race.toLowerCase()}, ${gender.toLowerCase()}.`,
      },
      {
        key: 'Badge',
        value: badge,
      },
      {
        key: 'Rank',
        value: rank,
      },
      {
        key: 'Unit',
        value: unit.description || unit.unitName,
        title: unit.description,
        url: `/unit/${unit.unitName}`,
      },
      {
        key: 'Career',
        value: `${appointedDate} — ${resignationDate || 'Present'}`,
      },
    ];

    return (
      <div style={ wrapperStyle }>
        <h1 style={ titleStyle }>{ fullName }</h1>
        <ul style={ listStyle }>
          {
            map(listInfo, (metric) => (
              <li style={ listItemStyle } key={ `item-${metric.key}` }>
                { metric.key && <div style={ itemKeyStyle }>{ metric.key }</div> }
                <div
                  title={ metric.title }
                  style={ itemValueStyle(!!metric.key) }
                >
                  { metric.value }
                </div>
                { metric.url && (
                  <Link to={ metric.url }>
                    <img src={ imgUrl('disclosure-indicator.svg') } style={ arrowStyle }/>
                  </Link>
                ) }
                <div style={ clearfixStyle } />
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

OfficerInfoWidget.defaultProps = {
  race: 'white',
  gender: 'male',
  badge: '',
  rank: 'Police Officer',
  unit: {},
  appointedDate: null,
  resignationDate: null,
};

OfficerInfoWidget.propTypes = {
  fullName: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  race: PropTypes.string,
  gender: PropTypes.string,
  badge: PropTypes.string,
  rank: PropTypes.string,
  unit: PropTypes.shape({
    id: PropTypes.number,
    unitName: PropTypes.string,
    description: PropTypes.string,
  }),
  appointedDate: PropTypes.string.isRequired,
  resignationDate: PropTypes.string,
};
