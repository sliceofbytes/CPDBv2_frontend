import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Bubble from './bubble';
import Input from 'components/common/input';
import { inputStyle } from './url-input.style';


export default class UrlInput extends Component {
  handleChange = event => {
    if (event.target.value !== this.props.value) {
      this.props.onChange(event.target.value);
    }
  };

  render() {
    const { style, value, onMouseOver, onMouseOut, onFocus, onBlur } = this.props;
    return (
      <Bubble style={ style } onMouseOver={ onMouseOver } onMouseOut={ onMouseOut }>
        <Input
          style={ inputStyle }
          className='test--toolbar-url-input'
          autoFocus={ true }
          paddingVertical={ 15 }
          paddingHorizontal={ 15 }
          onFocus={ onFocus }
          onBlur={ onBlur }
          value={ value }
          width={ 300 }
          height={ 50 }
          placeholder='Type or paste a link'
          type='text'
          onChange={ this.handleChange }/>
      </Bubble>
    );
  }
}

UrlInput.propTypes = {
  style: PropTypes.object,
  value: PropTypes.string,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};
