import React from 'react';
import isMobile from 'ismobilejs';
import { times, cloneDeep } from 'lodash';
import { stub, spy } from 'sinon';
import { browserHistory } from 'react-router';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
  scryRenderedDOMComponentsWithClass,
} from 'react-addons-test-utils';
import { mapboxgl } from 'utils/vendors';
import ReactDOMServer from 'react-dom/server';
import should from 'should';

import { unmountComponentSuppressError, reRender } from 'utils/test';
import AllegationsMap, { AllegationsMapWithSpinner } from 'components/common/allegations-map';
import Legend from 'components/common/allegations-map/legend';
import mapStyles from 'components/common/allegations-map/allegations-map.sass';
import legendStyles from 'components/common/allegations-map/legend/legend.sass';
import LoadingSpinner from 'components/common/loading-spinner';
import MarkerTooltip from 'components/common/allegations-map/marker-tooltip';


describe('Map component', function () {
  let instance;
  const legend = {
    allegationCount: 20,
    sustainedCount: 3,
    useOfForceCount: 1,
  };

  const markerGroups = {
    crs: [
      {
        point: {
          lat: 42.012567,
          lon: -87.680291,
        },
        kind: 'CR',
        finding: 'Not Sustained',
        id: '123456',
        category: 'False Arrest',
        coaccused: 2,
        victims: [{
          gender: 'male',
          race: 'White',
          age: 32,
        }],
      },
      {
        point: {
          lat: 42.112567,
          lon: -87.180291,
        },
        kind: 'CR',
        finding: 'Sustained',
        id: '654321',
        category: 'False Arrest',
        coaccused: 1,
        victims: [{
          gender: 'male',
          race: 'White',
          age: 32,
        }],
      },
    ],
    trrs: [
      {
        point: {
          lat: 42.212567,
          lon: -87.280291,
        },
        kind: 'FORCE',
        id: '1234',
        category: 'Use of Force Report',
      },
    ],
  };

  beforeEach(function () {
    mapboxgl._resetHistory();
  });

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  describe('shouldComponentUpdate', function () {
    it('should return true if props are changed', function () {
      const newLegend = {
        allegationCount: 18,
        sustainedCount: 5,
        useOfForceCount: 3,
      };
      const newMarkers = {
        crs: [
          {
            point: {
              lat: 43.012567,
              lon: -89.680291,
            },
            kind: 'CR',
            finding: 'Sustained',
            id: 'C123456',
            category: 'False Arrest',
            coaccused: 5,
            victims: [{
              gender: 'male',
              race: 'White',
              age: 32,
            }],
          },
        ],
        trrs: [],
      };

      instance = renderIntoDocument(<AllegationsMap legend={ legend } markerGroups={ markerGroups }/>);
      instance.shouldComponentUpdate({ legend: newLegend, markerGroups }).should.be.true();
      instance.shouldComponentUpdate({ legend, markerGroups: newMarkers }).should.be.true();
      instance.shouldComponentUpdate({ legend: newLegend, markerGroups: newMarkers }).should.be.true();
    });

    it('should return false if props are unchanged', function () {
      instance = renderIntoDocument(<AllegationsMap legend={ legend } markerGroups={ markerGroups } />);
      instance.shouldComponentUpdate(
        { legend: cloneDeep(legend), markerGroups: cloneDeep(markerGroups) }
      ).should.be.false();
    });
  });

  describe('componentWillReceiveProps', function () {
    it('should call resetMap and addMapLayersOnStyleLoaded if next props clearAllMarkers is true', function () {
      const resetMapSpy = spy(AllegationsMap.prototype, 'resetMap');
      const addMapLayersOnStyleLoadedSpy = spy(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');

      instance = renderIntoDocument(
        <AllegationsMap
          legend={ legend }
          markerGroups={ markerGroups }
        />
      );

      instance = reRender(
        <AllegationsMap
          legend={ legend }
          markerGroups={ markerGroups }
          clearAllMarkers={ true }
        />,
        instance
      );
      resetMapSpy.should.be.called();
      addMapLayersOnStyleLoadedSpy.should.be.calledWith(markerGroups);
      AllegationsMap.prototype.resetMap.restore();
      AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
    });

    it('should only call addMapLayersOnStyleLoaded if next props clearAllMarkers is false', function () {
      const addMapLayersOnStyleLoadedSpy = spy(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');
      const newMarkers = {
        crs: [],
        trrs: [
          {
            point: {
              lat: 42.212567,
              lon: -87.280291,
            },
            kind: 'FORCE',
            id: '1234',
            category: 'Use of Force Report',
          },
        ],
      };

      instance = renderIntoDocument(
        <AllegationsMap
          legend={ legend }
          markerGroups={ markerGroups }
        />
      );

      instance = reRender(
        <AllegationsMap
          legend={ legend }
          markerGroups={ newMarkers }
          clearAllMarkers={ false }
        />,
        instance
      );
      addMapLayersOnStyleLoadedSpy.should.be.calledWith(newMarkers);
      AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
    });
  });

  it('should render officer map and legend', function () {
    instance = renderIntoDocument(
      <AllegationsMap legend={ legend } markerGroups={ markerGroups } showLegends={ true }/>
    );

    findRenderedDOMComponentWithClass(instance, mapStyles.map);
    findRenderedDOMComponentWithClass(instance, legendStyles.legend);
  });

  context('WithSpinner', function () {
    it('should render only loading spinner if requesting is true ', function () {
      instance = renderIntoDocument(<AllegationsMapWithSpinner legend={ legend } requesting={ true } />);

      const loadingSpinner = findRenderedComponentWithType(instance, LoadingSpinner);
      loadingSpinner.props.className.should.equal(mapStyles.allegationMapLoading);

      scryRenderedComponentsWithType(instance, AllegationsMap).should.have.length(0);
      scryRenderedComponentsWithType(instance, Legend).should.have.length(0);
      scryRenderedDOMComponentsWithClass(instance, 'map-tab').should.have.length(0);
    });

    it('should not render loading spinner if requesting is false', function () {
      instance = renderIntoDocument(<AllegationsMapWithSpinner legend={ legend } requesting={ false } />);

      scryRenderedComponentsWithType(instance, LoadingSpinner).should.have.length(0);
      findRenderedComponentWithType(instance, AllegationsMap);
    });
  });

  it('should call addMapLayersOnStyleLoaded when componentDidMount', function () {
    const addMapLayersOnStyleLoadedSpy = spy(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');
    const createMarker = (index) => ({
      point: {
        lat: 42.012567,
        lon: -87.680291,
      },
      id: index.toString(),
      kind: 'CR',
    });
    const markerGroups = {
      crs: times(3, createMarker),
      trrs: [],
    };
    instance = renderIntoDocument(<AllegationsMap legend={ legend } markerGroups={ markerGroups } />);
    addMapLayersOnStyleLoadedSpy.should.be.calledWith(markerGroups);
    AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
  });

  it('should show data loading spinner if showLegends is false and geographicDataLoading is true', function () {
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ false }
        geographicDataLoading={ true }
      />
    );
    const loadingSpinner = findRenderedComponentWithType(instance, LoadingSpinner);
    loadingSpinner.props.className.should.equal('data-loading-spinner');
  });

  it('should not show data loading spinner if both showLegends and geographicDataLoading are false', function () {
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ false }
        geographicDataLoading={ false }
      />
    );
    scryRenderedComponentsWithType(instance, LoadingSpinner).should.have.length(0);
  });

  it('should open CR page when clicking on CR marker', function () {
    const stubPush = stub(browserHistory, 'push');
    const event = {
      features: [
        {
          properties: {
            id: 'C123456',
            kind: 'CR',
            url: '/complaint/C123456/',
          },
        },
      ],
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );
    instance.handleMarkerClick(event);
    stubPush.should.be.calledWith('/complaint/C123456/');
    stubPush.restore();
  });

  it('should open TRR page when clicking on TRR marker', function () {
    const stubPush = stub(browserHistory, 'push');
    const event = {
      features: [
        {
          properties: {
            id: '123456',
            kind: 'FORCE',
            url: '/trr/123456/',
          },
        },
      ],
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );
    instance.handleMarkerClick(event);
    stubPush.should.be.calledWith('/trr/123456/');
    stubPush.restore();
  });

  it('should call handClickCRMarker if kind is CR', function () {
    const handleClickCRMarkerStub = stub();
    const handleClickTRRMarkerStub = stub();
    const event = {
      features: [
        {
          properties: {
            id: 'C123456',
            kind: 'CR',
            url: '/complaint/C123456/',
          },
        },
      ],
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
        handleClickCRMarker={ handleClickCRMarkerStub }
        handleClickTRRMarker={ handleClickTRRMarkerStub }
      />
    );
    instance.handleMarkerClick(event);
    handleClickCRMarkerStub.should.be.calledWith('C123456');
    handleClickTRRMarkerStub.should.be.calledWith(null);
  });

  it('should call handClickTRRMarker if kind is FORCE', function () {
    const handleClickCRMarkerStub = stub();
    const handleClickTRRMarkerStub = stub();
    const event = {
      features: [
        {
          properties: {
            id: '123456',
            kind: 'FORCE',
            url: '/trr/123456/',
          },
        },
      ],
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
        handleClickCRMarker={ handleClickCRMarkerStub }
        handleClickTRRMarker={ handleClickTRRMarkerStub }
      />
    );
    instance.handleMarkerClick(event);
    handleClickTRRMarkerStub.should.be.calledWith('123456');
    handleClickCRMarkerStub.should.be.calledWith(null);
  });

  it('should open tooltip if device is tablet when clicking', function () {
    const tabletStub = stub(isMobile, 'tablet').value(true);
    stub(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');

    const crMarkers = [
      {
        point: {
          lat: 42.012567,
          lon: -87.680291,
        },
        kind: 'CR',
        finding: 'Not Sustained',
        id: '123456',
        category: 'False Arrest',
        date: '2007-12-05',
      },
      {
        point: {
          lat: 42.112567,
          lon: -87.180291,
        },
        kind: 'CR',
        pointType: 'SUSTAINED-CR',
        finding: 'Sustained',
        id: '654321',
        category: 'False Arrest',
        date: '2008-12-05',
      },
    ];

    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    const mapOnStub = stub(instance.map, 'on');
    instance.addMapLayer('crs', crMarkers);
    mapOnStub.should.be.called();
    mapOnStub.getCall(0).args[0].should.eql('click');
    mapOnStub.getCall(0).args[1].should.eql('layer-0');
    mapOnStub.getCall(0).args[2].should.eql(instance.openTooltip);
    tabletStub.restore();
    mapOnStub.restore();
    AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
  });

  describe('addMapLayer', function () {
    it('should bind mouse enter, mouse leave and click events when calling addMapLayer', function () {
      const addMarkerHoverStateStub = stub(AllegationsMap.prototype, 'addMarkerHoverState');
      const removeMarkerHoverStateStub = stub(AllegationsMap.prototype, 'removeMarkerHoverState');
      const openTooltipStub = stub(AllegationsMap.prototype, 'openTooltip');
      stub(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');
      const crMarkers = [
        {
          point: {
            lat: 42.012567,
            lon: -87.680291,
          },
          kind: 'CR',
          finding: 'Not Sustained',
          id: '123456',
          category: 'False Arrest',
          date: '2007-12-05',
        },
        {
          point: {
            lat: 42.112567,
            lon: -87.180291,
          },
          kind: 'CR',
          pointType: 'SUSTAINED-CR',
          finding: 'Sustained',
          id: '654321',
          category: 'False Arrest',
          date: '2008-12-05',
        },
      ];
      const event = {
        features: [
          {
            geometry: {
              coordinates: [-87.680291, 42.012567],
            },
            properties: {
              id: 'C123456',
              kind: 'CR',
              url: '/complaint/C123456/',
              date: '2007-12-05',
              category: 'False Arrest',
            },
            id: 1,
          },
        ],
      };

      instance = renderIntoDocument(
        <AllegationsMap
          markerGroups={ markerGroups }
          geographicDataLoading={ false }
        />
      );

      const mapOnStub = stub(instance.map, 'on');

      instance.addMapLayer('crs', crMarkers);

      instance.map.addSource.should.be.calledWith(
        'layer-0',
        {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  id: '123456',
                  kind: 'CR',
                  pointType: 'CR',
                  date: '2007-12-05',
                  category: 'False Arrest',
                  url: '/complaint/123456/',
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-87.680291, 42.012567],
                },
                id: 0,
              },
              {
                type: 'Feature',
                properties: {
                  id: '654321',
                  kind: 'CR',
                  pointType: 'SUSTAINED-CR',
                  date: '2008-12-05',
                  category: 'False Arrest',
                  url: '/complaint/654321/',
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-87.180291, 42.112567],
                },
                id: 1,
              },
            ],
          },
        },
      );

      instance.map.addLayer.should.be.called();
      const addLayerArg = instance.map.addLayer.getCall(0).args[0];
      addLayerArg['id'].should.eql('layer-0');
      addLayerArg['type'].should.eql('circle');
      addLayerArg['source'].should.eql('layer-0');

      mapOnStub.callCount.should.eql(3);
      const mouseEnterArgs = mapOnStub.getCall(0).args;
      mouseEnterArgs[0].should.eql('mouseenter');
      mouseEnterArgs[1].should.eql('layer-0');
      mouseEnterArgs[2](event);
      addMarkerHoverStateStub.should.be.calledWith('layer-0', 1);
      openTooltipStub.should.be.calledWith(event);

      const mouseLeaveArgs = mapOnStub.getCall(1).args;
      mouseLeaveArgs[0].should.eql('mouseleave');
      mouseLeaveArgs[1].should.eql('layer-0');
      mouseLeaveArgs[2]();
      removeMarkerHoverStateStub.should.be.called();
      instance.tooltip.remove.should.be.called();

      const mouseClickArgs = mapOnStub.getCall(2).args;
      mouseClickArgs[0].should.eql('click');
      mouseClickArgs[1].should.eql('layer-0');
      mouseClickArgs[2].should.eql(instance.handleMarkerClick);

      mapOnStub.restore();
      AllegationsMap.prototype.addMarkerHoverState.restore();
      AllegationsMap.prototype.removeMarkerHoverState.restore();
      AllegationsMap.prototype.openTooltip.restore();
      AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
    });

    it('should not add new layer if marker data is empty', function () {
      stub(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');

      instance = renderIntoDocument(
        <AllegationsMap
          markerGroups={ markerGroups }
          geographicDataLoading={ false }
        />
      );


      instance.addMapLayer('crs', []);

      instance.map.addSource.should.not.be.called();
      instance.map.addLayer.should.not.be.called();

      AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
    });

    it('should addLayer with correct aboveLayerName', function () {
      stub(AllegationsMap.prototype, 'addMapLayersOnStyleLoaded');
      const crMarkers1 = [
        {
          point: {
            lat: 42.012567,
            lon: -87.680291,
          },
          kind: 'CR',
          finding: 'Not Sustained',
          id: '123456',
          category: 'False Arrest',
          date: '2007-12-05',
        },
      ];
      const crMarkers2 = [
        {
          point: {
            lat: 42.112567,
            lon: -87.180291,
          },
          kind: 'CR',
          pointType: 'SUSTAINED-CR',
          finding: 'Sustained',
          id: '654321',
          category: 'False Arrest',
          date: '2008-12-05',
        },
      ];
      const crMarkers3 = [
        {
          point: {
            lat: 46.112567,
            lon: -89.180291,
          },
          kind: 'CR',
          pointType: 'SUSTAINED-CR',
          finding: 'Sustained',
          id: '789123',
          category: 'False Arrest',
          date: '2009-08-05',
        },
      ];
      const trrMarkers = [
        {
          point: {
            lat: 42.212567,
            lon: -87.280291,
          },
          kind: 'FORCE',
          id: '1234',
          category: 'Use of Force Report',
        },
      ];

      instance = renderIntoDocument(
        <AllegationsMap
          markerGroups={ markerGroups }
          geographicDataLoading={ false }
        />
      );

      instance.addMapLayer('crs', crMarkers1);
      should(instance.map.addLayer.getCall(0).args[1]).be.undefined();

      instance.map.addLayer.resetHistory();
      instance.addMapLayer('crs', crMarkers2);
      instance.map.addLayer.getCall(0).args[1].should.equal('layer-0');

      instance.map.addLayer.resetHistory();
      instance.addMapLayer('trrs', trrMarkers);
      should(instance.map.addLayer.getCall(0).args[1]).be.undefined();

      instance.map.addLayer.resetHistory();
      instance.addMapLayer('crs', crMarkers3);
      instance.map.addLayer.getCall(0).args[1].should.equal('layer-2');

      AllegationsMap.prototype.addMapLayersOnStyleLoaded.restore();
    });
  });

  it('should return correct url when calling getUrl', function () {
    const crMarker = {
      id: 'C123456',
      kind: 'CR',
      category: 'False Arrest',
    };
    const trrMarker = {
      id: '123456',
      kind: 'FORCE',
      category: 'Use of Force',
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    instance.getUrl(crMarker).should.equal('/complaint/C123456/');
    instance.getUrl(trrMarker).should.equal('/trr/123456/');
  });

  it('should return correct marker uid when calling markerUid', function () {
    const crMarker = {
      id: 'C123456',
      kind: 'CR',
      category: 'False Arrest',
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    instance.markerUid(crMarker).should.equal('CR-C123456');
  });

  it('should add MarkerTooltip to map when calling openTooltip', function () {
    const event = {
      features: [
        {
          geometry: {
            coordinates: [-87.680291, 42.012567],
          },
          properties: {
            id: 'C123456',
            kind: 'CR',
            url: '/complaint/C123456/',
            date: '2007-12-05',
            category: 'False Arrest',
          },
        },
      ],
    };
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    const tooltip = (<MarkerTooltip date='2007-12-05' category='False Arrest' url='/complaint/C123456/'/>);
    instance.openTooltip(event);
    instance.tooltip.setLngLat.should.be.calledWith([-87.680291, 42.012567]);
    instance.tooltip.setHTML.should.be.calledWith(ReactDOMServer.renderToString(tooltip));
    instance.tooltip.addTo.should.be.calledWith(instance.map);
  });

  it('should return initial data when calling initMapData', function () {
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    instance.initMapData();
    instance.layerNames.should.eql([]);
    instance.currentMarkers.should.eql(new Set());
    instance.mapboxglLayerIndex.should.eql(0);
    instance.firstLayer.should.eql({});
    instance.hoveredState.should.eql({});
  });

  it('should reset the map when calling resetMap', function () {
    const initMapDataSpy = spy(AllegationsMap.prototype, 'initMapData');

    instance = renderIntoDocument(<AllegationsMap/>);
    initMapDataSpy.should.be.calledOnce();
    initMapDataSpy.resetHistory();
    instance.map.isStyleLoaded.returns(true);
    instance.layerNames = ['layer-0'];

    instance.resetMap();

    initMapDataSpy.should.be.calledOnce();
    instance.map.removeLayer.should.be.calledWith('layer-0');
    instance.map.removeSource.should.be.calledWith('layer-0');
    AllegationsMap.prototype.initMapData.restore();
  });

  it('should return correct data when calling mapMarkersData', function () {
    const crMarkers = [
      {
        point: {
          lat: 42.012567,
          lon: -87.680291,
        },
        kind: 'CR',
        finding: 'Not Sustained',
        id: '123456',
        category: 'False Arrest',
        date: '2007-12-05',
      },
      {
        point: {
          lat: 42.112567,
          lon: -87.180291,
        },
        kind: 'CR',
        pointType: 'SUSTAINED-CR',
        finding: 'Sustained',
        id: '654321',
        category: 'False Arrest',
        date: '2008-12-05',
      },
    ];
    instance = renderIntoDocument(<AllegationsMap/>);

    instance.mapMarkersData(crMarkers).should.eql([
      {
        type: 'Feature',
        properties: {
          id: '123456',
          kind: 'CR',
          pointType: 'CR',
          date: '2007-12-05',
          category: 'False Arrest',
          url: '/complaint/123456/',
        },
        geometry: {
          type: 'Point',
          coordinates: [-87.680291, 42.012567],
        },
        id: 0,
      },
      {
        type: 'Feature',
        properties: {
          id: '654321',
          kind: 'CR',
          pointType: 'SUSTAINED-CR',
          date: '2008-12-05',
          category: 'False Arrest',
          url: '/complaint/654321/',
        },
        geometry: {
          type: 'Point',
          coordinates: [-87.180291, 42.112567],
        },
        id: 1,
      },
    ]);
  });

  it('should call addMapLayer when calling addMapLayers', function () {
    const addMapLayerSpy = spy(AllegationsMap.prototype, 'addMapLayer');
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );
    addMapLayerSpy.resetHistory();

    instance.addMapLayers(markerGroups);
    addMapLayerSpy.should.be.calledTwice();
    AllegationsMap.prototype.addMapLayer.restore();
  });

  it('should add hover state for marker when calling addMarkerHoverState', function () {
    const removeMarkerHoverStateStub = stub(AllegationsMap.prototype, 'removeMarkerHoverState');
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    instance.addMarkerHoverState('layer-0', 1);
    removeMarkerHoverStateStub.should.be.called();
    instance.hoveredState.should.eql({
      source: 'layer-0',
      id: 1,
    });
    instance.map.setFeatureState.should.be.calledWith(
      {
        source: 'layer-0',
        id: 1,
      },
      {
        hover: true,
      }
    );

    AllegationsMap.prototype.removeMarkerHoverState.restore();
  });

  it('should remove hover state for marker when calling removeMarkerHoverState', function () {
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );

    instance.hoveredState = {
      source: 'layer-0',
      id: 1,
    };

    instance.removeMarkerHoverState();
    instance.map.setFeatureState.should.be.calledWith(
      {
        source: 'layer-0',
        id: 1,
      },
      {
        hover: false,
      }
    );
    instance.hoveredState.should.eql({});
  });

  it('should add map layer when calling addMapLayersOnStyleLoaded', function () {
    const addMapLayersStub = stub(AllegationsMap.prototype, 'addMapLayers');
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        showLegends={ true }
        geographicDataLoading={ false }
      />
    );
    addMapLayersStub.resetHistory();

    instance.map.isStyleLoaded.returns(true);
    instance.addMapLayersOnStyleLoaded(markerGroups);
    addMapLayersStub.should.be.calledOnce();
    addMapLayersStub.restore();
  });

  it('should call addControl when component render', function () {
    instance = renderIntoDocument(
      <AllegationsMap
        legend={ legend }
        markerGroups={ markerGroups }
        attributionControlPosition='bottom-left'
      />
    );

    instance.map.addControl.should.be.calledTwice();
    const attributionControlArgs = instance.map.addControl.getCall(0).args;
    (attributionControlArgs[0] instanceof mapboxgl.AttributionControl).should.be.true();
    attributionControlArgs[1].should.equal('bottom-left');

    const navigationControllArgs = instance.map.addControl.getCall(1).args;
    (navigationControllArgs[0] instanceof mapboxgl.NavigationControl).should.be.true();
    navigationControllArgs[1].should.equal('top-left');
  });
});