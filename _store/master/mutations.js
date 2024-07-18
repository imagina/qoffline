export const APP_OFFLINE = (state) => {
  state.isAppOffline = true;
};
export const APP_ONLINE = (state) => {
  state.isAppOffline = false;
};

export function SET_REQUESTS (state, data) {
  const STATUS = 'PENDING'
  
  state.requestsReversed = data?.reverse()

  const requestPending = data.filter(request => request.metadata.status === STATUS)
  state.totalRequests = requestPending.length
}
