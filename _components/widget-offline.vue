<template>
  <div id="offlineBar">
    <q-page-sticky
      v-if="$store.state.offline.offlineMode"
      position="bottom-left"
      :offset="[18, 18]">
      <q-btn round color="warning" @click="offlineBar=!offlineBar" :icon="offlineBar ? 'arrow_drop_down' : 'wifi_off'" />
    </q-page-sticky>
    <q-alert
      type="warning"
      v-if="$store.state.offline.offlineMode && offlineBar"
      class="text-center"
      :actions="[{ label: this.$store.state.offline.totalOffRequests +' Pending Jobs', handler: () => { showActionSheetWithIcons() } }]">
      
      Offline Mode
      <q-icon name="wifi_off"/>
    </q-alert>
    <q-alert
      type="positive"
      v-if="$store.state.offline.sendingRequests"
      class="text-center"
      :actions="[{ label: this.$store.state.offline.totalOffRequests +' Pending Jobs', handler: () => { showActionSheetWithIcons() } }]">
      
      Online Mode, Sending Jobs
      <q-spinner-radio id="sendingJobs"></q-spinner-radio>
    </q-alert>
    <q-action-sheet
      v-model="requestActions"
      title="Pending to send"
    />
  </div>
</template>

<script>
  import {request} from '../_plugins/request';
  import {helper} from '@imagina/qhelper/_plugins/helper';
  
  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        // offline and online Events
        window.addEventListener('offline', this.connectionSwitch);
        window.addEventListener('online', this.connectionSwitch);
        
        // initializing offlineBar
        this.connectionSwitch();
      })
    },
    data() {
      return {
        requestActions: false,
        actions: [],
        offlineBar: false
      }
    },
    methods: {
      /**
       * switch state in store
       * if is onLine send and flush requests saved in localForage store
       */
      async connectionSwitch() {
        let offReqsts = await helper.storage.get.item("offlineRequests") || [];
        
        if (navigator.onLine) {
          if(!this.$store.getters["offline/isSendingRequests"]){
            this.$store.dispatch("offline/APP_ONLINE_SENDING_REQUESTS", offReqsts);
            request.sendAndflushRequests(offReqsts);
          }
        } else {
          this.$store.dispatch("offline/APP_OFFLINE")
        }
        
      },
      
      /**
       * Render list of pending requests saved in localForage
       * @returns {Promise<void>}
       */
      async showActionSheetWithIcons() {
        let requests = this.$store.getters["offline/offlineRequests"];
          let actions = [];
          if (requests) {
            requests.forEach((request, index) => {
              actions.push({
                label: (index + 1) + '. Type: ' + request.type + ', ID: ' + request.id,
                icon: 'fas fa-caret-right',
                handler: () => {
                }
              });
            })
          }
          actions = actions.length ? actions : [{
            label: 'No Pending Jobs',
            icon: 'thumb_up',
            handler: () => {
            }
          }];
          this.$q.actionSheet({
            actions: actions
          }).then(action => {
            // user picked an action
          }).catch(() => {
            // user dismissed
          })

      }
    }
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>