import router from 'src/router/index';
import {helper} from '@imagina/qhelper/_plugins/helper';
import {request} from '@imagina/qoffline/_plugins/request';


export const APP_OFFLINE = ({commit, dispatch}) => {
  helper.storage.get.item('offlineRequests').then(offReqsts => {
    offReqsts = request.userCurrentOfflineRequests(offReqsts);
    commit('APP_OFFLINE', offReqsts);
  });
};

export const APP_SAVE_OFFLINE_REQUEST = ({commit, dispatch},serialized) => {
  return new Promise((resolve, reject) => {
    helper.storage.get.item('offlineRequests').then(function (offReqsts) {

      offReqsts = offReqsts || [];
      let save = true;

      //find if exist same request in offline request saved then save pass to false
      offReqsts.forEach((request, index) => {
        if (request.id == serialized.id && request.type == serialized.type && request.userId == serialized.userId)
          save = false;
      })
      
      //if can save
      if (save) {
        offReqsts.push(serialized);
        helper.storage.set('offlineRequests', offReqsts).then(function () {
          offReqsts = request.userCurrentOfflineRequests(offReqsts);
          dispatch("APP_OFFLINE")
          resolve(true);
        });
      }else
        reject(false)
    
    });
   
  })
};


export const APP_ONLINE_SENDING_REQUESTS = ({commit, dispatch},offReqsts) =>{
  offReqsts = request.userCurrentOfflineRequests(offReqsts);
  if(offReqsts.length)
    commit('APP_ONLINE_SENDING_REQUESTS',offReqsts);
  else
    commit('APP_ONLINE');
  
}

export const APP_ONLINE = ({commit, dispatch}) => {

      commit('APP_ONLINE');

  
}
