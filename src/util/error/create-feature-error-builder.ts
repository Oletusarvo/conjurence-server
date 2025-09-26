/**Creates a function returning a fully typed error message in the format of feature:message. */
export const createFeatureErrorFn = <ET extends string>(feature: ET) => {
  const getError = <T extends string>(label: T) =>
    `${feature}:${label}` as `${typeof feature}:${T}`;
  return getError;
};
