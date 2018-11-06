

export const APP_OFFLINE = (state, data) => {
  state.offlineRequests = data;
  state.offlineMode = true;
  state.sendingRequests = false;
  state.totalOffRequests = data.length;

};

export const APP_ONLINE = (state) => {
  state.offlineRequests = [];
  state.offlineMode = false;
  state.sendingRequests = false;
  state.totalOffRequests = 0;

};

export const APP_ONLINE_SENDING_REQUESTS = (state, data) => {
  state.offlineRequests = data;
  state.offlineMode = false;
  state.sendingRequests = true;
  state.totalOffRequests = data.length;
};
