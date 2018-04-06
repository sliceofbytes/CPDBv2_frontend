import { createSelector } from 'reselect';
import { map, get } from 'lodash';

import { extractPercentile } from 'selectors/landing-page/common';


const getCoaccused = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? [] : state.crs[crid].coaccused;
};

const getComplainants = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? [] : state.crs[crid].complainants;
};

const getCR = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? {} : state.crs[crid];
};

const getInvolvements = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? [] : state.crs[crid].involvements;
};

const getDocuments = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? [] : state.crs[crid].documents;
};

const getVideos = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? [] : state.crs[crid].videos;
};

const getAudios = state => {
  const crid = state.crPage.crid;
  return !state.crs[crid] ? [] : state.crs[crid].audios;
};

export const getCRID = state => String(state.crPage.crid);
export const getOfficerId = state => state.crPage.officerId;

export const getDocumentAlreadyRequested = state => {
  const crid = state.crPage.crid;
  return Boolean(get(
    state, `crPage.attachmentRequest.subscribedCRIDs[${crid}]`, undefined
  ));
};

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
    fullname: coaccused['full_name'],
    rank: coaccused['rank'] || 'Officer',
    gender: coaccused['gender'] || 'Unknown',
    race: coaccused['race'] || 'Unknown',
    outcome: coaccused['final_outcome'] || 'Unknown Outcome',
    category: coaccused['category'] || 'Unknown',
    age: coaccused['age'],
    allegationCount: coaccused['allegation_count'],
    sustainedCount: coaccused['sustained_count'],
    startDate: coaccused['start_date'],
    endDate: coaccused['end_date'],
    allegationPercentile: coaccused['percentile_allegation'],
    percentile: extractPercentile(coaccused)
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
  getDocuments,
  getVideos,
  getAudios,
  (coaccused, complainants, cr, involvements, documents, videos, audios) => ({
    coaccused,
    complainants,
    point: cr.point,
    incidentDate: cr['incident_date'],
    address: cr.address,
    crLocation: cr.location,
    beat: cr.beat || 'Unknown',
    involvements,
    documents,
    videos,
    audios,
  })
);
