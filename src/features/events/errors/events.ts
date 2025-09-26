import { createFeatureErrorFn } from '../../../util/error/create-feature-error-builder';

const getError = createFeatureErrorFn('event');
export const EventError = {
  titleTooShort: getError('title_too_short'),
  titleTooLong: getError('title_too_long'),
  descriptionTooLong: getError('description_too_long'),
  maximumTemplateCount: getError('maximum_template_count'),
  templatesNotAllowed: getError('templates_not_allowed'),
  singleAttendance: getError('single_attendance'),
  locationTooShort: getError('location_too_short'),
  locationTooLong: getError('location_too_long'),
  locationDisabled: getError('location_disabled'),
  sizeNotAllowed: getError('size_not_allowed'),
  mobileNotAllowed: getError('mobile_not_allowed'),
  ended: getError('ended'),
};

export type TEventError = (typeof EventError)[keyof typeof EventError];
