export const isOffline = (state) => {
  return state.isAppOffline;
};
export const offlineRequests = (state) => {
  return state.requests;
};
export const dataPreloadDone = (state) => {
  return state.dataPreloadDone;
};