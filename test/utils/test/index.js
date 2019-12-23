import React, { PropTypes } from 'react';
import { spy } from 'sinon';

import { withStoreContext } from 'utils/test';

describe('test utils', function () {
  describe('withStoreContext', function () {
    it('should return a new component which provide store context to its children', function () {
      function TestComponent(props) {}
      const store = spy();
      const TestComponentWithStore = withStoreContext(TestComponent, store);

      TestComponentWithStore.prototype.getChildContext().should.eql({ store });
      TestComponentWithStore.childContextTypes.should.eql({ store: PropTypes.object });
    });
  });
});
