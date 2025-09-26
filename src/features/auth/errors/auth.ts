import { createFeatureErrorFn } from '../../../util/error/create-feature-error-builder';

const getError = createFeatureErrorFn('auth');
export const AuthError = {
  emailInvalidDomain: getError('email_invalid_domain'),
  passwordTooShort: getError('password_too_short'),
  passwordTooLong: getError('password_too_long'),
  passwordInvalidFormat: getError('password_invalid_format'),
  passwordMismatch: getError('password_mismatch'),
  usernameTooShort: getError('username_too_short'),
  usernameTooLong: getError('username_too_long'),
  duplicateUsername: getError('duplicate_username'),
  duplicateEmail: getError('duplicate_email'),
  noCredentials: getError('no_credentials'),
  userDeleted: getError('user_deleted'),
  unauthorized: getError('unauthorized'),
  invalidCredentials: getError('invalid_credentials'),
};

export type TAuthError = (typeof AuthError)[keyof typeof AuthError];
