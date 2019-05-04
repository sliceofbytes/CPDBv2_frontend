import { Promise } from 'es6-promise';
import { stub } from 'sinon';
import extractQuery from 'utils/extract-query';

import restoreSessionPinboard from 'middleware/restore-session-pinboard';
import { fetchLatestRetrievedPinboard } from 'actions/pinboard';


const createLocationChangeAction = (pathname) => ({
  type: '@@router/LOCATION_CHANGE',
  payload: {
    pathname: pathname,
    query: extractQuery(pathname)
  }
});


const buildStore = () => ({
  _state: {
    pinboard: {
      id: 'id'
    }
  },
  getState() {
    return this._state;
  },
  dispatch: stub().usingPromise(Promise).resolves('abc')
});

describe('fetchLatestRetrievedPinboard middleware', () => {
  let store;

  beforeEach(() => {
    store = buildStore();
    store.dispatch.resetHistory();
  });

  it('should not dispatch if action is not location change', () => {
    const action = {
      type: 'another action'
    };
    let dispatched;

    restoreSessionPinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.called.should.be.false();
  });

  it('should not dispatch if location change is pinboard detail page', () => {
    const action = createLocationChangeAction('/pinboard/5cd06f2b/');

    let dispatched;
    restoreSessionPinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.called.should.be.false();
  });

  it('should not dispatch if pinboard is restored', () => {
    store.getState().pinboard.isPinboardRestored = true;
    const action = createLocationChangeAction('');

    let dispatched;
    restoreSessionPinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.called.should.be.false();
  });

  it('should dispatch fetchLatestRetrievedPinboard', () => {
    const action = createLocationChangeAction('');

    let dispatched;
    restoreSessionPinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.calledWith(fetchLatestRetrievedPinboard()).should.be.true();
  });
});
