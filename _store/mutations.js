

export const APP_OFFLINE = (state, data) => {
  state.offlineRequests = data;
  state.offlineMode = true;
  state.sendingRequests = false;
  state.totalRequests = data.length;
};

export const APP_ONLINE = (state) => {
  state.offlineRequests = null;
  state.offlineMode = false;
  state.sendingRequests = false;
  state.totalRequests = 0;
};

export const APP_ONLINE_SENDING_REQUESTS = (state, data) => {
  state.offlineRequests = data;
  state.offlineMode = false;
  state.sendingRequests = true;
  state.totalRequests = data.length;
};
