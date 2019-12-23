import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';

import { defaultConfig } from 'utils/spring-presets';


export default function FadeMotion(props) {
  const { show, children, maxOpacity } = props;
  const defaultStyle = { opacity: show ? maxOpacity : 0 };
  const motionStyle = {
    opacity: spring(show ? maxOpacity : 0, defaultConfig()),
  };

  if (global.disableAnimation) {
    return show ? children(maxOpacity) : null;
  }

  return (
    <Motion
      defaultStyle={ defaultStyle }
      style={ motionStyle }>
      { ({ opacity }) => {
        if (opacity === 0 && !show) {
          return null;
        }

        return children(opacity);
      } }
    </Motion>
  );
}

FadeMotion.propTypes = {
  maxOpacity: PropTypes.number,
  children: PropTypes.func,
  show: PropTypes.bool,
};

FadeMotion.defaultProps = {
  maxOpacity: 1,
};
