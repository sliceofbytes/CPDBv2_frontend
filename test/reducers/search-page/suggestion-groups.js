import {
  SUGGESTION_REQUEST_START, SUGGESTION_REQUEST_SUCCESS, SUGGESTION_REQUEST_FAILURE
} from 'actions/search-page';
import suggestionGroups from 'reducers/search-page/suggestion-groups';


describe('searchPage.suggestionGroups reducer', function () {
  it('should have initial state', function () {
    suggestionGroups(undefined, {}).should.deepEqual({});
  });

  it('should handle SUGGESTION_REQUEST_START', function () {
    suggestionGroups(undefined, {
      type: SUGGESTION_REQUEST_START
    }).should.deepEqual({});
  });

  it('should handle SUGGESTION_REQUEST_START', function () {
    suggestionGroups(undefined, {
      type: SUGGESTION_REQUEST_FAILURE
    }).should.deepEqual({});
  });

  it('should handle SUGGESTION_REQUEST_SUCCESS', function () {
    suggestionGroups(undefined, {
      type: SUGGESTION_REQUEST_SUCCESS,
      payload: {
        'neighborhoods': [{ a: 1 }],
        'officer_badge_number': [{ b: 2 }],
        'officer_name': [{ c: 3 }]
      }
    }).should.deepEqual({
      'neighborhoods': [{ a: 1 }],
      'officer_badge_number': [{ b: 2 }],
      'officer_name': [{ c: 3 }]
    });
  });
});