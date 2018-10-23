import {helper} from '@imagina/qhelper/_plugins/helper' //LocalForage
import http from "axios"
import store from 'src/store/index'

class Request {
  constructor() {
  
  }
  
  /**
   * Serialize request object to save it on localforage
   *@param request type {object} required
   */
  serialize(reqConfig) {
    
    //Only if method is not GET or HEAD is the request allowed to have body.
    if (reqConfig.method !== 'get' && reqConfig.method !== 'head') {
      let serialized = {
        request: {
          url: reqConfig.url,
          method: reqConfig.method,
          data: reqConfig.data,
        },
        type: reqConfig.type,
        id: reqConfig.id,
      };
      return Promise.resolve(serialized);
    }
    return Promise.reject(false);
  }
  
  /**
   * Deserialize request
   *@param request type {object} required
   */
  deserialize(data) {
    return Promise.resolve(data.request);
  }
  
  
  /**
   * check online status and save request if is post method
   * @param reqConfig
   * @returns {Promise<any>}
   */
  saveOffline(reqConfig) {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine)
        this.saveRequest(reqConfig).then((response) => {
          resolve(response)
        }).catch(error =>{
          reject(false)
        })
      else
        resolve(false);
    })
  }
  
  /**
   *  save request on Storage
   * @param reqConfig
   * @returns {Promise<any>}
   */
  saveRequest(reqConfig) {
    return new Promise((resolve, reject) => {
      this.serialize(reqConfig).then( (serialized) => {
        console.warn("request serialized: ", serialized);
  
        store.dispatch("offline/APP_SAVE_REQUEST",serialized).then(response => {
          resolve(true)
        }).catch(error =>{
          reject(error)
        });
      });
    })
  }
  
  /**
   * send request one by one
   * @param requests
   */
  sendRequests(requests) {
    //The reduce() chains one promise per serialized request, not allowing to progress to the next one until completing the current.
    var sending = requests.reduce((prevPromise, serialized) => {
      
      console.warn('Sending', serialized);
      
      store.dispatch("offline/APP_ONLINE_SENDING_REQUESTS");
      
      return prevPromise.then(() => {
        return this.deserialize(serialized).then((request) => {
          return http.request(request).then(response => {
            this.refresh(serialized);
            console.warn("Request Sent",request);
          });
        });
      });
    },Promise.resolve());
    return sending;
  }
  
  /**
   * clean offlineRequest of localstorage
   * @returns {PromiseLike<T> | Promise<T>}
   */
  sendAndflushRequests() {
    
    return helper.storage.get.item('offlineRequests').then(requests => {
      /* eslint no-param-reassign: 0 */
      requests = requests || [];
      //If empty, nothing to do!
      if (!requests.length) {
        return Promise.resolve();
      }
      //Else, send the requests in order…
      return this.sendRequests(requests).then( () => {
        console.log("ALL REQUESTS SENT");
        store.dispatch("offline/APP_ONLINE");
        
      });
    });
  }
  
  refresh(request){
    
      helper.storage.get.item("offlineRequests").then(offReqsts => {
        let pos = -1;
        offReqsts.forEach((offReq,index)=>{
          if(offReq.id == request.id && offReq.type == request.type)
            pos = index;
        })
        offReqsts.splice(pos, 1);
        
        try {
          helper.storage.set("offlineRequests", offReqsts).then(response =>{
          });
        } catch (error) {
          console.log(error)
        }
      })
    
    
  }
  
}


const request = new Request();


export default ({Vue}) => {
  Vue.prototype.$request = request;
}

export {request};
