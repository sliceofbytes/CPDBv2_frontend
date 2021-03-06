import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import baseStyles from 'components/officer-page/tabbed-pane-section/timeline/item/showings/base-item.sass';
import styles from './unit-change.sass';


export default function UnitChange(props) {
  const { unitName, oldUnitName, oldUnitDescription, unitDescription, date } = props.item;

  return (
    <span className={ cx(baseStyles.baseItem, styles.unitChange) }>
      <span className='item-content unit-change-item-content'>
        <span className='unit-change-info'>
          {
            oldUnitName === 'Unassigned' ?
              <span className='old-unit unassigned'>Unassigned → </span>
              :
              <span className='old-unit'>{ oldUnitName } - { oldUnitDescription } → </span>
          }
          <span className='new-unit'>{ unitName } - { unitDescription }</span>
        </span>
        <span className='item-date unit-change-item-date'>{ date }</span>
      </span>
    </span>
  );
}

UnitChange.propTypes = {
  item: PropTypes.object,
};
