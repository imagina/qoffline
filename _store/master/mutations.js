export const APP_OFFLINE = (state) => {
  state.isAppOffline = true;
};
export const HANDLE_MODAL_SYNC = (state, data) => {
  state.isOpenModalSync = data;
};

export function SET_REQUESTS (state, data) {
  const STATUS = 'PENDING'
  
  state.requestsReversed = data?.reverse()

  state.totalRequests = data?.length
  const pendingRequests = data.filter(request => request.metadata.status === STATUS)
  state.pendingRequests = pendingRequests.length
}

export const APP_ONLINE = (state) => {
  state.isAppOffline = false;
};
