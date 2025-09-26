export const isExpired = (event: { created_at: string; expires_in_hours: number }) => {
  const currentTime = Date.now();
  const expiryTime = new Date(event.created_at).getTime() + event.expires_in_hours * 1000 * 60 * 60;
  return currentTime >= expiryTime;
};
