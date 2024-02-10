import appConfig from 'src/config/app'
import cache from "modules/qsite/_plugins/cache";
import eventBus from 'modules/qsite/_plugins/eventBus';
import { moduleOfflineHandler } from '../../_plugins/moduleOfflineHandler'
//import Vue from 'vue'

export const APP_ONLINE = ({ commit }) => {
    commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
    commit('APP_OFFLINE');
};

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {
    let executed = false

    const interval = setInterval(async() => {
        const requests = await cache.get.item('requests');
        const STATUS = 'pending';

        if (requests && Object.keys(requests).length) {
            const userRequests = requests[params.userId] || []

            if (userRequests) {
                commit('SET_REQUESTS', userRequests);
                const pendingRequests = userRequests.filter(request => request.status === STATUS)

                const havePendingRequests = pendingRequests.length > 0
                const haveUserRequests = userRequests.length > 0

                if (havePendingRequests) executed = false

                if (!havePendingRequests && haveUserRequests && !executed) {
                    //[ptc]Vue.prototype.$alert.info('Synchronizing data')

                    moduleOfflineHandler()
                    executed = true
                }
            }
        }
    }, 1000);

    commit('SET_INTERVAL', interval);
}

export const REFRESH_OFFLINE = ({ commit, dispatch, state }) => {
    return new Promise(async(resolve, reject) => {

        dispatch("SUB_MODULES_REFRESH_OFFLINE")

        let interval = setInterval(async() => {
            let refreshOffline = await cache.get.item("refreshOffline")
            if (refreshOffline) {
                dispatch("SUB_MODULES_REFRESH_OFFLINE", true)
                cache.set("refreshOffline", false)
                eventBus.$emit('page.data.refresh')
                eventBus.$emit('crud.data.refresh')
                eventBus.$emit('export.data.refresh')
            }
        }, 1000);

    })
}

export const SUB_MODULES_REFRESH_OFFLINE = ({ commit, dispatch, state }, refresh = false) => {
    appConfig.modules.forEach(moduleName => {
        let offlineConfig = false

        //Search module in node_modules
        try {
            offlineConfig = require(`modules/${moduleName}/_config/offline`)
        } catch (e) {}

        //Search module in project (src)
        try {
            offlineConfig = require(`src/modules/${moduleName}/_config/offline`)
        } catch (e) {}

        offlineConfig ? offlineConfig.default(refresh) : {}

    });
};
