export const getExpiryTime = (e: { expires_in_hours: number; created_at: string }) => {
  return e.expires_in_hours * 60 * 60 * 1000 + new Date(e.created_at).getTime();
};
