export const APP_OFFLINE = (state) => {
  state.isAppOffline = true;
};
export const APP_ONLINE = (state) => {
  state.isAppOffline = false;
};

export function SET_REQUESTS (state, data) {
  state.requestsReversed = data.reverse()
  state.totalRequests = state.requests?.length
}
