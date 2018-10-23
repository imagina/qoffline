/*
export const someGetter = (state) => {}
*/

export const requests = (state) => {
    return state.offlineRequests;
};

export const isOffline = (state) => {
  return state.offlineMode;
};

export const isSendingRequests = (state) => {
  return state.sendingRequests;
};

export const totalRequests = (state) => {
    return state.totalRequests;
}