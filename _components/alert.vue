<template>
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
      } else {
        console.log("Testing")
        this.$store.dispatch("qofflineMaster/APP_OFFLINE")
        this.$q.notify({
          color: 'warning',
          textColor: "dark",
          icon: 'fa-light fa-cloud-slash',
          message: this.$tr('isite.cms.message.appOffline'),
          position: 'bottom-left',
          timeout: 20000,
          actions: [{ icon: 'close', color: 'white' }]
        })
      }
      
    },
  }
}
</script>

<style>
</style>