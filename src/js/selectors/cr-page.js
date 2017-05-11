import { createSelector } from 'reselect';
import { map } from 'lodash';


const getCoaccused = (state, { crid }) => !state.crs[crid] ? [] : state.crs[crid].coaccused;
const getComplainants = (state, { crid }) => !state.crs[crid] ? [] : state.crs[crid].complainants;
const getCR = (state, { crid }) => !state.crs[crid] ? {} : state.crs[crid];
const getInvolvements = (state, { crid }) => !state.crs[crid] ? [] : state.crs[crid].involvements;

const getComplainantStringSelector = createSelector(
  getComplainants,
  (complainants) => map(complainants, ({ race, gender, age }) => {
    race = race ? race : 'Unknown';
    gender = gender ? gender : 'Unknown';

    if (age) {
      return `${race}, ${gender}, Age ${age}`;
    } else {
      return `${race}, ${gender}`;
    }
  })
);

const getCoaccusedSelector = createSelector(
  getCoaccused,
  coaccusedList => map(coaccusedList, coaccused => ({
    id: coaccused.id,
    fullName: coaccused['full_name'],
    gender: coaccused['gender'] || 'Unknown',
    race: coaccused['race'] || 'Unknown',
    finalFinding: coaccused['final_finding'] || 'Unknown',
    reccOutcome: coaccused['recc_outcome'] || 'Unknown',
    finalOutcome: coaccused['final_outcome'] || 'Unknown',
    startDate: coaccused['start_date'],
    endDate: coaccused['end_date'],
    category: coaccused['category'] || 'Unknown',
    subcategory: coaccused['subcategory'] || 'Unknown'
  }))
);

const getInvolvementsSelector = createSelector(
  getInvolvements,
  involvements => map(involvements, obj => ({
    involvedType: obj['involved_type'],
    officers: map(obj.officers, officer => ({
      id: officer.id,
      abbrName: officer['abbr_name'],
      extraInfo: officer['extra_info']
    }))
  }))
);

export const contentSelector = createSelector(
  getCoaccusedSelector,
  getComplainantStringSelector,
  getCR,
  getInvolvementsSelector,
  (coaccused, complainants, cr, involvements) => ({
    coaccused,
    complainants,
    point: cr.point,
    incidentDate: cr['incident_date'],
    address: cr.address,
    location: cr.location,
    beat: cr.beat || { name: 'Unknown' },
    involvements
  })
);