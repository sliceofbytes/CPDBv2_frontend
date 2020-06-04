import RawRelevantComplaintFactory from 'utils/test/factories/pinboard-page/raw-relevant-complaint';
import { paginationResponse } from 'mock-api/pinboard-page/common';
import RawRelevantCoaccusalFactory from 'utils/test/factories/pinboard-page/raw-officer';
import { get, filter, includes } from 'lodash';


const generateComplaints = paginationResponse('relevant-complaints', RawRelevantComplaintFactory);

export const getFirstRelevantComplaints = (pinboardId, count) => {
  const complaints = generateComplaints(pinboardId, 20, 0, count);
  const fixedComplaints = [
    RawRelevantComplaintFactory.build({
      'crid': '1071234',
      'category': 'Lockup Procedures',
      'incident_date': '2004-04-23',
      'address': '51XX South WENTWORTH AVE, CHICAGO ILLINOIS 60609',
      'sub_category': 'Prisoners Property',
      'coaccused': [
        RawRelevantCoaccusalFactory.build({
          'id': 123,
          rank: 'Detective',
          'full_name': 'Richard Sullivan',
          'coaccusal_count': 53,
          'percentile_allegation': '22.2200',
          'allegation_count': 33,
        }),
        RawRelevantCoaccusalFactory.build({
          'id': 456,
          rank: 'Officer',
          'full_name': 'Baudilio Lopez',
          'coaccusal_count': 47,
        }),
        ...RawRelevantCoaccusalFactory.buildList(8),
      ],
      'victims': [
        {
          'gender': 'Male',
          'race': 'Black',
        },
        {
          'gender': 'Male',
          'race': 'Black',
        },
      ],
    }),
    RawRelevantComplaintFactory.build({
      'crid': '1079876',
      'category': 'Operations/Personnel Violation',
      'incident_date': '2014-05-02',
      'coaccused': RawRelevantCoaccusalFactory.buildList(10),
    }),
  ];
  complaints.results = fixedComplaints.concat(complaints.results).slice(0, 20);
  return complaints;
};


export const filterPinnedComplaints = (complaints, currentPinboard={}) => {
  const pinnedCrids = get(currentPinboard, 'crids', []);
  complaints.results = filter(complaints.results, cr => !includes(pinnedCrids, cr.crid));
  return complaints;
};

export default generateComplaints;
