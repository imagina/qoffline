<template>
  <q-banner v-if="$store.state.qofflineMaster.isAppOffline" inline-actions class="text-white bg-red text-center offline-bar">
    {{ $tr('isite.cms.message.appOffline') }}
  </q-banner>
</template>

<script>
export default {
  name: "Alert",
  beforeDestroy(){
    window.removeEventListener("online", this.connectionSwitch);
    window.removeEventListener("offline", this.connectionSwitch);
  },
  mounted() {
    window.addEventListener("online", this.connectionSwitch);
    window.addEventListener("offline", this.connectionSwitch);
    this.connectionSwitch();  
  },
  methods: {
    connectionSwitch() {
      if (navigator.onLine) {
        this.$store.dispatch("qofflineMaster/APP_ONLINE")
      }else{
        this.$store.dispatch("qofflineMaster/APP_OFFLINE")
      }
    },
  }
}
</script>

<style scoped>
  .offline-bar{
    position: fixed;
    bottom: 60px;
    width: 100%;
    transform: translateX(-15px);
  }
  @media(min-width: 991px){
      .offline-bar{
        bottom: 0;
        transform: translateX(-20px);
      }
    }
</style>