import { connect } from 'react-redux';

import SearchTerms from 'components/search-page/search-terms';
import { move, resetNavigation } from 'actions/search-page/search-terms';
import {
  focusedSearchTermItemSelector,
  totalItemCountSelector,
  navigationKeySelector,
} from 'selectors/search-page/search-terms/navigation';
import { getCategories } from 'selectors/search-page/search-terms/categories';
import {
  recentSuggestionsSelector,
  recentSuggestionIdsSelector,
  getRecentSuggestionsRequested,
} from 'selectors/search-page/search-results/recent-suggestions';
import { addOrRemoveItemInPinboard } from 'actions/pinboard';
import { saveToRecent, fetchRecentSearchItems, fetchedEmptyRecentSearchItems } from 'actions/search-page';
import { isEmptyPinboardSelector, pinboardUrlSelector } from 'selectors/pinboard-page/pinboard';
import { visitPinButtonIntroduction } from 'actions/pinboard-introduction';


function mapStateToProps(state, ownProps) {
  return {
    recentSuggestions: recentSuggestionsSelector(state),
    categories: getCategories(state),
    focusedItem: focusedSearchTermItemSelector(state),
    totalItemCount: totalItemCountSelector(state),
    navigationKeys: navigationKeySelector(state),
    recentSuggestionIds: recentSuggestionIdsSelector(state),
    recentSuggestionsRequested: getRecentSuggestionsRequested(state),
    isEmptyPinboard: isEmptyPinboardSelector(state),
    pinboardUrl: pinboardUrlSelector(state),
  };
}

const mapDispatchToProps = {
  move,
  resetNavigation,
  addOrRemoveItemInPinboard,
  saveToRecent,
  fetchRecentSearchItems,
  fetchedEmptyRecentSearchItems,
  visitPinButtonIntroduction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTerms);
