import appConfig from 'src/setup/app'
import { cache, eventBus, alert } from "src/plugins/utils";
import { moduleOfflineHandler } from '../../_plugins/moduleOfflineHandler'

export const APP_ONLINE = ({ commit }) => {
    commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
    commit('APP_OFFLINE');
};

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {

    navigator.serviceWorker.addEventListener('message', eventListener => {
        const NAME_DB = 'workbox-background-sync'
        const NAME_STORAGE = 'requests'
        
        indexedDB.open(NAME_DB).onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(NAME_STORAGE, 'readonly')
            const objectStore = transaction.objectStore(NAME_STORAGE)
            objectStore.getAll().onsuccess = function(event) {
                const requests = event.target.result

                if (requests) {
                    commit('SET_REQUESTS', requests);
                    moduleOfflineHandler()
                }
            }
        }

        if (eventListener.data === 'sync-data') {
            alert.info('Synchronizing data')
        }
    })
}
