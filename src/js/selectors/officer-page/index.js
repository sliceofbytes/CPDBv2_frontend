import { createSelector } from 'reselect';
import { map, sortBy } from 'lodash';


const getSummary = state => state.officerPage.summary;
export const getOfficerName = state => state.officerPage.fullName;
export const getComplaintsCount = state => state.officerPage.complaintsCount;
export const getSustainedCount = state => state.officerPage.sustainedCount;
const getComplaintFacets = state => state.officerPage.complaintFacets;

export const getComplaintFacetsSelector = createSelector(
  getComplaintFacets,
  complaintFacets => (map(complaintFacets, ({ name, entries }) => ({
    name,
    entries: sortBy(
      map(entries, entry => ({
        name: entry['name'],
        count: entry['count'],
        sustainedCount: entry['sustained_count']
      })),
      [obj => obj.name === 'Unknown', obj => obj.name]
    )
  })
)));

export const summarySelector = createSelector(
  getSummary,
  summary => ({
    unitName: summary.unit,
    rank: summary.rank ? summary.rank : 'N/A',
    dateOfAppt: summary['date_of_appt'],
    race: summary.race,
    gender: summary.gender,
    badge: summary.badge
  })
);