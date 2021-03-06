import { connect } from 'react-redux';
import { omit } from 'lodash';

import { examplePinboardsSelector, getPinboardId } from 'selectors/pinboard-page/pinboard';
import EmptyPinboard from 'components/pinboard-page/empty-pinboard';
import {
  turnOffEmptyPinboardDescriptionEditMode,
  turnOffEmptyPinboardTitleEditMode,
  turnOnEmptyPinboardDescriptionEditMode,
  turnOnEmptyPinboardTitleEditMode,
} from 'actions/pinboard-page';
import { updatePinboardFromSource } from 'actions/pinboard';
import { updatePage } from 'actions/cms';
import { getCMSFields } from 'selectors/cms';
import { PINBOARD_EDIT_TYPES, PINBOARD_PAGE_ID } from 'utils/constants';
import getEditModeOn from 'selectors/pinboard-page/edit-mode-on';


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  currentPinboardId: getPinboardId(state),
  examplePinboards: examplePinboardsSelector(state),
  editModeOn: getEditModeOn(state),
  editableFields: getCMSFields(PINBOARD_PAGE_ID)(state),
});

const mapDispatchToProps = {
  updatePinboardFromSource,
  onSaveForm: updatePage(PINBOARD_PAGE_ID),
  turnOnEmptyPinboardTitleEditMode,
  turnOffEmptyPinboardTitleEditMode,
  turnOnEmptyPinboardDescriptionEditMode,
  turnOffEmptyPinboardDescriptionEditMode,
};

const editWrapperStateProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...omit(stateProps, ['editableFields', 'editModeOn']),
    ...omit(dispatchProps, [
      'onSaveForm',
      'turnOnEmptyPinboardTitleEditMode',
      'turnOffEmptyPinboardTitleEditMode',
      'turnOnEmptyPinboardDescriptionEditMode',
      'turnOffEmptyPinboardDescriptionEditMode',
    ]),
    emptyPinboardTitleEditWrapperStateProps: {
      fields: stateProps.editableFields,
      sectionEditModeOn: stateProps.editModeOn[PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE],
      onSaveForm: dispatchProps.onSaveForm,
      turnOnSectionEditMode: dispatchProps.turnOnEmptyPinboardTitleEditMode,
      turnOffSectionEditMode: dispatchProps.turnOffEmptyPinboardTitleEditMode,
    },
    emptyPinboardDescriptionEditWrapperStateProps: {
      fields: stateProps.editableFields,
      sectionEditModeOn: stateProps.editModeOn[PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION],
      onSaveForm: dispatchProps.onSaveForm,
      turnOnSectionEditMode: dispatchProps.turnOnEmptyPinboardDescriptionEditMode,
      turnOffSectionEditMode: dispatchProps.turnOffEmptyPinboardDescriptionEditMode,
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, editWrapperStateProps)(EmptyPinboard);
