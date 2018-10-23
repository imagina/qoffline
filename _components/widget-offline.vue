<template>
  <div id="offlineBar">
    <q-alert
      type="warning"
      v-if="$store.state.offline.offlineMode"
      class="text-center"
      :actions="[{ label: this.$store.state.offline.totalRequests +' Pending Jobs', handler: () => { showActionSheetWithIcons() } }]">
      
      Offline Mode
      <q-icon name="wifi_off"/>
    </q-alert>
    <q-alert
      type="positive"
      v-if="$store.state.offline.sendingRequests"
      class="text-center"
      :actions="[{ label: this.$store.state.offline.totalRequests +' Pending Jobs', handler: () => { showActionSheetWithIcons() } }]">
      
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
        actions: []
      }
    },
    methods: {
      connectionSwitch() {
        
        if (navigator.onLine) {
          request.sendAndflushRequests();
        } else{
          this.$store.dispatch("offline/APP_OFFLINE")
        }
        
      },
      
      async showActionSheetWithIcons() {
        await helper.storage.get.item("offlineRequests").then(requests => {
          let actions = [];
          
          if (requests) {
            requests.forEach((request, index) => {
              actions.push({
                label: (index + 1) + '. Type: ' + request.type + ', ID: ' + request.id ,
                icon: 'fas fa-caret-right',
                handler: () => {}
              });
            })
          }
          actions = actions.length ? actions : [{
            label: 'No Jobs Pending',
            icon: 'far fa-thumbs-up',
            handler: () => {}
          }];
          this.$q.actionSheet({
            actions: actions
          }).then(action => {
            // user picked an action
          }).catch(() => {
            // user dismissed
          })
        })
      }
    }
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>