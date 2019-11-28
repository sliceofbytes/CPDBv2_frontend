import React from 'react';
import { shallow } from 'enzyme';
import { stub } from 'sinon';
import ClipboardButton from 'react-clipboard.js';
import config from 'config';

import ShareMenu from 'components/headers/shareable-header/share-menu';


describe('ShareMenu component', function () {
  let wrapper;
  beforeEach(function () {
    this.stubCloseShareMenu = stub();
    wrapper = shallow(<ShareMenu closeShareMenu={ this.stubCloseShareMenu }/>);
    this.encodedLink = encodeURIComponent(window.location.href);
  });

  it('should be renderable', function () {
    ShareMenu.should.be.renderable();
  });

  it('should render copy link', function () {
    const copyLink = wrapper.find(ClipboardButton);
    copyLink.prop('children').should.equal('Copy Link');
    copyLink.prop('onClick').should.equal(this.stubCloseShareMenu);
    copyLink.prop('data-clipboard-text').should.equal(window.location.href);
  });

  it('should render tweet link', function () {
    const link = wrapper.find('.share-button-link-item').at(0);
    link.text().should.equal('Twitter');
    const href = `https://twitter.com/intent/tweet?url=${this.encodedLink}&via=${config.twitterBotName}`;
    link.prop('href').should.eql(href);

    // should close menu on click
    link.simulate('click');
    wrapper.find('share-button-item').should.have.length(0);
  });

  it('should render facebook share link', function () {
    const link = wrapper.find('.share-button-link-item').at(1);
    link.text().should.equal('Facebook');
    link.prop('href').should.equal('https://www.facebook.com/sharer/sharer.php?u=' + this.encodedLink);

    // should close menu on click
    link.simulate('click');
    wrapper.find('share-button-item').should.have.length(0);
  });
});
