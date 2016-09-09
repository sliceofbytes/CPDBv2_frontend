import { createSelector } from 'reselect';
import { get } from 'lodash';
import moment from 'moment';

import { DEFAULT_IMAGE_DIMENSION, DATE_FORMAT, DATE_FORMAT_IN } from 'utils/constants';
import { mediaUrl } from 'utils/static-assets';


const getIsRequesting = state => state.landingPage.storyApp.isRequesting;

const getStories = state => state.landingPage.storyApp.stories;

export const getImageUrl = story => (
  (get(story, `image_url.${DEFAULT_IMAGE_DIMENSION}`) && mediaUrl(story['image_url'][DEFAULT_IMAGE_DIMENSION])) || ''
);

export function rawStoryTransform(story) {
  return {
    id: story.id,
    title: story.title,
    canonicalUrl: story['canonical_url'],
    publicationName: story['publication_name'],
    publicationShortUrl: story['publication_short_url'],
    date: moment(story['post_date'], DATE_FORMAT_IN).format(DATE_FORMAT),
    paragraphs: story.body && story.body.map(p => p.value),
    imageUrl: getImageUrl(story)
  };
}

export const storiesSelector = createSelector(getStories, (stories) => {
  return stories.map(rawStoryTransform);
});

export const dataAvailableSelector = createSelector(
  getIsRequesting,
  storiesSelector,
  (isRequesting, stories) => {
    return !isRequesting && stories.length >= 3;
  }
);
