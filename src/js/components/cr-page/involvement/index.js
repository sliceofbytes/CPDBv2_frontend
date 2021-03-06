import PropTypes from 'prop-types';
import React from 'react';
import { map, keys, entries } from 'lodash';

import InvolvementItem from './involvement-item';
import styles from './involvement.sass';


export default function Involvement(props) {
  const { involvements } = props;

  if (!involvements || keys(involvements).length === 0) {
    return null;
  }

  return (
    <div className={ styles.involvement }>
      {
        map(entries(involvements), ([involvedType, officers], index) => (
          <InvolvementItem
            key={ index }
            className={ `test--involvement-${involvedType}` }
            involvedType={ involvedType }
            officers={ officers }
          />)
        )
      }
    </div>
  );
}

Involvement.propTypes = {
  involvements: PropTypes.object,
};
