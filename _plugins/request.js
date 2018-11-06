import {helper} from '@imagina/qhelper/_plugins/helper' //LocalForage
import http from "axios"
import store from 'src/store/index'
import {alert} from '@imagina/qhelper/_plugins/alert'
import {notification} from '@imagina/qnotification/_plugins/notification'

class Request {
  constructor() {
  
  }
  
  /**
   * filter post methods request to save it on localforage
   *@param request type {object} required
   */
  filterMethod(reqConfig) {
    
    //Only if method is not GET or HEAD is the request allowed to have body.
    if (reqConfig.request.method !== 'get' && reqConfig.request.method !== 'head')
      return Promise.resolve(reqConfig);
    
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
      if (!navigator.onLine) {
        this.saveRequest(reqConfig).then((response) => {
          resolve(response)
        }).catch(error => {
          reject(false)
        })
      }else
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
      this.filterMethod(reqConfig).then((serialized) => {
        // this state save the request in localForage, and verify if is duplicated
        store.dispatch("offline/APP_SAVE_OFFLINE_REQUEST", serialized).then(response => {
          resolve(true)
        }).catch(error => {
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
      
      return prevPromise.then(() => {
        // deserialize function: convert the request in a Promise.resolve(request)
        return this.deserialize(serialized).then((request) => {
          // request submission

            return http.request(request).then(response => {
              // update localForage
              if (response) {
                alert.success("Job Sent: " + serialized.type + " ID: " + serialized.id);
                this.refresh(serialized);
              }
            }).catch(error =>{
              let message = error.response ? error.response.data.error : ' Network Error';
              
              if(error.response){
                serialized["error"] = message;
                
                notification.pushNotification("Request Failed: " + message,"me","requestFailed",serialized);
                
                this.refresh(serialized);
              }
              
              alert.error("Request Failed: " + message,"bottom")
                //store.dispatch("auth/AUTH_LOGOUT");
                //alert.error("Error Sending Job: "+serialized.type+ " ID: "+ serialized.id );
            });

        });
      });
    }, Promise.resolve());
    return sending;
  }
  
  /**
   * clean offlineRequest of localstorage
   * @returns {PromiseLike<T> | Promise<T>}
   */
  async sendAndflushRequests(offReqsts) {
    offReqsts = this.currentOfflineUserRequests(offReqsts);
      //If empty, nothing to do!
    
      if (!offReqsts.length) {
        store.dispatch("offline/APP_ONLINE");
        return Promise.resolve();
      }
      
      
      
      //Else, send the requests in order, then dispatch ONLINE state
      return this.sendRequests(offReqsts).then(() => {
        store.dispatch("offline/APP_ONLINE");
      });

  }
  
  /**
   * each request sent, its refresh the requests list in localForage
   * @param request
   */
  async refresh(request) {
    //get offlineRequests
    let offReqsts = await helper.storage.get.item("offlineRequests");
    let userId = store.getters["auth/user"].id;
    let pos = -1;
    // find in offrequests by type and id
    offReqsts.forEach((offReq, index) => {
      if (offReq.id == request.id && offReq.type == request.type && userId == request.userId)
        pos = index;
    })
    if(pos != -1)
      offReqsts.splice(pos, 1);
  
  
    await helper.storage.set('offlineRequests', offReqsts);

    await store.dispatch('offline/APP_ONLINE_SENDING_REQUESTS',offReqsts);
  }
  
  /**
   * find in total offRequests which are from the current user
   * @param offReqsts
   * @returns {Array}
   */
  currentOfflineUserRequests(requests) {
    requests = requests || [];
    requests = requests.slice(0);
    if(store.getters["auth/user"]) {
      let userId = store.getters["auth/user"].id;
      let resultRqsts = [];
      requests.forEach((rqst, index) => {
        if (rqst.userId == userId)
          resultRqsts.push(rqst);
      })
      return resultRqsts;
    }else
      return requests;
  }
  
  
}


const request = new Request();


export default ({Vue}) => {
  Vue.prototype.$request = request;
}

export {request};
