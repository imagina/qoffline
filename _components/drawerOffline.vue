<template>
  <div id="drawerOffline" class="q-pa-md">
    <!-- ===== Header ===== -->
    <div class="row justify-between items-center">
      <div class="text-subtitle1 row items-center">
        <q-icon name="fas fa-cog" color="primary" size="20px" class="q-mr-sm"/>
        <label>{{ $tr('isite.cms.label.offlineRequests', {capitalize: true}) }}</label>
      </div>
      <!-- Close icon -->
      <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer"
              @click="$eventBus.$emit('toggleMasterDrawer', 'offline')"/>
    </div>

    <!--Separator-->
    <q-separator class="q-my-md"/>

    <q-list>
    <div v-for="request in this.$store.state.qofflineMaster.requestsReversed" :key="request._id">
      <q-item class="q-py-xs">
        <q-item-section>
          <q-item-label>{{request.titleOffline}}</q-item-label>
          <q-item-label caption lines="2">{{ translateRequestMethod(request.method) }}</q-item-label>
        </q-item-section>


        <q-item-section side top>
          <q-icon v-if="request.status == 'failed'" name="fa-light fa-xmark" color="negative" />
          <q-icon v-if="request.status == 'success'" name="fa-light fa-check" color="positive" />
          <q-icon v-if="request.status == 'pending'" name="fa-light fa-spinner-third fa-spin" color="warning" />
          <q-item-label caption>{{ translateRequestStatus(request.status) }}</q-item-label>
          <q-item-label caption>{{ $moment(request.createdAt).fromNow() }}</q-item-label>
        </q-item-section>

      </q-item>
      <q-separator  class="q-my-xs" spaced inset />
    </div>





    </q-list>
  </div>
</template>

<script>
import cache from '@imagina/qsite/_plugins/cache'
export default {
  name: "Progressrequest",
  props: {},
  components: {},
  watch: {},

  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage');
  },
  mounted() {
    this.$nextTick(async () => {
      const offlineSetting = this.$store.getters['qsiteApp/getSettingValueByName']('isite::offline');
      this.$store.dispatch('qofflineMaster/OFFLINE_REQUESTS',{userId: this.$store.state.quserAuth.userId});
    });
  },
  data() {
    return {
      modal: {
        show: false,
        title: "Sync Offline Requests"
      },
      sessionData: {},
      progressRequestsCompleted: 0,
      progressLabel: '0.00%',
      requests: [],
      refreshIntervalId: null,
    }
  },
  computed: {
    getQuantityRoles() {
      return this.sessionData?.userData?.roles?.length || 0;
    },
    getQuantityRequests() {
      let countRequests = 0;
      this.sessionData?.userData?.roles.forEach(role => {
        if (role.options && role.options.offlineRequests) {
          countRequests += role.options.offlineRequests.length
        }
      });
      return countRequests === 0 ? countRequests : countRequests - 1;
    },
  },
  methods: {
    translateRequestStatus(status){
      switch(status){
        case 'pending': return "Pending";
        case 'success': return "Success";
        case 'failed': return "Failed";
      }
    },
    translateRequestMethod(method){
      switch(method){
        case 'post': return "Create";
        case 'put': return "Update";
        case 'delete': return "Delete";
      }
    },
    executeOfflineRequests() {
      const initialRequests = this.getQuantityRequests;
      if (initialRequests === 0) {
        this.progressLabel = '100.00%';
      } else {
        const percentageByRequest = (1 * 100) / (initialRequests);
        let quantityPercentage = 0;
        this.sessionData.userData.roles.forEach(role => {
          role.options.offlineRequests.forEach(async (offlineReq) => {
            await this.$crud.index(offlineReq.apiRoute, {params: {...offlineReq.requestParams}});
            quantityPercentage += percentageByRequest;
            this.progressRequestsCompleted = parseInt(quantityPercentage);
            this.progressLabel = `${quantityPercentage.toFixed(2)}%`;
          });
        })
        this.modal.show = false;
      }
    },


  },

}
</script>