import { alert, cache } from "src/plugins/utils";
import { preloadData } from '../../_plugins/handleModuleCalls'

export const APP_ONLINE = ({ commit }) => {
    commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
    commit('APP_OFFLINE');
};

export const OPEN_MODAL_SYNC = ({ commit }) => {
    commit('HANDLE_MODAL_SYNC', true);
}

export const CLOSE_MODAL_SYNC = ({ commit }) => {
    commit('HANDLE_MODAL_SYNC', false);
}

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {
    navigator.serviceWorker.addEventListener('message', async eventListener => {
        const NAME_STORAGE = 'storage'
        const openDB = indexedDB.open(cache.nameDB())

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
        
    
        if (eventListener.data === 'synchronizing-data') {
            alert.info('Synchronizing data')
        }

        if (eventListener.data === 'synchronized-data') {
            await preloadData('refresh')
            if (typeof params.callback === 'function') params.callback(true)
            alert.info('Synchronized data')
        }
    })
}
