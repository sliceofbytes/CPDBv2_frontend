import React from 'react';
import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';

import { unmountComponentSuppressError } from 'utils/test';
import RichTextEditable from 'components/inline-editable/editable-section/rich-text-editable';
import Editable from 'components/inline-editable/editable';
import { RawContentStateFactory } from 'utils/test/factories/draft';
import { convertContentStateToEditorState } from 'utils/draft';

describe('RichTextEditable component', function () {
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should render with given props', function () {
    const style = {};
    const onChange = () => {};
    const editorState = convertContentStateToEditorState(
      RawContentStateFactory.build({}, { blockTexts: ['abc'] })
    );
    instance = renderIntoDocument(
      <RichTextEditable
        editModeOn={ true }
        style={ style }
        onChange={ onChange }
        value={ editorState }
        placeholder='123'/>
    );
    const editable = findRenderedComponentWithType(instance, Editable);
    editable.props.editModeOn.should.be.true();
    const paragraph = editable.props.presenterElement;
    paragraph.props.style.should.eql(style);
    paragraph.props.editorState.should.eql(editorState);
    paragraph.props.readOnly.should.be.true();
    const editor = editable.props.editorElement;
    editor.props.style.should.eql(style);
    editor.props.onChange.should.eql(onChange);
    editor.props.editorState.should.eql(editorState);
    editor.props.placeholder.should.eql('123');
  });
});