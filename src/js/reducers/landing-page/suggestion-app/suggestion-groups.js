import { handleActions } from 'redux-actions';
import { map, reduce } from 'lodash';

import {
  SUGGESTION_REQUEST_START, SUGGESTION_REQUEST_SUCCESS, SUGGESTION_REQUEST_FAILURE
} from 'actions/landing-page/suggestion';


export default handleActions({
  [SUGGESTION_REQUEST_START]: (state, action) => ({}),
  [SUGGESTION_REQUEST_SUCCESS]: (state, action) => action.payload,
  [SUGGESTION_REQUEST_FAILURE]: (state, action) => ({})
}, {});
