import { alert } from "src/plugins/utils";
import { preloadData } from '../../_plugins/handleModuleCalls'

export const APP_ONLINE = ({ commit }) => {
    commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
    commit('APP_OFFLINE');
};

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {
    navigator.serviceWorker.addEventListener('message', async eventListener => {
        const NAME_DB = 'workbox-background-sync'
        const NAME_STORAGE = 'requests'
        
        indexedDB.open(NAME_DB).onsuccess = async function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(NAME_STORAGE)) return
            const transaction = db.transaction(NAME_STORAGE, 'readonly')
            const objectStore = transaction.objectStore(NAME_STORAGE)
            objectStore.getAll().onsuccess = async function(event) {
                const requests = event.target.result

                if (requests) {
                    commit('SET_REQUESTS', requests);
                }
            }
        }

        if (eventListener.data === 'sync-data') {
            await preloadData('refresh')
            if (typeof params.callback === 'function') params.callback(true)
            alert.info('Synchronizing data')
        }
    })
}
