import { each } from 'lodash';

import Page from './page';
import Section from './sections/section';


class CoaccusedList extends Section {
  constructor() {
    super();

    const itemOrders = ['first', 'second'];
    const itemGetters = {};
    each(itemOrders, (field, index) => {
      itemGetters[`${field}FullName`] = `(//span[@class="test--coaccused-fullname"])[${index + 1}]`;
      itemGetters[`${field}ExtraInfo`] = `(//span[@class="test--coaccused-extra-info"])[${index + 1}]`;
      itemGetters[`${field}Category`] = `(//span[@class="test--coaccused-category"])[${index + 1}]`;
    });

    this.prepareElementGetters({
      coaccusedText: '.test--coaccused-text',
      coaccusedItem: '.test--coaccused-list-item',
      ...itemGetters
    });
  }
}

class Header extends Section {
  coaccusedList = new CoaccusedList();

  constructor() {
    super();
    this.prepareElementGetters({
      title: '.test--header-title',
      coaccusedDropdownButton: '.test--coaccused-dropdown-button',
      overlay: '.test--cr-overlay'
    });
  }
}

class InfoSection extends Section {
  constructor() {
    super();

    const infoFields = ['officer', 'complainant', 'finalFinding', 'reccOutcome', 'finalOutcome'];
    const infoGetters = {};
    each(infoFields, (field, index) => {
      infoGetters[`${field}Label`] = `(//*[@class="test--row-label"])[${index + 1}]`;
      infoGetters[`${field}Content`] = `(//*[@class="test--row-content"])[${index + 1}]`;
      infoGetters[`${field}ExtraInfo`] = `(//span[@class="test--row-extra-info"])[${index + 1}]`;
    });

    this.prepareElementGetters({
      category: '.test--cr-category',
      subcategory: '.test--cr-subcategory',
      complainantContentItem: '.test--row-content-item',
      viewOfficerProfileButton: '.test--view-profile-button',
      ...infoGetters
    });
  }
}

class InvolvementSection extends Section {
  constructor() {
    super();

    this.prepareElementGetters({
      firstInvolvementType: '(//*[@class="test--involvement-type"])[1]',
      firstOfficer: '(//*[@class="test--officer-row"])[1]',
      secondInvolvementType: '(//*[@class="test--involvement-type"])[2]',
      secondOfficer: '(//*[@class="test--officer-row"])[2]'
    });
  }
}

class CRPage extends Page {
  header = new Header()
  infoSection = new InfoSection();
  involvementSection = new InvolvementSection();

  constructor() {
    super();

    this.prepareElementGetters({
      element: '.test--bottom-sheet-wrapper',
      overlay: '.test--close-bottom-sheet'
    });
  }

  open() {
    super.open('/complaint/1/1/');
    browser.element('body').waitForVisible();
  }
}

module.exports = new CRPage();