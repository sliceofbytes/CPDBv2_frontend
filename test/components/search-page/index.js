import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  Simulate, renderIntoDocument, findRenderedDOMComponentWithTag, findRenderedDOMComponentWithClass,
  findRenderedComponentWithType
} from 'react-addons-test-utils';
import { stub, spy } from 'sinon';
import { browserHistory } from 'react-router';
import Mousetrap from 'mousetrap';
import lodash from 'lodash';
import MockStore from 'redux-mock-store';

import TextInput from 'components/common/input';
import SearchPage from 'components/search-page';
import { unmountComponentSuppressError } from 'utils/test';
import * as domUtils from 'utils/dom';
import { OfficerSuggestion } from 'utils/test/factories/suggestion';


describe('SearchPage component', function () {
  let instance;
  const store = MockStore()({
    searchPage: {
      tags: [],
      navigation: {},
      searchTerms: {
        categories: []
      },
      pagination: {}
    }
  });

  beforeEach(function () {
    this.locationAssign = stub(window.location, 'assign');
    this.browserHistoryPush = stub(browserHistory, 'push');
    // Stub lodash.debounce() so that it returns the input function as-is
    this.debounceStub = stub(lodash, 'debounce').callsFake(func => func);
  });

  afterEach(function () {
    unmountComponentSuppressError(instance);
    this.locationAssign.restore();
    this.browserHistoryPush.restore();
    this.debounceStub.restore();
  });

  it('should be renderable', function () {
    SearchPage.should.be.renderable();
  });

  it('should call get suggestion api when no contentType selected', function () {
    const getSuggestion = spy();

    instance = renderIntoDocument(
      <SearchPage getSuggestion={ getSuggestion }/>
    );
    const searchInput = findRenderedDOMComponentWithTag(instance, 'input');
    searchInput.value = 'a';
    Simulate.change(searchInput);
    getSuggestion.calledWith('a', {
      contentType: null,
      limit: 9
    }).should.be.true();
  });

  it('should call get suggestion api when contentType is selected', function () {
    const getSuggestionWithContentType = spy();
    const contentType = 'OFFICER';

    instance = renderIntoDocument(
      <SearchPage
        contentType={ contentType }
        getSuggestionWithContentType={ getSuggestionWithContentType }/>
    );
    const searchInput = findRenderedDOMComponentWithTag(instance, 'input');
    searchInput.value = 'a';
    Simulate.change(searchInput);
    getSuggestionWithContentType.calledWith('a', {
      contentType
    }).should.be.true();
  });

  it('should clear all tags when user remove all text', function () {
    const selectTag = spy();
    instance = renderIntoDocument(
      <SearchPage selectTag={ selectTag }/>
    );
    const searchInput = findRenderedDOMComponentWithTag(instance, 'input');
    searchInput.value = '';
    Simulate.change(searchInput);
    selectTag.calledWith(null).should.be.true();
  });

  it('should call browserHistory.push when user click on searchbar__button--back', function () {
    instance = renderIntoDocument(
      <SearchPage />
    );

    const backButton = findRenderedDOMComponentWithClass(instance, 'searchbar__button--back');
    Simulate.click(backButton);
    this.browserHistoryPush.calledWith('/').should.be.true();
  });

  it('should call router.goBack when user hit ESCAPE', function () {
    instance = renderIntoDocument(
      <SearchPage />
    );

    Mousetrap.trigger('esc');
    this.browserHistoryPush.calledWith('/').should.be.true();
  });

  it('should follow the first result url when user hit ENTER', function () {
    const suggestionGroups = [
      {
        header: 'OFFICER',
        items: [
          { url: 'url' }
        ]
      }
    ];

    instance = renderIntoDocument(
      <SearchPage suggestionGroups={ suggestionGroups } />
    );

    const input = findRenderedComponentWithType(instance, TextInput);
    input.mousetrap.trigger('enter');
    this.locationAssign.calledWith('url').should.be.true();
    this.browserHistoryPush.called.should.be.false();
  });

  it('should push first result to when user hit ENTER if to is set', function () {
    const suggestionGroups = [
      {
        header: 'OFFICER',
        items: [
          { url: 'url', to: 'to' }
        ]
      }
    ];

    instance = renderIntoDocument(
      <SearchPage suggestionGroups={ suggestionGroups } />
    );

    const input = findRenderedComponentWithType(instance, TextInput);
    input.mousetrap.trigger('enter');
    this.browserHistoryPush.calledWith('to').should.be.true();
    this.locationAssign.called.should.be.false();
  });

  it('should follow the v1 search url when user hit ENTER but there\'s no results', function () {
    instance = renderIntoDocument(
      <Provider store={ store }>
        <SearchPage query='something'/>
      </Provider>
    );

    const input = findRenderedComponentWithType(instance, TextInput);
    input.mousetrap.trigger('enter');

    this.locationAssign.calledWith('http://cpdb.lvh.me/s/something').should.be.true();
  });

  it('should track recent suggestion when user press ENTER and there are results', function () {
    const trackRecentSuggestion = spy();
    const suggestionGroups = [
      {
        header: 'OFFICER',
        items: [
          { url: 'url', to: 'to', 'text': 'Kevin' }
        ]
      }
    ];

    instance = renderIntoDocument(
      <SearchPage suggestionGroups={ suggestionGroups } trackRecentSuggestion={ trackRecentSuggestion }/>
    );

    const input = findRenderedComponentWithType(instance, TextInput);
    input.mousetrap.trigger('enter');
    trackRecentSuggestion.calledWith('OFFICER', 'Kevin', 'url').should.be.true();
  });

  it('should trigger move when up key pressed', function () {
    const move = spy();
    const totalItemCount = 3;
    const direction = 'up';
    instance = renderIntoDocument(
      <SearchPage move={ move } totalItemCount={ totalItemCount }/>
    );
    Mousetrap.trigger(direction);
    move.calledWith(direction, totalItemCount).should.be.true();
  });

  it('should trigger move when down key pressed', function () {
    const move = spy();
    const totalItemCount = 3;
    const direction = 'down';
    instance = renderIntoDocument(
      <SearchPage move={ move } totalItemCount={ totalItemCount }/>
    );
    Mousetrap.trigger(direction);
    move.calledWith(direction, totalItemCount).should.be.true();
  });

  describe('after keyboard navigation', function () {
    beforeEach(function () {
      this.scrollToElementStub = stub(domUtils, 'scrollToElement');
    });

    afterEach(function () {
      this.scrollToElementStub.restore();
    });

    it ('should scroll to focused item', function () {
      const domNode = document.createElement('div');
      ReactDOM.render(<SearchPage focusedItem={ { uniqueKey: 'OFFICER-1234' } }/>, domNode);
      ReactDOM.render(<SearchPage focusedItem={ { uniqueKey: 'OFFICER-5678' } }/>, domNode);
      this.scrollToElementStub.calledWith('.suggestion-item-OFFICER-5678').should.be.true();
    });
  });

  describe('handleViewItem', function () {
    it('should use browserHistory.push() if visiting focused item with internal link', function () {
      instance = renderIntoDocument(
        <SearchPage focusedItem={ OfficerSuggestion.build({ to: '/dummy/url' }) }/>
      );
      Mousetrap.trigger('enter');
      this.browserHistoryPush.calledWith('/dummy/url').should.be.true();
      this.locationAssign.called.should.be.false();
    });

    it('should use window.location.assign() if visiting focused item with external link', function () {
      instance = renderIntoDocument(
        <SearchPage focusedItem={ OfficerSuggestion.build({ url: 'http://whatever.local' }) }/>
      );
      Mousetrap.trigger('enter');
      this.locationAssign.calledWith('http://whatever.local').should.be.true();
      this.browserHistoryPush.called.should.be.false();
    });
  });

});
