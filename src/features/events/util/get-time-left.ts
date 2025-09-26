import { getExpiryTime } from './get-expiry-time';

export const getTimeLeft = (e: any) => {
  const expiryTime = getExpiryTime(e);
  return expiryTime - Date.now();
};
