import axios from "axios";
import crud from "@imagina/qcrud/_services/baseService";
import appConfig from 'src/config/app'
import cache from "@imagina/qsite/_plugins/cache";
import Vue, {getCurrentInstance} from 'vue';
export const APP_ONLINE = ({ commit }) => {
  commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
  commit('APP_OFFLINE');
};

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {
  let interval = setInterval(async () => {
    let requests = await cache.get.item('requests');
    if (requests && Object.keys(requests).length) {
      let userRequests = requests[params.userId] || []
      if (userRequests) {
        commit('SET_REQUESTS', userRequests);
      }
    }
  }, 1000);

  commit('SET_INTERVAL', interval);
}

export const REFRESH_OFFLINE = ({ commit, dispatch, state }) => {
  return new Promise(async (resolve, reject) => {

    dispatch("SUB_MODULES_REFRESH_OFFLINE")

    let interval = setInterval(async () => {
      let refreshOffline = await cache.get.item("refreshOffline")
      if (refreshOffline) {
        dispatch("SUB_MODULES_REFRESH_OFFLINE", true)
        cache.set("refreshOffline", false)
        const instance = getCurrentInstance();
        const root = instance.proxy.$root
        root.$emit('page.data.refresh')
        root.$emit('crud.data.refresh')
        root.$emit('export.data.refresh')
      }
    }, 1000);

  })
}

export const SUB_MODULES_REFRESH_OFFLINE = ({ commit, dispatch, state }, refresh = false) => {
  appConfig.modules.forEach(moduleName => {
    let offlineConfig = false

    //Search module in node_modules
    try {
      offlineConfig = require(`@imagina/${moduleName}/_config/offline`)
    } catch (e) {
    }

    //Search module in project (src)
    try {
      offlineConfig = require(`src/modules/${moduleName}/_config/offline`)
    } catch (e) {
    }

    offlineConfig ? offlineConfig.default(refresh) : {}

  });
};