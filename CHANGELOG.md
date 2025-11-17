## [1.0.0] - 17-11-2025

### Added

- The createHandler utility function that handles catching errors thrown by a provided handler, and returning a 500-response automatically.

### Changed

- Event templates are now "activities", and each event references an activity by id; events themselves no longer have a title or a description.
- registerCredentialsSchema now contains the token, and is used to validate the body of a request made to the registerHandler.

## [0.13.1] - 05-10-2025

### Added

- A 404 response from the password-reset verification route when an account with a given email does not exist.

## [0.13.0] - 02-10-2025

### Changed

- Sending emails using brevos api instead of smtp and nodemailer.

## [0.12.0] - 02-01-2025

### Added

- Event deletion endpoint.
- User rating.
- User rating endpoint.

### Changed

- The name of the email variable on the /auth/reset-password/verify endpoint from "to" to "email".

## [0.11.0] - 28-09-2025

### Added

- Migrated over the email verification and password reset routes.

## [0.10.1] - 28-09-2025

### Changed

- Removed the auth-header console log.

## [0.10.0] - 27-09-2025

### Changed

- Rewrote some routes.

## [0.9.0-beta] - 26-09-2025

Migrated to a pure express-server from the previous next.js app.

### Added

- User delete route.
