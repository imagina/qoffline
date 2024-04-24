import { alert } from "src/plugins/utils";
import { workOrderListRefreshHandler } from '../../_plugins/moduleOfflineHandler'

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
            alert.info('Synchronizing data')
            await workOrderListRefreshHandler(true)
        }
    })
}
