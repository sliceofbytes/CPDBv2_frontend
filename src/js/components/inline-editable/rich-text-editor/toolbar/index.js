import React, { Component, PropTypes } from 'react';
import { RichUtils } from 'draft-js';

import { linkEntitySelected, getSelectionStartBlockKey, inlineStyleSelected } from 'utils/draft';
import { getOffsetKey } from 'utils/rich-text';
import ToolbarButton from './toolbar-button';
import UrlInput from './url-input';
import Bubble from './bubble';
import { createLinkEntity, removeLinkEntity } from 'utils/draft';
import { wrapperStyle, urlInputStyle } from './toolbar.style';

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUrlInput: false,
      linkActive: false
    };
    this.position = {};
    this.handleLinkButtonClick = this.handleLinkButtonClick.bind(this);
    this.handleBoldButtonClick = this.handleBoldButtonClick.bind(this);
    this.handleItalicButtonClick = this.handleItalicButtonClick.bind(this);
    this.handleUrlInputEntryFinished = this.handleUrlInputEntryFinished.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editorState !== this.props.editorState) {
      this.setState({
        linkActive: false,
        showUrlInput: false
      });
    }
  }

  handleLinkButtonClick() {
    const { editorState, onChange } = this.props;
    const { showUrlInput } = this.state;
    if (linkEntitySelected(editorState)) {
      onChange(removeLinkEntity(editorState));
      this.setState({ showUrlInput: false, linkActive: false });
    } else {
      this.setState({ showUrlInput: !showUrlInput, linkActive: !showUrlInput });
    }
  }

  handleBoldButtonClick() {
    const { editorState, onChange } = this.props;
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  handleItalicButtonClick() {
    const { editorState, onChange } = this.props;
    onChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  }

  handleUrlInputEntryFinished(url) {
    const { editorState, onChange } = this.props;
    let linkActive = false;
    if (url) {
      onChange(createLinkEntity(editorState, { url }));
      linkActive = true;
    }
    this.setState({ showUrlInput: false, linkActive });
  }

  currentSelectionRect() {
    const { editorState } = this.props;
    const blockKey = getSelectionStartBlockKey(editorState);
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      return null;
    }
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const offsetKey = getOffsetKey(node);
    if (offsetKey && offsetKey.split('-')[0] === blockKey) {
      return range.getBoundingClientRect();
    }
    return null;
  }

  toolbarPosition() {
    const { parentLeft, parentTop } = this.props;
    const rect = this.currentSelectionRect();
    if (rect !== null) {
      this.position = {
        top: `${rect.top - 60 - parentTop}px`,
        left: `${rect.left - parentLeft + (rect.width - 150) / 2}px`
      };
    }
    return this.position;
  }

  render() {
    const { editorState, show, onMouseOver, onMouseOut } = this.props;
    const { showUrlInput, linkActive } = this.state;
    let _linkActive = linkActive || (editorState && linkEntitySelected(editorState));
    let boldActive = editorState && inlineStyleSelected(editorState, 'BOLD');
    let italicActive = editorState && inlineStyleSelected(editorState, 'ITALIC');

    if (!show) {
      return null;
    }

    return (
      <Bubble style={ this.toolbarPosition() }>
        <div style={ { ...wrapperStyle } }>
          <ToolbarButton
            onMouseOver={ onMouseOver }
            onMouseOut={ onMouseOut }
            icon='bold-blue.svg'
            activeIcon='bold-white.svg'
            onClick={ this.handleBoldButtonClick }
            active={ boldActive }/>
          <ToolbarButton
            onMouseOver={ onMouseOver }
            onMouseOut={ onMouseOut }
            icon='italic-blue.svg'
            activeIcon='italic-white.svg'
            onClick={ this.handleItalicButtonClick }
            active={ italicActive }/>
          <ToolbarButton
            onMouseOver={ onMouseOver }
            onMouseOut={ onMouseOut }
            icon='link-blue.svg'
            activeIcon='link-white.svg'
            onClick={ this.handleLinkButtonClick }
            active={ _linkActive }/>
          { showUrlInput ?
            <UrlInput
              style={ urlInputStyle }
              onEntryFinished={ this.handleUrlInputEntryFinished }/> :
            null
          }
        </div>
      </Bubble>
    );
  }
}

Toolbar.propTypes = {
  editorState: PropTypes.object,
  show: PropTypes.bool,
  onChange: PropTypes.func,
  parentLeft: PropTypes.number,
  parentTop: PropTypes.number,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func
};

export default Toolbar;