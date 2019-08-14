'use strict';

var should = require('should');

import landingPage from './page-objects/landing-page';
import { selectText } from './utils';


describe('Header', function () {

  beforeEach(function () {
    landingPage.open();
  });

  context('edit mode off', function () {
    it('should not display log out button', function () {
      landingPage.topHeader.navBar.logOutButton.waitForVisible(2000, true);
    });
  });

  context('edit mode on', function () {
    beforeEach(function () {
      landingPage.openEditMode();
    });

    it('should display log out button and log out when we click on', function () {
      landingPage.topHeader.navBar.logOutButton.waitForVisible();
      landingPage.topHeader.navBar.logOutButton.click();
      landingPage.loginScreen.loginModal.waitForVisible();
      should(browser.getCookie('apiAccessToken')).be.null();
    });

    describe('logo section', function () {
      beforeEach(function () {
        browser.moveToObject(landingPage.topHeader.topBar.logo.title.selector);
      });

      it('should display edit button when hover on logo section', function () {
        landingPage.topHeader.topBar.logo.editButton.waitForVisible();
      });

      context('section edit mode on', function () {
        beforeEach(function () {
          landingPage.topHeader.topBar.logo.editButton.click();
        });

        it('should allow editing title', function () {
          selectText(landingPage.topHeader.topBar.logo.title.selector);
          browser.keys('abcdef');
          landingPage.topHeader.topBar.logo.title.getText().should.containEql('abcdef');
        });

        it('should allow editing subtitle with rich text capabilities', function () {
          selectText(landingPage.topHeader.topBar.logo.subtitle.selector);
          landingPage.richTextToolbar.element.waitForVisible();
        });

        it('should display save and cancel button', function () {
          landingPage.topHeader.topBar.logo.saveButton.waitForVisible();
          landingPage.topHeader.topBar.logo.cancelButton.waitForVisible();
        });

        it('should turn off section edit mode when click on cancel button', function () {
          landingPage.topHeader.topBar.logo.cancelButton.click();
          browser.moveToObject(landingPage.topHeader.topBar.logo.title.selector);
          landingPage.topHeader.topBar.logo.editButton.waitForVisible();
          landingPage.topHeader.topBar.logo.saveButton.waitForVisible(2000, true);
          landingPage.topHeader.topBar.logo.cancelButton.waitForVisible(2000, true);
        });
      });
    });
  });
});
