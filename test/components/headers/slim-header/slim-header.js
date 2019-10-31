import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  findRenderedComponentWithType,
  scryRenderedDOMComponentsWithClass,
  scryRenderedComponentsWithType,
  Simulate,
} from 'react-addons-test-utils';
import MockStore from 'redux-mock-store';
import { stub, spy } from 'sinon';
import { Link } from 'react-router';

import { SlimHeader } from 'components/headers/slim-header';
import { unmountComponentSuppressError } from 'utils/test';
import ContextWrapper from 'utils/test/components/context-wrapper';
import * as domUtils from 'utils/dom';
import SlimHeaderContent from 'components/headers/slim-header/slim-header-content';
import { RichTextFieldFactory } from 'utils/test/factories/field';


class SlimHeaderContextWrapper extends ContextWrapper {
}

SlimHeaderContextWrapper.childContextTypes = {
  editModeOn: PropTypes.bool,
};

describe('SlimHeader component', function () {
  let element;
  const mockStore = MockStore();
  const store = mockStore({
    authentication: {},
    cms: {
      pages: {
        'landing-page': {
          fields: {
            'navbar_title': RichTextFieldFactory.build({ name: 'navbar_title' }),
          },
        },
      },
    },
    headers: {
      slimHeader: {
        logoSectionEditModeOn: false,
        demoVideoSectionEditModeOn: false,
        videoInfo: [{
          'thumbnail_small': 'https://i.vimeocdn.com/video/797111186_100x75.webp',
        }],
      },
    },
  });

  beforeEach(function () {
    window.scrollTo(0, 0);
    stub(window, 'addEventListener');
    stub(window, 'removeEventListener');
  });

  afterEach(function () {
    window.addEventListener.restore();
    window.removeEventListener.restore();
    unmountComponentSuppressError(element);
  });

  it('should render nothing if "show" prop is false', function () {
    element = renderIntoDocument(
      <Provider store={ store }>
        <SlimHeaderContextWrapper context={ { editModeOn: false } }>
          <SlimHeader show={ false } />
        </SlimHeaderContextWrapper>
      </Provider>
    );
    scryRenderedDOMComponentsWithClass(element, 'test--slim-header').length.should.eql(0);
  });

  it('should render Q&A link', function () {
    const openRequestDocumentModal = spy();
    element = renderIntoDocument(
      <Provider store={ store }>
        <SlimHeaderContextWrapper context={ { editModeOn: false } }>
          <SlimHeader show={ true } openLegalDisclaimerModal={ openRequestDocumentModal } pathname='/' />
        </SlimHeaderContextWrapper>
      </Provider>
    );

    const links = scryRenderedDOMComponentsWithTag(element, 'a');
    const link = links.filter(link => link.textContent === 'Q&A')[0];
    link.getAttribute('href').should.eql('http://how.cpdp.works/');
  });

  it('should render Data link', function () {
    const openRequestDocumentModal = spy();
    element = renderIntoDocument(
      <Provider store={ store }>
        <SlimHeaderContextWrapper context={ { editModeOn: false } }>
          <SlimHeader show={ true } openLegalDisclaimerModal={ openRequestDocumentModal } pathname='/' />
        </SlimHeaderContextWrapper>
      </Provider>
    );

    const links = scryRenderedDOMComponentsWithTag(element, 'a');
    const link = links.filter(link => link.textContent === 'Data')[0];
    link.getAttribute('href').should.eql('http://cpdb.lvh.me');
  });

  it('should render Documents link', function () {
    const openRequestDocumentModal = spy();
    element = renderIntoDocument(
      <Provider store={ store }>
        <SlimHeaderContextWrapper context={ { editModeOn: false } }>
          <SlimHeader show={ true } openLegalDisclaimerModal={ openRequestDocumentModal } pathname='/' />
        </SlimHeaderContextWrapper>
      </Provider>
    );

    const links = scryRenderedComponentsWithType(element, Link);
    const link = links.filter(link => link.props.children === 'Documents')[0];
    link.props.to.should.eql('/documents/');
  });

  describe('External links', function () {
    it('should stopPropagation when being clicked', function () {
      element = renderIntoDocument(
        <Provider store={ store }>
          <SlimHeaderContextWrapper context={ { editModeOn: false } }>
            <SlimHeader show={ true } pathname='/' />
          </SlimHeaderContextWrapper>
        </Provider>
      );
      let externalLinks = scryRenderedDOMComponentsWithClass(element, 'right-link');
      const dummyEvent = {
        stopPropagation: spy(),
      };
      Simulate.click(externalLinks[0], dummyEvent);
      dummyEvent.stopPropagation.called.should.be.true();
    });
  });

  describe('recalculatePosition', function () {
    beforeEach(function () {
      stub(domUtils, 'calculateSlimHeaderPosition');
      element = renderIntoDocument(
        <Provider store={ store }>
          <SlimHeaderContextWrapper context={ { editModeOn: false } }>
            <SlimHeader show={ true } pathname='/' />
          </SlimHeaderContextWrapper>
        </Provider>
      );

      this.slimHeader = findRenderedComponentWithType(element, SlimHeader);
    });

    afterEach(function () {
      domUtils.calculateSlimHeaderPosition.restore();
    });

    it('should remain in top position', function () {
      domUtils.calculateSlimHeaderPosition.returns('top');
      this.slimHeader.recalculatePosition();
      this.slimHeader.state.position.should.eql('top');
    });

    it('should transition to middle position', function () {
      domUtils.calculateSlimHeaderPosition.returns('middle');
      this.slimHeader.recalculatePosition();
      this.slimHeader.state.position.should.eql('middle');
    });

    it('should transition to bottom position', function () {
      domUtils.calculateSlimHeaderPosition.returns('bottom');
      this.slimHeader.recalculatePosition();
      this.slimHeader.state.position.should.eql('bottom');
    });
  });

  describe('SlimHeaderContent', function () {
    it('should be rendered with correct props and style on the top of the page', function () {
      element = renderIntoDocument(
        <Provider store={ store }>
          <SlimHeaderContextWrapper context={ { editModeOn: false } }>
            <SlimHeader
              show={ true }
              pathname='/'
            />
          </SlimHeaderContextWrapper>
        </Provider>
      );

      const slimHeader = findRenderedComponentWithType(element, SlimHeader);
      slimHeader.setState({ position: 'top' });

      const slimHeaderContent = findRenderedComponentWithType(element, SlimHeaderContent);
      slimHeaderContent.props.position.should.eql('top');
      slimHeaderContent.props.pathname.should.eql('/');
      slimHeaderContent.props.editModeOn.should.eql(false);
    });

    it('should be rendered with correct props and style in the middle of the page', function () {
      element = renderIntoDocument(
        <Provider store={ store }>
          <SlimHeaderContextWrapper context={ { editModeOn: false } }>
            <SlimHeader
              show={ true }
              pathname='/'
            />
          </SlimHeaderContextWrapper>
        </Provider>
      );

      const slimHeader = findRenderedComponentWithType(element, SlimHeader);
      slimHeader.setState({ position: 'middle' });

      const slimHeaderContent = findRenderedComponentWithType(element, SlimHeaderContent);

      slimHeaderContent.props.position.should.eql('middle');
      slimHeaderContent.props.pathname.should.eql('/');
      slimHeaderContent.props.editModeOn.should.eql(false);
    });

    it('should be rendered with correct props and style in the bottom of the page', function (done) {
      element = renderIntoDocument(
        <Provider store={ store }>
          <SlimHeaderContextWrapper context={ { editModeOn: false } }>
            <SlimHeader
              show={ true }
              pathname='/'
            />
          </SlimHeaderContextWrapper>
        </Provider>
      );

      const slimHeader = findRenderedComponentWithType(element, SlimHeader);
      slimHeader.setState({ position: 'bottom' });
      setTimeout(function () {
        const slimHeaderContent = findRenderedComponentWithType(element, SlimHeaderContent);
        slimHeaderContent.props.position.should.eql('bottom');
        slimHeaderContent.props.pathname.should.eql('/');
        slimHeaderContent.props.editModeOn.should.eql(false);
        done();
      }, 500);
    });
  });
});
