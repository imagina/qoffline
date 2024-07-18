import { alert } from "src/plugins/utils";
import { preloadData } from '../../_plugins/handleModuleCalls'

export const APP_ONLINE = ({ commit }) => {
    commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
    commit('APP_OFFLINE');
};

const nameDB = () => {
    const hostname = self.location.hostname.split('.')
    const response = hostname
  
    //Set capitalize to all words
    hostname.forEach((word, index) => {
      if (index >= 1) {
        hostname[index] = word.charAt(0).toUpperCase() + word.slice(1)
      }
    })
  
    //Remove .com .org....
    if (hostname.length >= 2) response.pop()
  
    return `${response.join('')}DB`
  }

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {
    navigator.serviceWorker.addEventListener('message', async eventListener => {
        const NAME_STORAGE = 'storage'
        const openDB = indexedDB.open(nameDB())

        openDB.onsuccess = async function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(NAME_STORAGE)) return
            const transaction = db.transaction(NAME_STORAGE, 'readonly')
            const storage = transaction.objectStore(NAME_STORAGE)

            const request = storage.get('requests')

            request.onsuccess = async function(event) {
                const requests = event.target.result

                if (requests) {
                    commit('SET_REQUESTS', requests.requests);
                }
            }
        }
        
        openDB.onerror = (event) => {
            console.error(event.target.error)
        }
        
    
        if (eventListener.data === 'sync-data') {
            await preloadData('refresh')
            if (typeof params.callback === 'function') params.callback(true)
            alert.info('Synchronizing data')
        }
    })
}
