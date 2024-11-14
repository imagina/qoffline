export const APP_OFFLINE = (state) => {
  state.isAppOffline = true;
};
export const HANDLE_MODAL_SYNC = (state, data) => {
  state.isOpenModalSync = data;
};

export function SET_REQUESTS (state, data=[]) {
  const STATUS = 'PENDING'

  const validatedData = Array.isArray(data) ? data : []
  
  state.requestsReversed = validatedData.reverse()

  state.totalRequests = validatedData.length
  const pendingRequests = validatedData.filter(request => request.metadata.status === STATUS)
  state.pendingRequests = pendingRequests.length
}

export const APP_ONLINE = (state) => {
  state.isAppOffline = false;
};
