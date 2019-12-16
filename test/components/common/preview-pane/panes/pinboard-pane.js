import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
} from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import MockStore from 'redux-mock-store';
import { stub, spy } from 'sinon';

import { reRender, unmountComponentSuppressError } from 'utils/test';
import { PinboardPane } from 'components/common/preview-pane/panes';
import StaticSocialGraphContainer from 'containers/pinboard-admin-page/static-social-graph-container';
import {
  ListWidget,
  OneLineListWidget,
  TitleWidget,
  NewWidgetWrapper,
} from 'components/common/preview-pane/widgets';
import styles from 'components/common/preview-pane/panes/pinboard-pane.sass';


describe('PinboardPane component', function () {
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should render correctly', function () {
    const store = MockStore()({
      pinboardAdminPage: {
        graphData: {
          data: {},
          requesting: false,
        },
      },
    });

    const recentOfficers = [
      {
        count: 2,
        id: 5200,
        name: 'Thomas Connor',
        radarAxes: [
          {
            axis: 'Use of Force Reports',
            value: 64.3694,
          },
          {
            axis: 'Officer Allegations',
            value: 99.8056,
          },
          {
            axis: 'Civilian Allegations',
            value: 99.9778,
          },

        ],
        radarColor: '#f0201e',
        url: '/officer/5200/thomas-connor/',
      },
    ];
    const recentAllegations = [
      {
        id: 'C201453',
        name: 'Use Of Force',
        subText: 'May 19, 1993',
        url: '/complaint/C201453/',
      },
      {
        id: '1016583',
        name: 'Illegal Search',
        subText: 'May 14, 2008',
        url: '/complaint/1016583/',
      },
    ];
    const recentTrrs = [
      {
        id: 121,
        name: 'Other Force',
        subText: 'Feb 23, 2004',
        url: '/trr/121/',
      },
      {
        id: 122,
        name: 'Physical Force - Holding',
        subText: 'Feb 24, 2004',
        url: '/trr/122/',
      },
      {
        id: 123,
        name: 'Physical Force - Holding',
        subText: 'Feb 24, 2004',
        url: '/trr/123/',
      },
    ];

    instance = renderIntoDocument(
      <Provider store={ store }>
        <PinboardPane
          id='18a5b091'
          title='My Pinboard'
          fullCreatedAt='Nov 4, 2019 4:12 PM'
          description='Some description'
          officersCount={ 1 }
          allegationsCount={ 2 }
          trrsCount={ 3 }
          childCount={ 5 }
          recentOfficers={ recentOfficers }
          recentAllegations={ recentAllegations }
          recentTrrs={ recentTrrs }
        />
      </Provider>
    );

    const widgetWrapper = findRenderedComponentWithType(instance, NewWidgetWrapper);
    widgetWrapper.props.className.should.equal(styles.pinboardPane);
    widgetWrapper.props.callToAction.should.eql({ to: '/pinboard/18a5b091/my-pinboard/', text: 'View Pinboard' });
    widgetWrapper.props.yScrollable.should.be.true();
    widgetWrapper.props.isClickable.should.be.false();

    const titleWidget = findRenderedComponentWithType(widgetWrapper, TitleWidget);
    titleWidget.props.title.should.equal('My Pinboard');
    titleWidget.props.subtitle.should.equal('Some description');

    const oneLineListWidget = findRenderedComponentWithType(widgetWrapper, OneLineListWidget);
    oneLineListWidget.props.items.should.eql([
      { title: 'Created at', text: 'Nov 4, 2019 4:12 PM' },
      { title: 'Children', text: 5 },
    ]);

    const staticSocialGraph = findRenderedComponentWithType(widgetWrapper, StaticSocialGraphContainer);
    staticSocialGraph.props.pinboardId.should.equal('18a5b091');
    staticSocialGraph.props.className.should.equal('social-graph');

    const listWidgets = scryRenderedComponentsWithType(widgetWrapper, ListWidget);
    listWidgets.should.have.length(3);

    listWidgets[0].props.title.should.equal('1 Pinned officer');
    listWidgets[0].props.items.should.eql(recentOfficers);
    listWidgets[0].props.collapsable.should.be.true();

    listWidgets[1].props.title.should.equal('2 Pinned allegations');
    listWidgets[1].props.items.should.eql(recentAllegations);
    listWidgets[1].props.collapsable.should.be.true();

    listWidgets[2].props.title.should.equal('3 Pinned TRRS');
    listWidgets[2].props.items.should.eql(recentTrrs);
    listWidgets[2].props.collapsable.should.be.true();
  });

  it('should fetchPinboardStaticSocialGraph when mounted', function () {
    const store = MockStore()({
      pinboardAdminPage: {
        graphData: {
          cachedData: {},
          requesting: false,
        },
      },
    });
    const stubFetchPinboardStaticSocialGraph = stub();

    instance = renderIntoDocument(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id='dbca4321'
          fetchPinboardStaticSocialGraph={ stubFetchPinboardStaticSocialGraph }
        />
      </Provider>
    );

    stubFetchPinboardStaticSocialGraph.should.be.calledOnce();
    stubFetchPinboardStaticSocialGraph.should.be.calledWith('dbca4321');
  });

  it('should not fetchPinboardStaticSocialGraph if no pinboard id', function () {
    const store = MockStore()({
      pinboardAdminPage: {
        graphData: {
          cachedData: {},
          requesting: false,
        },
      },
    });
    const stubFetchPinboardStaticSocialGraph = stub();

    instance = renderIntoDocument(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id={ undefined }
          fetchPinboardStaticSocialGraph={ stubFetchPinboardStaticSocialGraph }
        />
      </Provider>
    );

    stubFetchPinboardStaticSocialGraph.should.not.be.called();
  });

  it('should not fetchPinboardStaticSocialGraph when changing to no pinboard id', function () {
    const store = MockStore()({
      pinboardAdminPage: {
        graphData: {
          cachedData: {},
          requesting: false,
        },
      },
    });
    const stubFetchPinboardStaticSocialGraph = stub();

    instance = renderIntoDocument(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id='dbca4321'
          fetchPinboardStaticSocialGraph={ stubFetchPinboardStaticSocialGraph }
        />
      </Provider>
    );

    stubFetchPinboardStaticSocialGraph.should.be.calledOnce();
    stubFetchPinboardStaticSocialGraph.should.be.calledWith('dbca4321');
    stubFetchPinboardStaticSocialGraph.resetHistory();

    instance = reRender(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id={ undefined }
          fetchPinboardStaticSocialGraph={ stubFetchPinboardStaticSocialGraph }
        />
      </Provider>,
      instance
    );

    stubFetchPinboardStaticSocialGraph.should.not.be.called();
  });

  it('should fetchPinboardStaticSocialGraph when receiving props', function () {
    const store = MockStore()({
      pinboardAdminPage: {
        graphData: {
          cachedData: {},
          requesting: false,
        },
      },
    });
    const stubFetchPinboardStaticSocialGraph = stub();

    instance = renderIntoDocument(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id='abcd1234'
          fetchPinboardStaticSocialGraph={ stubFetchPinboardStaticSocialGraph }
        />
      </Provider>
    );

    stubFetchPinboardStaticSocialGraph.should.not.be.called();

    reRender(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id='dbca4321'
          fetchPinboardStaticSocialGraph={ stubFetchPinboardStaticSocialGraph }
        />
      </Provider>,
      instance
    );

    stubFetchPinboardStaticSocialGraph.should.be.calledOnce();
    stubFetchPinboardStaticSocialGraph.should.be.calledWith('dbca4321');
  });

  it('should mount a new StaticSocialGraphContainer when change pinboard id', function () {
    const store = MockStore()({
      pinboardAdminPage: {
        graphData: {
          cachedData: {},
          requesting: false,
        },
      },
    });
    const componentWillUnmountSpy = spy(StaticSocialGraphContainer.prototype, 'componentWillUnmount');

    instance = renderIntoDocument(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id='abcd1234'
        />
      </Provider>
    );

    reRender(
      <Provider store={ store }>
        <PinboardPane
          cachedDataIDs={ ['abcd1234'] }
          id='dbca4321'
        />
      </Provider>,
      instance
    );

    componentWillUnmountSpy.should.be.calledOnce();
  });
});