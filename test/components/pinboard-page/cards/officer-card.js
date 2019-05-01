import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithClass,
  Simulate,
} from 'react-addons-test-utils';
import { spy, useFakeTimers } from 'sinon';

import { unmountComponentSuppressError } from 'utils/test';
import OfficerCard from 'components/pinboard-page/cards/officer-card';
import ItemUnpinButton from 'components/pinboard-page/cards/item-unpin-button';
import StaticRadarChart from 'components/common/radar-chart';
import { findDOMNode } from 'react-dom';


describe('OfficerCard component', function () {
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should render correctly', function () {
    const item = {
      rank: 'Officer as Detective',
      fullName: 'James David',
      complaintCount: '10',
    };
    instance = renderIntoDocument(<OfficerCard item={ item } />);

    findRenderedComponentWithType(instance, ItemUnpinButton).should.be.ok();
    findRenderedComponentWithType(instance, StaticRadarChart).should.be.ok();

    findRenderedDOMComponentWithClass(instance, 'officer-rank').textContent.should.eql('Officer as Detective');
    findRenderedDOMComponentWithClass(instance, 'officer-name').textContent.should.eql('James David');
    findRenderedDOMComponentWithClass(instance, 'officer-complaints-count').textContent.should.eql('10 complaints');
  });

  it('should fade in when added', function () {
    const item = {
      rank: 'Officer as Detective',
      fullName: 'James David',
      complaintCount: '10',
    };
    instance = renderIntoDocument(<OfficerCard item={ item } isAdded={ true }/>);

    const instanceDom = findDOMNode(instance);
    instanceDom.className.should.containEql('hide');
    instanceDom.className.should.containEql('fade-in');
  });

  it('should fade out when removed and invoke removeItemInPinboardPage after 1s', function () {
    const clock = useFakeTimers();
    const removeItemInPinboardPage = spy();

    const item = {
      type: 'OFFICER',
      isPinned: false,
      id: 123,
      rank: 'Officer as Detective',
      fullName: 'James David',
      complaintCount: '10',
    };
    instance = renderIntoDocument(
      <OfficerCard
        item={ item }
        removeItemInPinboardPage={ removeItemInPinboardPage }
      />
    );
    const unpinButton = findRenderedComponentWithType(instance, ItemUnpinButton);

    Simulate.click(findDOMNode(unpinButton));

    const instanceDom = findDOMNode(instance);
    instanceDom.className.should.containEql('fade-out');
    removeItemInPinboardPage.should.not.be.called();

    clock.tick(1050);

    removeItemInPinboardPage.should.be.calledOnce();
    removeItemInPinboardPage.should.be.calledWith({
      type: 'OFFICER',
      isPinned: false,
      id: 123
    });

    clock.restore();
  });
});
