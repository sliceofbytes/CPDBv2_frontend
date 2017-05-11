import React from 'react';
import { renderIntoDocument, scryRenderedComponentsWithType } from 'react-addons-test-utils';
import { spy } from 'sinon';

import { Provider } from 'react-redux';
import { unmountComponentSuppressError, reRender } from 'utils/test';
import OfficerPage from 'components/officer-page';
import Header from 'components/officer-page/header';
import TimelinePage from 'components/officer-page/timeline-page';
import SummaryPage from 'components/officer-page/summary-page';
import MockStore from 'redux-mock-store';


describe('OfficerPage component', function () {
  const mockStore = MockStore();
  const store = mockStore({
    officerPage: {
      summary: {},
      timeline: {
        sortDescending: true,
        minimap: {
          pagination: {
            next: null,
            previous: null
          }
        },
        pagination: {
          next: null,
          previous: null
        }
      }
    }
  });
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should call fetchOfficerSummary on initialization', function () {
    const fetchOfficerSummary = spy();
    const officerId = 1;
    instance = renderIntoDocument(
      <Provider store={ store }>
        <OfficerPage fetchOfficerSummary={ fetchOfficerSummary } officerId={ officerId }/>
      </Provider>
    );

    fetchOfficerSummary.calledWith(officerId).should.be.true();
  });

  it('should render header and summary page', function () {
    const location = { pathname: '' };
    instance = renderIntoDocument(
      <Provider store={ store }>
        <OfficerPage location={ location }/>
      </Provider>
    );

    scryRenderedComponentsWithType(instance, Header).should.have.length(1);
    scryRenderedComponentsWithType(instance, SummaryPage).should.have.length(1);
  });

  it('should render Timeline when path is timeline', function () {
    const location = { pathname: '/officer/123/timeline/' };
    instance = renderIntoDocument(
      <Provider store={ store }>
        <OfficerPage location={ location }/>
      </Provider>
    );

    scryRenderedComponentsWithType(instance, Header).should.have.length(1);
    scryRenderedComponentsWithType(instance, TimelinePage).should.have.length(1);
  });

  it('should re-fetch officer summary when receive a new officerId', function () {
    const fetchOfficerSummary = spy();
    instance = renderIntoDocument(
      <Provider store={ store }>
        <OfficerPage/>
      </Provider>
    );
    instance = reRender(
      <Provider store={ store }>
        <OfficerPage fetchOfficerSummary={ fetchOfficerSummary } officerId={ 3 }/>
      </Provider>,
      instance
    );

    fetchOfficerSummary.calledWith(3).should.be.true();
  });
});