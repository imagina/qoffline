import router from 'src/router/index';
import {helper} from '@imagina/qhelper/_plugins/helper';
import {request} from '@imagina/qoffline/_plugins/request';
import axios from 'axios';
import config from 'src/config/index'

export const APP_OFFLINE = ({commit, dispatch}) => {
  helper.storage.get.item('offlineRequests').then(offReqsts => {
    offReqsts = offReqsts || [];
    commit('APP_OFFLINE', offReqsts);
  });
};

export const APP_SAVE_REQUEST = ({commit, dispatch},serialized) => {
  return new Promise((resolve, reject) => {
    helper.storage.get.item('offlineRequests').then(function (offReqsts) {

      offReqsts = offReqsts || [];
      let save = true;
      
      //find if exist same request in offline request saved then save pass to false
      offReqsts.forEach((request, index) => {
        if (request.id == serialized.id && request.type == serialized.type)
          save = false;
      })
      
      //if can save
      if (save) {
        offReqsts.push(serialized);
        helper.storage.set('offlineRequests', offReqsts).then(function () {
          commit('APP_OFFLINE',offReqsts);
          resolve(true);
        });
      } else
        reject(false)
    
    });
   
  })
};

export const APP_ONLINE_SENDING_REQUESTS = ({commit}) =>{
  helper.storage.get.item('offlineRequests').then(offReqsts => {
    offReqsts = offReqsts || [];
    commit('APP_ONLINE_SENDING_REQUESTS', offReqsts);
  });
  
}

export const APP_ONLINE = ({commit, dispatch}) => {
  commit('APP_ONLINE');
}
