import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'lodash';

import styles from './relevant-document-card.sass';
import BaseComplaintCard from 'components/pinboard-page/relevant/common/base-complaint-card';
import withUndoCard from 'components/pinboard-page/cards/with-undo-card';
import { UNDO_CARD_THEMES } from 'utils/constants';


export default function RelevantDocumentCard(props) {
  const {
    allegation,
    url,
    previewImageUrl,
    addItemInPinboardPage,
    pinned,
    focusItem,
  } = props;

  const leftChild = (
    <a
      className={ styles.documentCardThumbnail }
      href={ url }
      target='_blank'
    >
      <img className='document-card-thumbnail-img' src={ previewImageUrl }/>
    </a>
  );

  return (
    <BaseComplaintCard
      { ...allegation }
      leftChild={ leftChild }
      addItemInPinboardPage={ pinned ? null : addItemInPinboardPage }
      pinned={ pinned }
      focusItem={ focusItem }
      leftHaftClick={ false }
    />
  );
}

RelevantDocumentCard.propTypes = {
  url: PropTypes.string,
  focusItem: PropTypes.func,
  previewImageUrl: PropTypes.string,
  allegation: PropTypes.object,
  addItemInPinboardPage: PropTypes.func,
  pinned: PropTypes.bool,
};

RelevantDocumentCard.defaultProps = {
  focusItem: noop,
};

export const RelevantDocumentCardWithUndo = withUndoCard(
  RelevantDocumentCard,
  () => 'Document added.',
  'addItemInPinboardPage',
  {
    theme: UNDO_CARD_THEMES.DARK,
    keepVisible: true,
    hasWrapper: true,
  },
);
